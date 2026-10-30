import subprocess
import time
import urllib.request
import os
import json

TEST_SCENARIO = {
  "browser": {
    "mode": "launch",
    "executable_path": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  },
  "start_url": {
    "url": "http://localhost:3000/puppies"
  },
  "environment": {
    "viewport": { "width": 1280, "height": 800, "device_scale_factor": 1 }
  },
  "capture": {
    "after_each_step": ["url"],
    "at_end": ["url"]
  },
  "actions": [
    {
      "step_id": "wait_puppies_page",
      "action": "wait_for_timeout",
      "duration_ms": 1000
    },
    {
      "step_id": "click_maltipoo_card",
      "action": "click",
      "locator": {
        "kind": "css",
        "selector": "a[href='/puppies/maltipoo-max-male']"
      }
    },
    {
      "step_id": "wait_detail_page",
      "action": "wait_for_timeout",
      "duration_ms": 1000
    },
    {
      "step_id": "navigate_to_faq",
      "action": "click",
      "locator": {
        "kind": "css",
        "selector": "nav[aria-label='Main'] a[href='/faq']"
      }
    },
    {
      "step_id": "wait_faq_page",
      "action": "wait_for_timeout",
      "duration_ms": 1000
    },
    {
      "step_id": "navigate_to_contact",
      "action": "click",
      "locator": {
        "kind": "css",
        "selector": "nav[aria-label='Main'] a[href='/contact']"
      }
    },
    {
      "step_id": "wait_contact_page",
      "action": "wait_for_timeout",
      "duration_ms": 1000
    }
  ]
}

def wait_for_server(url, timeout=20):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url) as resp:
                if resp.status == 200:
                    return True
        except Exception:
            time.sleep(0.5)
    return False

def run_tests():
    env = os.environ.copy()
    env["PATH"] = r"C:\Users\suhan\node26;" + env.get("PATH", "")

    with open("scripts/interactive_test_scenario.json", "w", encoding="utf-8") as f:
        json.dump(TEST_SCENARIO, f, indent=2)

    server_proc = subprocess.Popen(
        ["cmd.exe", "/c", "npm", "run", "dev"],
        cwd=r"D:\Blu_tai",
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    try:
        if not wait_for_server("http://localhost:3000"):
            print("Failed to reach Vite server within timeout")
            return False

        print("\nExecuting full interactive navigation scenario via REA...")
        cmd = ["cmd.exe", "/c", "npx.cmd", "rea-agents@latest", "capture-browser-scenario", "scripts/interactive_test_scenario.json", "--format", "json"]
        result = subprocess.run(cmd, env=env, capture_output=True, text=True, encoding="utf-8", errors="ignore")
        
        scenario_ok = False
        if result.returncode == 0:
            try:
                data = json.loads(result.stdout)
                steps = data.get("normalized_result", {}).get("steps", [])
                print(f"REA Scenario completed {len(steps)} steps successfully!")
                for s in steps:
                    step_id = s.get("step_id")
                    url = s.get("after_url", {}).get("url")
                    status = s.get("status")
                    print(f"  Step '{step_id}': status={status}, URL={url}")
                scenario_ok = True
            except Exception as e:
                print("Failed to parse REA scenario output:", e)
        else:
            print("REA scenario execution failed:", result.stderr)

        return scenario_ok

    finally:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=5)
        except Exception:
            server_proc.kill()

if __name__ == "__main__":
    run_tests()
