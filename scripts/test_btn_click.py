import asyncio
import os
import subprocess
import json
import urllib.request
import websockets

async def eval_js(ws, expr):
    msg = {"id": 1, "method": "Runtime.evaluate", "params": {"expression": expr, "returnByValue": True, "awaitPromise": True}}
    await ws.send(json.dumps(msg))
    while True:
        res = json.loads(await ws.recv())
        if res.get("id") == 1:
            return res.get("result", {}).get("value")

async def main():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    user_data = os.path.abspath(".chrome_test_click")
    os.makedirs(user_data, exist_ok=True)
    proc = subprocess.Popen([chrome_path, "--remote-debugging-port=9226", f"--user-data-dir={user_data}", "--headless=new", "--disable-gpu"])
    await asyncio.sleep(2)
    try:
        targets = json.loads(urllib.request.urlopen("http://127.0.0.1:9226/json").read())
        ws_url = targets[0]["webSocketDebuggerUrl"]
        async with websockets.connect(ws_url) as ws:
            msg = {"id": 2, "method": "Page.navigate", "params": {"url": "http://localhost:3001/faq"}}
            await ws.send(json.dumps(msg))
            await asyncio.sleep(2)
            
            # Check what button does
            res = await eval_js(ws, """(() => {
                const btn = document.querySelector('.tp-note button');
                console.log('button:', btn);
                btn.click();
                return {
                    text: btn.textContent,
                    parentNote: btn.closest('.tp-note').outerHTML.substring(0, 200),
                    container: document.querySelector('.tp-notes').outerHTML.substring(0, 200)
                };
            })()""")
            print(json.dumps(res, indent=2))
    finally:
        proc.terminate()

if __name__ == "__main__":
    asyncio.run(main())

