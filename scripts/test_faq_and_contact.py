import asyncio
import os
import sys
import subprocess
import json
import urllib.request
import base64
import websockets

PORT = 3001
CDP_PORT = 9224

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
    user_data = os.path.abspath(".chrome_test_profile_faq_contact")
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
        page_target = next(t for t in targets if t.get("type") == "page")
        ws_url = page_target["webSocketDebuggerUrl"]
        
        async with websockets.connect(ws_url) as ws:
            await send_cdp(ws, "Page.enable")
            await send_cdp(ws, "DOM.enable")
            
            # ==========================================
            # 1. TEST FAQ PAGE
            # ==========================================
            print("\n==========================================")
            print("1. TESTING FAQ PAGE MASCOT & SPEECH BUBBLE")
            print("==========================================")
            await send_cdp(ws, "Page.navigate", {"url": f"http://localhost:{PORT}/faq"})
            await asyncio.sleep(2.0)
            
            # Check mascot presence
            faq_mascot = await eval_js(ws, """(() => {
                const teddy = document.querySelector('.tp-notes__teddy');
                if (!teddy) return { found: false };
                const bubble = teddy.querySelector('.tp-notes__bubble');
                const q = bubble ? bubble.querySelector('.tp-notes__q') : null;
                const a = bubble ? bubble.querySelector('.tp-notes__a') : null;
                const pup = teddy.querySelector('.pup-buddy');
                const pupBubble = pup ? pup.querySelector('.pup-bubble') : null;
                const tail = pup ? pup.querySelector('[data-p="tail"]') : null;
                
                const qStyle = q ? window.getComputedStyle(q) : null;
                const aStyle = a ? window.getComputedStyle(a) : null;
                
                return {
                    found: true,
                    facing: pup ? pup.getAttribute('data-facing') : null,
                    qVisible: qStyle ? qStyle.opacity !== '0' : false,
                    aVisible: aStyle ? aStyle.opacity !== '0' : false,
                    tailTransform: tail ? tail.getAttribute('transform') : null,
                    pupBubbleShow: pupBubble ? pupBubble.getAttribute('data-show') : null
                };
            })()""")
            print("FAQ Mascot initial state:", json.dumps(faq_mascot, indent=2))
            assert faq_mascot["found"], "FAQ mascot not found!"
            assert faq_mascot["qVisible"], "Default state should show '?' in round bubble!"
            
            # Verify continuous tail wagging
            t1 = await eval_js(ws, "document.querySelector('.tp-notes__teddy [data-p=\"tail\"]').getAttribute('transform')")
            await asyncio.sleep(0.3)
            t2 = await eval_js(ws, "document.querySelector('.tp-notes__teddy [data-p=\"tail\"]').getAttribute('transform')")
            print(f"FAQ tail wagging verification: '{t1}' -> '{t2}' (diff: {t1 != t2})")
            assert t1 != t2, "Tail must wag continuously!"
            
            # Capture initial FAQ state
            ss = await send_cdp(ws, "Page.captureScreenshot", {"format": "png"})
            with open("faq_initial_q.png", "wb") as f:
                f.write(base64.b64decode(ss["data"]))
            print("Saved screenshot: faq_initial_q.png")
            
            # Open first FAQ accordion item
            print("\nOpening first FAQ question to test '?' -> '!' bubble transition...")
            await eval_js(ws, "document.querySelector('.tp-note button').click()")
            await asyncio.sleep(0.4)
            
            open_res = await eval_js(ws, """(() => {
                const btn = document.querySelector('.tp-note button');
                const notesContainer = document.querySelector('.tp-notes');
                const q = document.querySelector('.tp-notes__q');
                const a = document.querySelector('.tp-notes__a');
                const qStyle = q ? window.getComputedStyle(q) : null;
                const aStyle = a ? window.getComputedStyle(a) : null;
                return {
                    hasDataOpen: notesContainer ? notesContainer.hasAttribute('data-open') : false,
                    btnExpanded: btn ? btn.getAttribute('aria-expanded') : null,
                    qOpacity: qStyle ? qStyle.opacity : null,
                    aOpacity: aStyle ? aStyle.opacity : null
                };
            })()""")
            print("State after opening question:", json.dumps(open_res, indent=2))
            assert open_res["hasDataOpen"], "Container must have data-open attribute when a question is open!"
            
            ss = await send_cdp(ws, "Page.captureScreenshot", {"format": "png"})
            with open("faq_note_opened_exclamation.png", "wb") as f:
                f.write(base64.b64decode(ss["data"]))
            print("Saved screenshot: faq_note_opened_exclamation.png")
            
            # Test Search input filtering
            print("\nTesting Search Input ('Korea')...")
            await eval_js(ws, """(() => {
                const input = document.getElementById('faq-search-input');
                // Use native value setter for React controlled component
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(input, 'Korea');
                input.dispatchEvent(new Event('input', { bubbles: true }));
            })()""")
            await asyncio.sleep(0.4)
            search_res = await eval_js(ws, """(() => {
                const count = document.querySelector('.tp-notes__count');
                const visibleNotes = document.querySelectorAll('.tp-notes__list .tp-note:not(.tp-note--empty)');
                return {
                    countText: count ? count.textContent : null,
                    visibleNotesCount: visibleNotes.length
                };
            })()""")
            print("Search result for 'Korea':", json.dumps(search_res, indent=2))
            assert "2 notes on the board" in search_res["countText"], "Count should update to 2 notes on the board!"
            
            # Clear search
            await eval_js(ws, """(() => {
                const input = document.getElementById('faq-search-input');
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(input, '');
                input.dispatchEvent(new Event('input', { bubbles: true }));
            })()""")
            await asyncio.sleep(0.3)
            
            # Test Mascot Click Interaction & Speech Bubble
            print("\nTesting Mascot Click Interaction & Speech Bubble...")
            await eval_js(ws, "document.querySelector('.tp-notes__teddy .pup-buddy').click()")
            await asyncio.sleep(0.3)
            click_res = await eval_js(ws, """(() => {
                const pup = document.querySelector('.tp-notes__teddy .pup-buddy');
                const bubble = pup.querySelector('.pup-bubble');
                const notesBubble = document.querySelector('.tp-notes__bubble');
                const nbStyle = notesBubble ? window.getComputedStyle(notesBubble) : null;
                return {
                    isPlaying: pup.hasAttribute('data-playing'),
                    pupBubbleShow: bubble ? bubble.getAttribute('data-show') : null,
                    pupBubbleText: bubble ? bubble.textContent : null,
                    notesBubbleOpacity: nbStyle ? nbStyle.opacity : null
                };
            })()""")
            print("Mascot click interaction result:", json.dumps(click_res, indent=2))
            assert click_res["pupBubbleShow"] == "true", "Pupil speech bubble must show on click!"
            assert click_res["pupBubbleText"], "Pupil speech bubble must contain message!"
            
            ss = await send_cdp(ws, "Page.captureScreenshot", {"format": "png"})
            with open("faq_mascot_speaking.png", "wb") as f:
                f.write(base64.b64decode(ss["data"]))
            print("Saved screenshot: faq_mascot_speaking.png")
            
            # ==========================================
            # 2. TEST CONTACT PAGE
            # ==========================================
            print("\n==========================================")
            print("2. TESTING CONTACT PAGE MASCOT")
            print("==========================================")
            await send_cdp(ws, "Page.navigate", {"url": f"http://localhost:{PORT}/contact"})
            await asyncio.sleep(2.0)
            
            # Scroll contact mascot into view
            await eval_js(ws, "document.querySelector('.tp-page[data-page=\"contact\"] .pup-buddy').scrollIntoView({ block: 'center' })")
            await asyncio.sleep(0.5)
            
            contact_mascot = await eval_js(ws, """(() => {
                const pup = document.querySelector('.tp-letterform + div .pup-buddy') ||
                            document.querySelector('.tp-post + div .pup-buddy') ||
                            document.querySelector('.tp-page[data-page="contact"] .pup-buddy');
                if (!pup) return { found: false };
                const tail = pup.querySelector('[data-p="tail"]');
                const body = pup.querySelector('[data-p="body"]');
                const head = pup.querySelector('[data-p="head"]');
                return {
                    found: true,
                    facing: pup.getAttribute('data-facing'),
                    tailTransform: tail ? tail.getAttribute('transform') : null,
                    bodyTransform: body ? body.getAttribute('transform') : null,
                    headTransform: head ? head.getAttribute('transform') : null
                };
            })()""")
            print("Contact Mascot state:", json.dumps(contact_mascot, indent=2))
            assert contact_mascot["found"], "Contact mascot not found!"
            assert contact_mascot["facing"] == "left", "Contact mascot must face left!"
            
            # Verify continuous independent tail wagging
            ct1 = await eval_js(ws, "document.querySelector('.tp-page[data-page=\"contact\"] .pup-buddy [data-p=\"tail\"]').getAttribute('transform')")
            cb1 = await eval_js(ws, "document.querySelector('.tp-page[data-page=\"contact\"] .pup-buddy [data-p=\"body\"]').getAttribute('transform')")
            await asyncio.sleep(0.35)
            ct2 = await eval_js(ws, "document.querySelector('.tp-page[data-page=\"contact\"] .pup-buddy [data-p=\"tail\"]').getAttribute('transform')")
            cb2 = await eval_js(ws, "document.querySelector('.tp-page[data-page=\"contact\"] .pup-buddy [data-p=\"body\"]').getAttribute('transform')")
            
            print(f"Contact tail wagging: '{ct1}' -> '{ct2}' (changed: {ct1 != ct2})")
            print(f"Contact body seated posture: '{cb1}' (stable: {cb1 == cb2})")
            assert ct1 != ct2, "Tail must move independently!"
            assert "rotate(-24" in cb1, "Body must maintain seated posture without rotating the entire dog!"
            
            # Test Pointer Gaze tracking
            print("\nTesting pointer gaze tracking on Contact Mascot...")
            await eval_js(ws, """(() => {
                window.dispatchEvent(new PointerEvent('pointermove', {
                    clientX: 200,
                    clientY: 600,
                    bubbles: true
                }));
            })()""")
            await asyncio.sleep(0.3)
            eyes_look = await eval_js(ws, "document.querySelector('.tp-page[data-page=\"contact\"] .pup-buddy [data-p=\"eyes\"]').getAttribute('transform')")
            print(f"Eyes gaze transform after pointer move: '{eyes_look}'")
            
            ss = await send_cdp(ws, "Page.captureScreenshot", {"format": "png"})
            with open("contact_mascot_tail_wagging.png", "wb") as f:
                f.write(base64.b64decode(ss["data"]))
            print("Saved screenshot: contact_mascot_tail_wagging.png")
            
            print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
            
    finally:
        proc.terminate()

if __name__ == "__main__":
    asyncio.run(main())
