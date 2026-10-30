import subprocess
import time
import urllib.request
import os
import json
import base64

CAPTURES = [
    ("scripts/capture_clone_desktop.json", "reference/screenshots/clone_desktop_1440x900.png"),
    ("scripts/capture_clone_laptop.json", "reference/screenshots/clone_laptop_1366x768.png"),
    ("scripts/capture_clone_tablet.json", "reference/screenshots/clone_tablet_768x1024.png"),
    ("scripts/capture_clone_mobile.json", "reference/screenshots/clone_mobile_390x844.png"),
]

def wait_for_server(url, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url) as resp:
                if resp.status == 200:
                    return True
        except Exception:
            time.sleep(1)
    return False

def run():
    env = os.environ.copy()
    env["PATH"] = r"C:\Users\suhan\node26;" + env.get("PATH", "")

    print("Starting Vite server...")
    server_proc = subprocess.Popen(
        ["cmd.exe", "/c", "npm", "run", "dev"],
        cwd=r"D:\Blu_tai",
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    try:
        if not wait_for_server("http://localhost:3000"):
            print("Failed to reach Vite server within 30s")
            return

        print("Vite server is UP at http://localhost:3000!")

        for spec_file, out_png in CAPTURES:
            print(f"Running REA capture for {spec_file} -> {out_png}...")
            cmd = ["cmd.exe", "/c", "npx.cmd", "rea-agents@latest", "capture-browser-scenario", spec_file, "--format", "json"]
            result = subprocess.run(cmd, env=env, capture_output=True, text=True, encoding="utf-8", errors="ignore")
            if result.returncode != 0:
                print(f"Error executing {spec_file}: {result.stderr}")
                continue

            try:
                data = json.loads(result.stdout)
                saved = False
                for s in data.get("normalized_result", {}).get("steps", []):
                    val = s.get("artifacts", {}).get("screenshot", {}).get("value")
                    if val and "data_base64" in val:
                        img_bytes = base64.b64decode(val["data_base64"])
                        with open(out_png, "wb") as f:
                            f.write(img_bytes)
                        print(f"Saved {out_png} ({len(img_bytes)} bytes)")
                        saved = True
                        break
                if not saved:
                    print(f"No screenshot found in output for {spec_file}")
            except Exception as e:
                print(f"Parse error for {spec_file}: {e}")

    finally:
        print("Terminating server...")
        server_proc.terminate()
        try:
            server_proc.wait(timeout=5)
        except Exception:
            server_proc.kill()
        print("Server stopped.")

if __name__ == "__main__":
    run()

