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
    user_data = os.path.abspath(".chrome_test_click2")
    os.makedirs(user_data, exist_ok=True)
    proc = subprocess.Popen([chrome_path, "--remote-debugging-port=9227", f"--user-data-dir={user_data}", "--headless=new", "--disable-gpu"])
    await asyncio.sleep(2)
    try:
        targets = json.loads(urllib.request.urlopen("http://127.0.0.1:9227/json").read())
        ws_url = targets[0]["webSocketDebuggerUrl"]
        async with websockets.connect(ws_url) as ws:
            await send_cdp(ws, "Page.enable")
            await send_cdp(ws, "Page.navigate", {"url": "http://localhost:3001/faq"})
            await asyncio.sleep(2)
            
            # Click button
            await eval_js(ws, "document.querySelector('.tp-note button').click()")
            await asyncio.sleep(0.5)
            
            res = await eval_js(ws, """(() => {
                const btn = document.querySelector('.tp-note button');
                const note = btn.closest('.tp-note');
                const container = document.querySelector('.tp-notes');
                return {
                    hasDataOpen: container.hasAttribute('data-open'),
                    dataOpenVal: container.getAttribute('data-open'),
                    hasDataUnfolded: note.hasAttribute('data-unfolded'),
                    dataUnfoldedVal: note.getAttribute('data-unfolded'),
                    ariaExpanded: btn.getAttribute('aria-expanded')
                };
            })()""")
            print("After click:", json.dumps(res, indent=2))
    finally:
        proc.terminate()

if __name__ == "__main__":
    asyncio.run(main())

