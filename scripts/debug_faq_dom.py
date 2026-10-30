import asyncio
import os
import subprocess
import json
import urllib.request
import websockets

async def send_cdp(ws, method, params=None, id_counter=[1]):
    msg_id = id_counter[0]
    id_counter[0] += 1
    req = {"id": msg_id, "method": method, "params": params or {}}
    await ws.send(json.dumps(req))
    while True:
        res = json.loads(await ws.recv())
        if res.get("id") == msg_id:
            return res.get("result", {})

async def eval_js(ws, expr):
    res = await send_cdp(ws, "Runtime.evaluate", {
        "expression": expr,
        "returnByValue": True,
        "awaitPromise": True
    })
    return res.get("result", {}).get("value")

async def main():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    user_data = os.path.abspath(".chrome_debug_faq")
    os.makedirs(user_data, exist_ok=True)
    
    proc = subprocess.Popen([
        chrome_path,
        "--remote-debugging-port=9225",
        f"--user-data-dir={user_data}",
        "--headless=new",
        "--disable-gpu"
    ])
    await asyncio.sleep(2)
    
    try:
        targets = json.loads(urllib.request.urlopen("http://127.0.0.1:9225/json").read())
        ws_url = targets[0]["webSocketDebuggerUrl"]
        
        async with websockets.connect(ws_url) as ws:
            await send_cdp(ws, "Page.enable")
            await send_cdp(ws, "Page.navigate", {"url": "http://localhost:3001/faq"})
            await asyncio.sleep(2)
            
            # Check console errors
            html = await eval_js(ws, "document.body.innerHTML")
            print("HTML length:", len(html))
            if "tp-notes__teddy" in html:
                print("Found .tp-notes__teddy in DOM!")
            else:
                print("Snippet:", html[:500])
                # Check if route curtain or transition is blocking
                curtain = await eval_js(ws, "Boolean(document.querySelector('.tp-curtain'))")
                print("Curtain present?", curtain)
    finally:
        proc.terminate()

if __name__ == "__main__":
    asyncio.run(main())
