import asyncio
import os
import subprocess
import json
import urllib.request
import websockets

async def main():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    user_data = os.path.abspath(".chrome_test_console")
    os.makedirs(user_data, exist_ok=True)
    proc = subprocess.Popen([chrome_path, "--remote-debugging-port=9229", f"--user-data-dir={user_data}", "--headless=new", "--disable-gpu"])
    await asyncio.sleep(2)
    try:
        targets = json.loads(urllib.request.urlopen("http://127.0.0.1:9229/json").read())
        ws_url = targets[0]["webSocketDebuggerUrl"]
        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({"id": 1, "method": "Runtime.enable"}))
            await ws.send(json.dumps({"id": 2, "method": "Page.enable"}))
            await ws.send(json.dumps({"id": 3, "method": "Page.navigate", "params": {"url": "http://localhost:3001/faq"}}))
            
            while True:
                msg = json.loads(await ws.recv())
                if msg.get("method") == "Runtime.exceptionThrown":
                    print("EXCEPTION:", json.dumps(msg, indent=2))
                    break
                elif msg.get("method") == "Runtime.consoleAPICalled":
                    print("CONSOLE:", msg.get("params", {}).get("args"))
    finally:
        proc.terminate()

if __name__ == "__main__":
    asyncio.run(asyncio.wait_for(main(), timeout=8))

