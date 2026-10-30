import asyncio
import os
import sys
import subprocess
import json
import urllib.request
import websockets

PORT = 3000
CDP_PORT = 9223

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
    user_data = os.path.abspath(".chrome_test_profile_footer")
    os.makedirs(user_data, exist_ok=True)
    
    proc = subprocess.Popen([
        chrome_path,
        f"--remote-debugging-port={CDP_PORT}",
        f"--user-data-dir={user_data}",
        "--headless=new",
        "--disable-gpu",
        "--window-size=1280,900"
    ])
    
    await asyncio.sleep(2)
    
    try:
        targets = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json").read())
        ws_url = targets[0]["webSocketDebuggerUrl"]
        
        async with websockets.connect(ws_url) as ws:
            await send_cdp(ws, "Page.enable")
            await send_cdp(ws, "DOM.enable")
            
            print("1. Testing Promotional Mascot in /how-it-works...")
            await send_cdp(ws, "Page.navigate", {"url": f"http://localhost:{PORT}/how-it-works"})
            await asyncio.sleep(2)
            
            # Scroll down to care card
            await eval_js(ws, "document.getElementById('care-title').scrollIntoView()")
            await asyncio.sleep(1)
            
            promo_info = await eval_js(ws, """(() => {
                const care = document.getElementById('care-title');
                const card = care ? care.closest('section') : null;
                const pup = card ? card.querySelector('.pup-buddy') : null;
                if (!pup) return { found: false };
                const body = pup.querySelector('[data-p="body"]');
                const head = pup.querySelector('[data-p="head"]');
                const tail = pup.querySelector('[data-p="tail"]');
                const fn = pup.querySelector('[data-p="fn"]');
                return {
                    found: true,
                    facing: pup.getAttribute('data-facing'),
                    bodyTransform: body ? body.getAttribute('transform') : null,
                    headTransform: head ? head.getAttribute('transform') : null,
                    tailTransform: tail ? tail.getAttribute('transform') : null,
                    fnTransform: fn ? fn.getAttribute('fn') || fn.getAttribute('transform') : null
                };
            })()""")
            print("Promotional mascot info:", json.dumps(promo_info, indent=2))
            
            # Check tail animation over 0.5s
            tail1 = await eval_js(ws, "document.getElementById('care-title').closest('section').querySelector('[data-p=\"tail\"]').getAttribute('transform')")
            await asyncio.sleep(0.3)
            tail2 = await eval_js(ws, "document.getElementById('care-title').closest('section').querySelector('[data-p=\"tail\"]').getAttribute('transform')")
            print(f"Promotional tail wagging: '{tail1}' -> '{tail2}' (diff: {tail1 != tail2})")
            
            # Capture screenshot of promotional mascot
            ss_res = await send_cdp(ws, "Page.captureScreenshot", {"format": "png"})
            import base64
            with open("how_it_works_promo_bow.png", "wb") as f:
                f.write(base64.b64decode(ss_res["data"]))
            print("Captured how_it_works_promo_bow.png")
            
            print("\n2. Testing Global Footer Mascot across routes...")
            routes = ["/how-it-works", "/", "/puppies", "/gone-home", "/happy-families", "/faq", "/contact"]
            
            for route in routes:
                print(f"\n--- Checking route: {route} ---")
                await send_cdp(ws, "Page.navigate", {"url": f"http://localhost:{PORT}{route}"})
                await asyncio.sleep(1.5)
                
                # Check footer exists
                footer_exists = await eval_js(ws, "Boolean(document.querySelector('.tp-footer'))")
                if not footer_exists:
                    print(f"ERROR: No footer found on {route}")
                    continue
                
                # Scroll to footer
                await eval_js(ws, "window.scrollTo(0, document.body.scrollHeight)")
                await asyncio.sleep(1.0)
                
                footer_pup_info = await eval_js(ws, """(() => {
                    const pup = document.querySelector('.tp-basket__pup');
                    if (!pup) return { found: false };
                    const ledge = pup.querySelector('[data-p="ledge"]');
                    const head = pup.querySelector('[data-p="head"]');
                    const bubble = pup.querySelector('.pup-bubble');
                    const cs = window.getComputedStyle(pup);
                    return {
                        found: true,
                        transform: cs.transform,
                        opacity: cs.opacity,
                        hasLedgePaws: Boolean(ledge),
                        ledgeOpacity: ledge ? ledge.getAttribute('opacity') : null,
                        hasHead: Boolean(head),
                        bubbleText: bubble ? bubble.textContent : null,
                        bubbleShow: bubble ? bubble.getAttribute('data-show') : null
                    };
                })()""")
                print(f"Footer pup on {route}:", json.dumps(footer_pup_info, indent=2))
                
                if route == "/how-it-works":
                    # Test click interaction and bubble
                    print("Testing click on footer mascot...")
                    click_res = await eval_js(ws, """(() => {
                        const pup = document.querySelector('.tp-basket__pup');
                        pup.click();
                        const bubble = pup.querySelector('.pup-bubble');
                        return {
                            bubbleShowAfterClick: bubble ? bubble.getAttribute('data-show') : null,
                            bubbleTextAfterClick: bubble ? bubble.textContent : null
                        };
                    })()""")
                    print("Click result:", json.dumps(click_res, indent=2))
                    
                    # Capture screenshot of footer mascot with bubble
                    ss_res = await send_cdp(ws, "Page.captureScreenshot", {"format": "png"})
                    with open("footer_pup_snug.png", "wb") as f:
                        f.write(base64.b64decode(ss_res["data"]))
                    print("Captured footer_pup_snug.png")
                    
    finally:
        proc.terminate()

if __name__ == "__main__":
    asyncio.run(main())

