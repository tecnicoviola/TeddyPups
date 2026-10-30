import subprocess
import json
import base64
import os

CAPTURES = [
    ("scripts/capture_reference_laptop.json", "reference/screenshots/original_laptop_1366x768.png"),
    ("scripts/capture_reference_tablet.json", "reference/screenshots/original_tablet_768x1024.png"),
    ("scripts/capture_reference_mobile.json", "reference/screenshots/original_mobile_390x844.png"),
]

def run():
    env = os.environ.copy()
    env["PATH"] = r"C:\Users\suhan\node26;" + env.get("PATH", "")

    for spec_file, out_png in CAPTURES:
        print(f"Running REA capture for {spec_file} -> {out_png}...")
        cmd = ["cmd.exe", "/c", "npx.cmd", "rea-agents@latest", "capture-browser-scenario", spec_file, "--format", "json"]
        result = subprocess.run(cmd, env=env, capture_output=True, text=True, encoding="utf-8", errors="ignore")
        if result.returncode != 0:
            print(f"Error running {spec_file}: {result.stderr}")
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
                print(f"Could not find screenshot in result for {spec_file}")
        except Exception as e:
            print(f"Failed to parse result for {spec_file}: {e}")

if __name__ == "__main__":
    run()

