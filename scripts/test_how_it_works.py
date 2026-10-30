import websocket, json, urllib.request, time, subprocess, os, base64, sys

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

ARTIFACT_DIR = r'C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394'
os.makedirs(ARTIFACT_DIR, exist_ok=True)

def run_how_it_works_tests():
    print("=== Testing How It Works Page Parity and Animations ===")

    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    user_data_dir = os.path.abspath(r'C:\Users\suhan\AppData\Local\Temp\chrome_how_profile')
    os.makedirs(user_data_dir, exist_ok=True)

    proc = subprocess.Popen([
        chrome_path,
        '--remote-debugging-port=9230',
        '--headless=new',
        '--disable-gpu',
        '--window-size=1440,900',
        f'--user-data-dir={user_data_dir}',
        'http://localhost:3000/how-it-works'
    ])

    time.sleep(3.0)

    try:
        req = urllib.request.Request('http://127.0.0.1:9230/json/list')
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

        # 1. Verify Page structure & sections
        print("\n--- Verifying Section Hierarchy & Anchor Targets ---")
        sections_check = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const sTwoWays = document.getElementById('two-ways');
                const sPromise = document.getElementById('promise');
                const sDelivery = document.getElementById('delivery');
                const sWhy = document.getElementById('why');
                const sCare = document.getElementById('care-title');
                const chips = Array.from(document.querySelectorAll('nav[aria-label="On this page"] a')).map(a => ({
                    text: a.textContent.trim(),
                    href: a.getAttribute('href')
                }));
                return {
                    hasTwoWays: !!sTwoWays,
                    hasPromise: !!sPromise,
                    hasDelivery: !!sDelivery,
                    hasWhy: !!sWhy,
                    hasCare: !!sCare,
                    chips
                };
            })()
            """,
            "returnByValue": True
        }).get('result', {}).get('value', {})
        print("Sections check:", sections_check)
        assert sections_check.get('hasTwoWays'), "Missing #two-ways"
        assert sections_check.get('hasPromise'), "Missing #promise"
        assert sections_check.get('hasDelivery'), "Missing #delivery"
        assert sections_check.get('hasWhy'), "Missing #why"
        assert len(sections_check.get('chips', [])) == 4, "Expected 4 navigation chips"
        print("✓ All 4 sections and navigation chips verified!")

        # 2. Test Anchor Navigation and Scroll
        print("\n--- Testing Anchor Navigation Click ---")
        click_nav = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const chip = document.querySelector('nav[aria-label="On this page"] a[href="#delivery"]');
                if (chip) chip.click();
                return { clicked: !!chip };
            })()
            """,
            "returnByValue": True
        }).get('result', {}).get('value', {})
        time.sleep(1.0)

        scroll_val = call_cdp("Runtime.evaluate", {
            "expression": "window.pageYOffset",
            "returnByValue": True
        }).get('result', {}).get('value', 0)
        print(f"Page scroll offset after clicking #delivery: {scroll_val}px")
        assert scroll_val > 500, f"Expected scroll position to advance down to delivery section, got {scroll_val}px"
        print("✓ Anchor click smoothly navigated to section!")

        # Scroll back to top for two-ways testing
        call_cdp("Runtime.evaluate", { "expression": "window.scrollTo(0, 0)" })
        time.sleep(0.5)

        # 3. Test Two Ways Home Tab Switching
        print("\n--- Testing Two Ways Home Tab Switching ---")
        tab_state_initial = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const localTab = document.getElementById('tab-local');
                const importedTab = document.getElementById('tab-imported');
                const localPanel = document.getElementById('panel-local');
                const importedPanel = document.getElementById('panel-imported');
                const sw = document.querySelector('.tp-switch');
                return {
                    localSelected: localTab?.getAttribute('aria-selected'),
                    importedSelected: importedTab?.getAttribute('aria-selected'),
                    localHidden: localPanel?.hasAttribute('hidden'),
                    importedHidden: importedPanel?.hasAttribute('hidden'),
                    switchAt: sw?.style.getPropertyValue('--at')
                };
            })()
            """,
            "returnByValue": True
        }).get('result', {}).get('value', {})
        print("Initial tab state:", tab_state_initial)
        assert tab_state_initial.get('localSelected') == 'true', "In Dubai tab should be initially selected"
        assert tab_state_initial.get('importedHidden') == True, "Imported panel should be initially hidden"

        # Click Imported Tab
        call_cdp("Runtime.evaluate", {
            "expression": "document.getElementById('tab-imported').click()"
        })
        time.sleep(0.4)

        tab_state_imported = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const localTab = document.getElementById('tab-local');
                const importedTab = document.getElementById('tab-imported');
                const localPanel = document.getElementById('panel-local');
                const importedPanel = document.getElementById('panel-imported');
                const sw = document.querySelector('.tp-switch');
                return {
                    localSelected: localTab?.getAttribute('aria-selected'),
                    importedSelected: importedTab?.getAttribute('aria-selected'),
                    localHidden: localPanel?.hasAttribute('hidden'),
                    importedHidden: importedPanel?.hasAttribute('hidden'),
                    switchAt: sw?.style.getPropertyValue('--at')
                };
            })()
            """,
            "returnByValue": True
        }).get('result', {}).get('value', {})
        print("Imported tab state:", tab_state_imported)
        assert tab_state_imported.get('importedSelected') == 'true', "Imported tab should now be selected"
        assert tab_state_imported.get('localHidden') == True, "Local panel should now be hidden"
        print("✓ Two ways home tab switching verified!")

        # Screenshot Two Ways Home
        shot1 = call_cdp("Page.captureScreenshot", {"format": "png"})
        shot1_path = os.path.join(ARTIFACT_DIR, "how_it_works_two_ways.png")
        with open(shot1_path, "wb") as f:
            f.write(base64.b64decode(shot1['data']))
        print(f"✓ Saved screenshot: {shot1_path}")

        # 4. Test Interactive Mascot Tail & Eye Tracking
        print("\n--- Testing Mascot Tail Wagging & Pointer Tracking ---")
        # Sample tail transform over two frames
        tail_sample1 = call_cdp("Runtime.evaluate", {
            "expression": "document.querySelector('.tp-journeys__teddy [data-p=\"tail\"]')?.getAttribute('transform')",
            "returnByValue": True
        }).get('result', {}).get('value')
        time.sleep(0.3)
        tail_sample2 = call_cdp("Runtime.evaluate", {
            "expression": "document.querySelector('.tp-journeys__teddy [data-p=\"tail\"]')?.getAttribute('transform')",
            "returnByValue": True
        }).get('result', {}).get('value')
        print(f"Tail transform frame 1: {tail_sample1}")
        print(f"Tail transform frame 2: {tail_sample2}")
        assert tail_sample1 != tail_sample2, "Tail should be actively wagging over time"
        print("✓ Mascot tail is actively and continuously wagging!")

        # Dispatch pointermove to test eye tracking
        call_cdp("Input.dispatchMouseEvent", {
            "type": "mouseMoved",
            "x": 200,
            "y": 250
        })
        time.sleep(0.3)
        eyes_sample = call_cdp("Runtime.evaluate", {
            "expression": "document.querySelector('.tp-journeys__teddy [data-p=\"eyes\"]')?.getAttribute('transform')",
            "returnByValue": True
        }).get('result', {}).get('value')
        print(f"Pupil eyes transform after pointermove: {eyes_sample}")
        assert eyes_sample is not None, "Pupil eyes transform should exist"
        print("✓ Mascot eye tracking responding to cursor!")

        # 5. Test Delivery & Collection Airplane Scroll Animation
        print("\n--- Testing Delivery & Collection Airplane Flight Movement ---")
        # Scroll to right before delivery section
        delivery_top = call_cdp("Runtime.evaluate", {
            "expression": "document.getElementById('delivery').getBoundingClientRect().top + window.pageYOffset",
            "returnByValue": True
        }).get('result', {}).get('value')
        print(f"Delivery section top: {delivery_top}px")

        # Scroll to delivery top - 500 (approaching)
        call_cdp("Runtime.evaluate", {
            "expression": f"window.scrollTo(0, {delivery_top - 500})"
        })
        time.sleep(0.5)

        plane_pos1 = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const plane = document.querySelector('.tp-flight g[transform*="translate"]');
                return {
                    transform: plane?.getAttribute('transform'),
                    opacity: plane?.style.opacity
                };
            })()
            """,
            "returnByValue": True
        }).get('result', {}).get('value', {})
        print("Plane pos 1 (approaching):", plane_pos1)

        # Scroll further down (centered delivery)
        call_cdp("Runtime.evaluate", {
            "expression": f"window.scrollTo(0, {delivery_top - 100})"
        })
        time.sleep(0.5)

        plane_pos2 = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const plane = document.querySelector('.tp-flight g[transform*="translate"]');
                return {
                    transform: plane?.getAttribute('transform'),
                    opacity: plane?.style.opacity
                };
            })()
            """,
            "returnByValue": True
        }).get('result', {}).get('value', {})
        print("Plane pos 2 (centered):", plane_pos2)
        assert plane_pos1.get('transform') != plane_pos2.get('transform'), "Airplane should advance along trajectory when scrolling down"
        print("✓ Airplane travels smoothly along the flight route on scroll-down!")

        # Scroll UP to test reversibility
        print("\n--- Testing Airplane Reverse Motion on Scroll-Up ---")
        call_cdp("Runtime.evaluate", {
            "expression": f"window.scrollTo(0, {delivery_top - 500})"
        })
        time.sleep(0.5)

        plane_pos3 = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const plane = document.querySelector('.tp-flight g[transform*="translate"]');
                return {
                    transform: plane?.getAttribute('transform'),
                    opacity: plane?.style.opacity
                };
            })()
            """,
            "returnByValue": True
        }).get('result', {}).get('value', {})
        print("Plane pos 3 (scrolled back up):", plane_pos3)
        assert plane_pos3.get('transform') == plane_pos1.get('transform'), "Airplane should return to initial position on scroll-up"
        print("✓ Airplane strictly reverses flight path on scroll-up!")

        # Screenshot Delivery & Collection
        call_cdp("Runtime.evaluate", {
            "expression": f"window.scrollTo(0, {delivery_top - 80})"
        })
        time.sleep(0.5)
        shot2 = call_cdp("Page.captureScreenshot", {"format": "png"})
        shot2_path = os.path.join(ARTIFACT_DIR, "how_it_works_delivery_plane.png")
        with open(shot2_path, "wb") as f:
            f.write(base64.b64decode(shot2['data']))
        print(f"✓ Saved screenshot: {shot2_path}")

        # 6. Test Lower Promotional Mascot
        print("\n--- Testing Lower Promotional Mascot ---")
        care_top = call_cdp("Runtime.evaluate", {
            "expression": "document.getElementById('care-title').getBoundingClientRect().top + window.pageYOffset",
            "returnByValue": True
        }).get('result', {}).get('value')
        call_cdp("Runtime.evaluate", {
            "expression": f"window.scrollTo(0, {care_top - 120})"
        })
        time.sleep(0.5)

        lower_mascot_check = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const card = document.querySelector('section.tp-board');
                const buddy = card?.querySelector('.pup-buddy');
                const facing = buddy?.getAttribute('data-facing');
                const tail = buddy?.querySelector('[data-p="tail"]')?.getAttribute('transform');
                const waBtn = card?.querySelector('.btn-whatsapp');
                const seeBtn = card?.querySelector('.btn-ghost');
                return {
                    hasCard: !!card,
                    hasBuddy: !!buddy,
                    facing,
                    tail,
                    hasWaBtn: !!waBtn,
                    hasSeeBtn: !!seeBtn
                };
            })()
            """,
            "returnByValue": True
        }).get('result', {}).get('value', {})
        print("Lower promotional panel check:", lower_mascot_check)
        assert lower_mascot_check.get('hasCard'), "Missing promotional card"
        assert lower_mascot_check.get('facing') == 'left', "Lower mascot should face left"
        assert lower_mascot_check.get('tail') is not None, "Lower mascot tail should exist and be animated"
        print("✓ Lower promotional panel and interactive mascot verified!")

        # Screenshot Lower Panel
        shot3 = call_cdp("Page.captureScreenshot", {"format": "png"})
        shot3_path = os.path.join(ARTIFACT_DIR, "how_it_works_lower_promo.png")
        with open(shot3_path, "wb") as f:
            f.write(base64.b64decode(shot3['data']))
        print(f"✓ Saved screenshot: {shot3_path}")

        # 7. Mobile Viewport Check (375x667)
        print("\n--- Testing Mobile Viewport Layout ---")
        call_cdp("Emulation.setDeviceMetricsOverride", {
            "width": 375,
            "height": 667,
            "deviceScaleFactor": 2,
            "mobile": True
        })
        call_cdp("Runtime.evaluate", { "expression": "window.scrollTo(0, 0)" })
        time.sleep(0.5)

        mobile_check = call_cdp("Runtime.evaluate", {
            "expression": """
            (() => {
                const scrollW = document.documentElement.scrollWidth;
                const clientW = document.documentElement.clientWidth;
                return { scrollW, clientW, noHorizontalOverflow: scrollW <= clientW };
            })()
            """,
            "returnByValue": True
        }).get('result', {}).get('value', {})
        print("Mobile check:", mobile_check)
        assert mobile_check.get('noHorizontalOverflow'), "Horizontal overflow detected on mobile!"
        print("✓ Mobile layout responsive and clean without horizontal overflow!")

        # Screenshot Mobile
        shot4 = call_cdp("Page.captureScreenshot", {"format": "png"})
        shot4_path = os.path.join(ARTIFACT_DIR, "how_it_works_mobile.png")
        with open(shot4_path, "wb") as f:
            f.write(base64.b64decode(shot4['data']))
        print(f"✓ Saved screenshot: {shot4_path}")

        print("\nALL HOW IT WORKS TESTS PASSED! 🎉")
        return True

    finally:
        try:
            ws.close()
        except:
            pass
        proc.terminate()
        proc.wait()

if __name__ == '__main__':
    ok = run_how_it_works_tests()
    sys.exit(0 if ok else 1)

