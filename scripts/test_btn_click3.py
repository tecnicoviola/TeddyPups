import asyncio
import os
import subprocess
import json
import urllib.request
import websockets

id_counter = [1]
async def send_cdp(ws, method, params=None):
    msg_id = id_counter[0]
    id_counter[0] += 1
    req = {"id": msg_id, "method": method, "params": params or {}}
    await ws.send(json.dumps(req))
    while True:
        raw = await ws.recv()
        res = json.loads(raw)
        if res.get("id") == msg_id:
            return res

async def main():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    user_data = os.path.abspath(".chrome_test_click3")
    os.makedirs(user_data, exist_ok=True)
    proc = subprocess.Popen([chrome_path, "--remote-debugging-port=9228", f"--user-data-dir={user_data}", "--headless=new", "--disable-gpu"])
    await asyncio.sleep(2)
    try:
        raw = urllib.request.urlopen("http://127.0.0.1:9228/json").read()
        targets = json.loads(raw)
        page_target = next(t for t in targets if t.get("type") == "page")
        ws_url = page_target["webSocketDebuggerUrl"]
        async with websockets.connect(ws_url) as ws:
            await send_cdp(ws, "Page.enable")
            await send_cdp(ws, "Page.navigate", {"url": "http://localhost:3001/faq"})
            await asyncio.sleep(2.5)
            
            eval_res = await send_cdp(ws, "Runtime.evaluate", {
                "expression": "JSON.stringify({ href: window.location.href, title: document.title, readyState: document.readyState, body: document.body.innerText })",
                "returnByValue": True
            })
            print("Page info:", eval_res.get("result", {}).get("result", {}).get("value"))
    finally:
        proc.terminate()

if __name__ == "__main__":
    asyncio.run(main())
