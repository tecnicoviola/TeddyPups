import websocket, json, urllib.request, time, subprocess, os, base64, sys

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

ARTIFACT_DIR = r'C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394'
os.makedirs(ARTIFACT_DIR, exist_ok=True)

def run_tests():
    print("=== Testing Part 1: Paw Cursor & Part 2: Full-Screen Image Viewer ===")
    
    # 1. Verify cursor SVG assets over HTTP
    try:
        with urllib.request.urlopen('http://localhost:3000/cursor/paw.svg') as resp:
            paw_svg = resp.read().decode('utf-8')
            assert '<svg' in paw_svg, "paw.svg missing <svg"
            print("✓ /cursor/paw.svg loaded successfully")

        with urllib.request.urlopen('http://localhost:3000/cursor/paw-press.svg') as resp:
            press_svg = resp.read().decode('utf-8')
            assert '<svg' in press_svg, "paw-press.svg missing <svg"
            assert 'rx="15"' in press_svg, "paw-press.svg missing rounded square"
            assert '#2a170e' in press_svg, "paw-press.svg missing dark cocoa paw/border"
            print("✓ /cursor/paw-press.svg loaded successfully with authentic vector rounded-square background")
    except Exception as e:
        print(f"✗ Failed to load cursor SVG: {e}")
        return False

    # 2. Launch headless Chrome to test browser execution
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    user_data_dir = os.path.abspath(r'C:\Users\suhan\AppData\Local\Temp\chrome_viewer_profile')
    os.makedirs(user_data_dir, exist_ok=True)

    proc = subprocess.Popen([
        chrome_path,
        '--remote-debugging-port=9228',
        '--headless=new',
        '--disable-gpu',
        '--window-size=1440,900',
        f'--user-data-dir={user_data_dir}',
        'http://localhost:3000/happy-families'
    ])

    time.sleep(3.0)

    try:
        req = urllib.request.Request('http://127.0.0.1:9228/json/list')
        with urllib.request.urlopen(req) as resp:
            targets = json.loads(resp.read().decode())
        
        target = [t for t in targets if t.get('type') == 'page'][0]
        ws = websocket.create_connection(target['webSocketDebuggerUrl'])

        msg_id = [1]
        def call_cdp(method, params=None):
            if params is None: params = {}
            cur_id = msg_id[0]
            msg_id[0] += 1
            ws.send(json.dumps({'id': cur_id, 'method': method, 'params': params}))
            while True:
                res = json.loads(ws.recv())
                if res.get('id') == cur_id:
                    return res.get('result', {})

        call_cdp("Page.enable")
        call_cdp("DOM.enable")
        call_cdp("Runtime.enable")

        time.sleep(1.0)

        # Evaluate cursor styles on page
        cursor_check = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const bodyCursor = window.getComputedStyle(document.body).cursor;
                const printBtn = document.querySelector('.tp-wall__print');
                const btnCursor = printBtn ? window.getComputedStyle(printBtn).cursor : null;
                const printsCount = document.querySelectorAll('.tp-wall__print').length;
                return { bodyCursor, btnCursor, printsCount };
            })()
            """,
            "returnByValue": True
        })
        val = cursor_check.get('result', {}).get('value', {})
        print(f"Body cursor: {val.get('bodyCursor')}")
        print(f"Interactive button cursor: {val.get('btnCursor')}")
        print(f"Total photos found on Happy Families page: {val.get('printsCount')}")

        assert 'paw.svg' in val.get('bodyCursor', ''), "Default body cursor not using paw.svg"
        assert 'paw-press.svg' in val.get('btnCursor', ''), "Interactive button cursor not using paw-press.svg"
        assert val.get('printsCount') == 64, f"Expected 64 photos, found {val.get('printsCount')}"
        print("✓ Verified cursor styles and 64 photo buttons!")

        # Click photo 1
        print("\n--- Clicking Photo 1 ---")
        click_res = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const btn = document.querySelector('button[aria-label="Open photo 1 of 64"]');
                if (!btn) return { error: 'Button not found' };
                btn.click();
                return { ok: true };
            })()
            """,
            "returnByValue": True
        })
        print(f"Click response: {click_res}")
        time.sleep(0.5)

        # Check viewer state
        viewer_check = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const dialog = document.querySelector('dialog.tp-viewer');
                if (!dialog) return { found: false };
                const open = dialog.hasAttribute('open');
                const counter = dialog.querySelector('p')?.textContent;
                const img = dialog.querySelector('img')?.getAttribute('src');
                const closeBtn = dialog.querySelector('button[aria-label="Close viewer"]');
                const prevBtn = dialog.querySelector('button[aria-label="Previous photo"]');
                const nextBtn = dialog.querySelector('button[aria-label="Next photo"]');
                const bodyOverflow = document.body.style.overflow;
                return {
                    found: true,
                    open,
                    counter,
                    img,
                    hasClose: !!closeBtn,
                    hasPrev: !!prevBtn,
                    hasNext: !!nextBtn,
                    bodyOverflow
                };
            })()
            """,
            "returnByValue": True
        })
        viewer_val = viewer_check.get('result', {}).get('value', {})
        print(f"Viewer state after click: {viewer_val}")

        assert viewer_val.get('open') == True, "Dialog did not open"
        assert '1 / 64' in viewer_val.get('counter', ''), f"Counter mismatch: {viewer_val.get('counter')}"
        assert viewer_val.get('bodyOverflow') == 'hidden', f"Body scroll not locked: {viewer_val.get('bodyOverflow')}"
        print("✓ Dialog opened, counter shows 1 / 64, and body scroll locked!")

        # Take screenshot of viewer open
        shot1 = call_cdp("Page.captureScreenshot", {"format": "png"})
        shot1_path = os.path.join(ARTIFACT_DIR, "viewer_open.png")
        with open(shot1_path, "wb") as f:
            f.write(base64.b64decode(shot1['data']))
        print(f"✓ Saved screenshot: {shot1_path}")

        # Click Next button
        print("\n--- Clicking Next Photo ---")
        call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const nextBtn = document.querySelector('dialog.tp-viewer button[aria-label="Next photo"]');
                if (nextBtn) nextBtn.click();
            })()
            """
        })
        time.sleep(0.4)

        next_check = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const counter = document.querySelector('dialog.tp-viewer p')?.textContent;
                const img = document.querySelector('dialog.tp-viewer img')?.getAttribute('src');
                return { counter, img };
            })()
            """,
            "returnByValue": True
        })
        next_val = next_check.get('result', {}).get('value', {})
        print(f"State after Next: {next_val}")
        assert '2 / 64' in next_val.get('counter', ''), f"Expected 2 / 64, got {next_val.get('counter')}"
        print("✓ Counter updated to 2 / 64 after Next click!")

        # Take screenshot of viewer next
        shot2 = call_cdp("Page.captureScreenshot", {"format": "png"})
        shot2_path = os.path.join(ARTIFACT_DIR, "viewer_next.png")
        with open(shot2_path, "wb") as f:
            f.write(base64.b64decode(shot2['data']))
        print(f"✓ Saved screenshot: {shot2_path}")

        # Test keyboard navigation: ArrowRight -> 3 / 64, ArrowLeft -> 2 / 64
        print("\n--- Testing Keyboard Navigation ---")
        call_cdp("Input.dispatchKeyEvent", {
            "type": "rawKeyDown",
            "key": "ArrowRight",
            "code": "ArrowRight",
            "windowsVirtualKeyCode": 39
        })
        call_cdp("Input.dispatchKeyEvent", {
            "type": "keyUp",
            "key": "ArrowRight",
            "code": "ArrowRight",
            "windowsVirtualKeyCode": 39
        })
        time.sleep(0.3)

        k_val = call_cdp("Runtime.evaluate", {
            "expression": "document.querySelector('dialog.tp-viewer p')?.textContent",
            "returnByValue": True
        }).get('result', {}).get('value')
        print(f"Counter after ArrowRight: {k_val}")
        assert '3 / 64' in k_val, f"Expected 3 / 64 after ArrowRight, got {k_val}"

        call_cdp("Input.dispatchKeyEvent", {
            "type": "rawKeyDown",
            "key": "ArrowLeft",
            "code": "ArrowLeft",
            "windowsVirtualKeyCode": 37
        })
        call_cdp("Input.dispatchKeyEvent", {
            "type": "keyUp",
            "key": "ArrowLeft",
            "code": "ArrowLeft",
            "windowsVirtualKeyCode": 37
        })
        time.sleep(0.3)

        k2_val = call_cdp("Runtime.evaluate", {
            "expression": "document.querySelector('dialog.tp-viewer p')?.textContent",
            "returnByValue": True
        }).get('result', {}).get('value')
        print(f"Counter after ArrowLeft: {k2_val}")
        assert '2 / 64' in k2_val, f"Expected 2 / 64 after ArrowLeft, got {k2_val}"
        print("✓ ArrowRight and ArrowLeft keyboard navigation verified!")

        # Test Escape to close
        print("\n--- Testing Escape to Close ---")
        call_cdp("Input.dispatchKeyEvent", {
            "type": "rawKeyDown",
            "key": "Escape",
            "code": "Escape",
            "windowsVirtualKeyCode": 27
        })
        call_cdp("Input.dispatchKeyEvent", {
            "type": "keyUp",
            "key": "Escape",
            "code": "Escape",
            "windowsVirtualKeyCode": 27
        })
        time.sleep(0.4)

        close_check = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const dialog = document.querySelector('dialog.tp-viewer');
                return {
                    dialogExists: !!dialog,
                    bodyOverflow: document.body.style.overflow
                };
            })()
            """,
            "returnByValue": True
        })
        close_val = close_check.get('result', {}).get('value', {})
        print(f"State after Escape: {close_val}")
        assert close_val.get('dialogExists') == False, "Dialog should be closed and unmounted"
        assert close_val.get('bodyOverflow') == '', "Body overflow should be restored"
        print("✓ Dialog successfully closed with Escape key and body scroll restored!")

        # Also test on puppies page for puppy card paw button
        print("\n--- Testing Puppies Page Card Paw Button ---")
        call_cdp("Page.navigate", {"url": "http://localhost:3000/puppies"})
        time.sleep(2.0)

        card_check = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const pawBtn = document.querySelector('.tp-sketch, .tp-wall__print, button, a');
                const computed = pawBtn ? window.getComputedStyle(pawBtn).cursor : null;
                return { hasPawBtn: !!pawBtn, cursor: computed };
            })()
            """,
            "returnByValue": True
        })
        card_val = card_check.get('result', {}).get('value', {})
        print(f"Puppies card check: {card_val}")
        assert 'paw-press.svg' in card_val.get('cursor', ''), "Puppy card interactive cursor not paw-press.svg"
        print("✓ Puppy card interactive elements correctly use paw-press.svg!")

        # Screenshot puppies page
        shot3 = call_cdp("Page.captureScreenshot", {"format": "png"})
        shot3_path = os.path.join(ARTIFACT_DIR, "puppy_card_paw_hover.png")
        with open(shot3_path, "wb") as f:
            f.write(base64.b64decode(shot3['data']))
        print(f"✓ Saved screenshot: {shot3_path}")

        print("\nALL AUTOMATED TESTS PASSED SUCCESSFULLY! 🎉")
        return True

    finally:
        try:
            ws.close()
        except:
            pass
        proc.terminate()
        proc.wait()

if __name__ == '__main__':
    ok = run_tests()
    sys.exit(0 if ok else 1)
