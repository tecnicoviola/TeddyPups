import urllib.request
import json
import time
import os
import subprocess
import base64
import websocket

def test_transition_python():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    user_data_dir = os.path.abspath(r"C:\Users\suhan\AppData\Local\Temp\chrome_transition_profile")
    os.makedirs(user_data_dir, exist_ok=True)

    proc = subprocess.Popen([
        chrome_path,
        "--remote-debugging-port=9224",
        "--headless=new",
        "--disable-gpu",
        f"--user-data-dir={user_data_dir}",
        "http://localhost:3000"
    ])

    time.sleep(2.5)

    try:
        # Get websocket debugger URL
        req = urllib.request.Request("http://127.0.0.1:9224/json/list")
        with urllib.request.urlopen(req) as resp:
            targets = json.loads(resp.read().decode())
        
        target = [t for t in targets if t.get("type") == "page"][0]
        ws_url = target["webSocketDebuggerUrl"]
        print("Connected to:", ws_url)

        ws = websocket.create_connection(ws_url)

        msg_id = [1]
        def call_cdp(method, params=None):
            if params is None: params = {}
            cur_id = msg_id[0]
            msg_id[0] += 1
            payload = json.dumps({"id": cur_id, "method": method, "params": params})
            ws.send(payload)
            while True:
                res = json.loads(ws.recv())
                if res.get("id") == cur_id:
                    return res.get("result", {})

        call_cdp("Page.enable")
        call_cdp("Runtime.enable")
        call_cdp("Emulation.setDeviceMetricsOverride", {
            "width": 1280,
            "height": 800,
            "deviceScaleFactor": 1,
            "mobile": False
        })

        # Wait for initial intro animation to clear
        time.sleep(1.8)

        # Evaluate state after intro
        res1 = call_cdp("Runtime.evaluate", {"expression": "document.querySelector('.tp-curtain')?.dataset.state"})
        print("State after intro (idle):", res1.get("result", {}).get("value"))

        # Trigger navigation by clicking Puppies nav link
        print("Clicking a[href='/puppies']...")
        call_cdp("Runtime.evaluate", {"expression": "document.querySelector('a[href=\"/puppies\"]').click()"})

        # Immediate check (100ms)
        time.sleep(0.12)
        res2 = call_cdp("Runtime.evaluate", {"expression": "document.querySelector('.tp-curtain')?.dataset.state"})
        print("State during transition:", res2.get("result", {}).get("value"))

        # Capture screenshot of transition
        shot = call_cdp("Page.captureScreenshot", {"format": "png"})
        raw_png = base64.b64decode(shot["data"])
        out_png = r"C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394\page_transition_live.png"
        with open(out_png, "wb") as f:
            f.write(raw_png)
        print("Saved live transition screenshot:", out_png)

        # Wait for transition to complete and check final route
        time.sleep(1.0)
        res3 = call_cdp("Runtime.evaluate", {"expression": "JSON.stringify({ state: document.querySelector('.tp-curtain')?.dataset.state, path: window.location.pathname })"})
        print("State and Path after navigation:", res3.get("result", {}).get("value"))

        ws.close()
    finally:
        proc.kill()

if __name__ == "__main__":
    test_transition_python()

