import websocket, json, urllib.request, time, subprocess, os, base64, sys

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def test_puppy_detail():
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    user_data_dir = os.path.abspath(r'C:\Users\suhan\AppData\Local\Temp\chrome_pup_detail_profile')
    os.makedirs(user_data_dir, exist_ok=True)
    artifacts_dir = r'C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394'

    print("Launching Chrome for Puppy Detail Page testing...")
    proc = subprocess.Popen([
        chrome_path,
        '--remote-debugging-port=9229',
        '--headless=new',
        '--disable-gpu',
        f'--user-data-dir={user_data_dir}',
        'http://localhost:3000/puppies/korean-teacup-maltipoo-female'
    ])

    time.sleep(2.5)

    try:
        req = urllib.request.Request('http://127.0.0.1:9229/json/list')
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

        call_cdp('Page.enable')
        call_cdp('Runtime.enable')
        call_cdp('DOM.enable')
        call_cdp('Emulation.setDeviceMetricsOverride', {
            'width': 1280,
            'height': 900,
            'deviceScaleFactor': 1,
            'mobile': False
        })

        time.sleep(2.0)

        def eval_js(js):
            res = call_cdp('Runtime.evaluate', {
                'expression': js,
                'returnByValue': True,
                'awaitPromise': True
            })
            return res.get('result', {}).get('value')

        def take_screenshot(filename):
            res = call_cdp('Page.captureScreenshot', {'format': 'png'})
            data = base64.b64decode(res['data'])
            filepath = os.path.join(artifacts_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(data)
            print(f"Saved screenshot: {filepath}")

        print("\n--- TEST 1: Page Loading & Initial Data ---")
        h1_text = eval_js("document.querySelector('h1').innerText")
        print(f"H1 Title: {h1_text}")
        assert "Korean Teacup Maltipoo" in h1_text, f"Expected Korean Teacup Maltipoo, got {h1_text}"

        breadcrumb = eval_js("document.querySelector('nav[aria-label=Breadcrumb]').innerText")
        print(f"Breadcrumb: {breadcrumb}")
        assert "Available puppies" in breadcrumb and "Korean Teacup Maltipoo" in breadcrumb

        ch1 = eval_js("document.querySelector('.tp-chapter span.font-scrawl').innerText")
        print(f"Chapter 1: {ch1}")
        assert "hello, it's me" in ch1

        specs = eval_js("""
            Array.from(document.querySelectorAll('dl dt')).map(dt => {
                const dd = dt.nextElementSibling;
                return dt.innerText + ': ' + (dd ? dd.innerText : '');
            }).join(' | ')
        """)
        print(f"Specs: {specs}")
        assert "Breed: Korean Teacup Maltipoo" in specs
        assert "Boy or girl: Girl" in specs
        assert "Age: 2 months" in specs
        assert "Where: Imported for you" in specs

        take_screenshot("puppy_detail_top.png")

        print("\n--- TEST 2: Gallery Interaction & Controls ---")
        counter_initial = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Initial Counter: {counter_initial}")
        assert "1 / 11" in counter_initial

        # Click Next photo button
        eval_js("document.querySelector('button[aria-label=\"Next photo\"]').click()")
        time.sleep(0.5)
        counter_next = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Counter after Next: {counter_next}")
        assert "2 / 11" in counter_next

        # Check thumbnail active classes
        thumb2_active = eval_js("document.querySelectorAll('ul[aria-label*=\"All photos\"] button')[1].getAttribute('aria-current')")
        print(f"Thumbnail 2 aria-current: {thumb2_active}")
        assert thumb2_active == "true"

        # Click Previous photo button
        eval_js("document.querySelector('button[aria-label=\"Previous photo\"]').click()")
        time.sleep(0.5)
        counter_back = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Counter after Prev: {counter_back}")
        assert "1 / 11" in counter_back

        # Test clicking thumbnail 4
        eval_js("document.querySelectorAll('ul[aria-label*=\"All photos\"] button')[3].click()")
        time.sleep(0.5)
        counter_thumb4 = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Counter after clicking thumb 4: {counter_thumb4}")
        assert "4 / 11" in counter_thumb4

        print("\n--- TEST 3: Full Screen Image Viewer Modal ---")
        btn_label = eval_js("document.querySelector('.tp-storypage button[aria-label*=\"full screen\"]')?.getAttribute('aria-label')")
        print(f"Fullscreen button label: {btn_label}")
        eval_js("document.querySelector('.tp-storypage button[aria-label*=\"full screen\"]').click()")
        time.sleep(1.0)
        dialog_in_dom = eval_js("Boolean(document.querySelector('dialog'))")
        dialog_open = eval_js("document.querySelector('dialog')?.open")
        print(f"Dialog in DOM: {dialog_in_dom}, dialog.open: {dialog_open}")
        assert dialog_in_dom is True
        take_screenshot("puppy_detail_modal.png")

        # Close dialog
        eval_js("""
            const closeBtn = document.querySelector('dialog button[aria-label*="Close"]');
            if (closeBtn) closeBtn.click();
        """)
        time.sleep(1.0)
        dialog_in_dom_after = eval_js("Boolean(document.querySelector('dialog'))")
        print(f"Dialog in DOM after close: {dialog_in_dom_after}")

        print("\n--- TEST 4: What Comes With This Puppy (Chapter 2) ---")
        eval_js("window.scrollTo({top: 400, behavior: 'instant'})")
        ch2_text = eval_js("document.querySelectorAll('.tp-chapter')[1].innerText")
        print(f"Chapter 2: {ch2_text}")
        assert "what comes with this Korean Teacup Maltipoo" in ch2_text

        promises = eval_js("Array.from(document.querySelectorAll('.tp-paper ul li')).map(li => li.innerText).join('; ')")
        print(f"Promises: {promises}")
        assert "Vaccinated" in promises
        assert "Dewormed" in promises
        assert "Verified health certificate from licensed vets" in promises
        assert "Thoroughly checked before joining your family" in promises

        print("\n--- TEST 5: Coming Home From Abroad (Chapter 3) ---")
        eval_js("window.scrollTo({top: 900, behavior: 'instant'})")
        time.sleep(0.5)
        ch3_text = eval_js("document.querySelectorAll('.tp-chapter')[2].innerText")
        print(f"Chapter 3: {ch3_text}")
        assert "the way home" in ch3_text

        steps = eval_js("Array.from(document.querySelectorAll('.tp-trail--row li h3')).map(h3 => h3.innerText).join(' -> ')")
        print(f"Steps: {steps}")
        assert "Reserve your puppy" in steps
        assert "Personalized consultation" in steps
        assert "Import and arrival" in steps
        assert "Welcome home" in steps

        print("\n--- TEST 6: Enquiry Form Validation & Submission (Chapter 4) ---")
        eval_js("document.querySelector('#enquire-korean-teacup-maltipoo-female').scrollIntoView({behavior: 'instant'})")
        time.sleep(0.5)

        # Trigger validation error with empty submit
        eval_js("document.querySelector('#enquire-korean-teacup-maltipoo-female form button[type=submit]').click()")
        time.sleep(0.5)

        alert_text = eval_js("document.querySelector('#enquire-korean-teacup-maltipoo-female [role=alert]')?.innerText")
        print(f"Validation Alert Banner: {alert_text}")
        assert alert_text and "Please check the highlighted fields" in alert_text

        invalid_inputs = eval_js("""
            Array.from(document.querySelectorAll('#enquire-korean-teacup-maltipoo-female [aria-invalid="true"]'))
                .map(el => el.getAttribute('name')).join(', ')
        """)
        print(f"Invalid inputs: {invalid_inputs}")
        assert "name" in invalid_inputs and "phone" in invalid_inputs

        take_screenshot("puppy_detail_enquiry_invalid.png")

        # Now fill in valid details with React native setter
        eval_js("""
            function setNativeValue(element, value) {
                const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
                const prototype = Object.getPrototypeOf(element);
                const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
                if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
                    prototypeValueSetter.call(element, value);
                } else if (valueSetter) {
                    valueSetter.call(element, value);
                } else {
                    element.value = value;
                }
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }

            setNativeValue(document.querySelector('#name-korean-teacup-maltipoo-female'), 'Sarah Miller');
            setNativeValue(document.querySelector('#phone-korean-teacup-maltipoo-female'), '+971 50 123 4567');
            setNativeValue(document.querySelector('#email-korean-teacup-maltipoo-female'), 'sarah@example.com');
            setNativeValue(document.querySelector('#area-korean-teacup-maltipoo-female'), 'Dubai Marina');
        """)
        time.sleep(0.5)

        # Submit form
        eval_js("document.querySelector('#enquire-korean-teacup-maltipoo-female form button[type=submit]').click()")
        time.sleep(1.0)

        # Check submitted confirmation card
        success_title = eval_js("document.querySelector('.tp-post p.font-plush')?.innerText")
        print(f"Success Title: {success_title}")
        assert success_title == "Message received!"

        success_msg = eval_js("document.querySelector('.tp-post p.text-cocoa-soft')?.innerText")
        print(f"Success Message: {success_msg}")
        assert "Thank you" in success_msg

        wa_btn = eval_js("document.querySelector('.tp-post a.btn-whatsapp')?.innerText")
        print(f"Success WhatsApp button: {wa_btn}")
        assert "WhatsApp us" in wa_btn

        take_screenshot("puppy_detail_enquiry_submitted.png")

        print("\n--- TEST 7: Previous / Next Puppy Navigation ---")
        eval_js("document.querySelector('nav[aria-label=\"More puppies\"]').scrollIntoView({behavior: 'instant'})")
        time.sleep(0.5)

        prev_nav_text = eval_js("document.querySelectorAll('nav[aria-label=\"More puppies\"] a')[0].innerText")
        next_nav_text = eval_js("document.querySelectorAll('nav[aria-label=\"More puppies\"] a')[1].innerText")
        print(f"Prev Link Card: {prev_nav_text.replace(chr(10), ' ')}")
        print(f"Next Link Card: {next_nav_text.replace(chr(10), ' ')}")
        assert "Previous pup" in prev_nav_text and "Max" in prev_nav_text
        assert "Next pup" in next_nav_text and "Korean Teacup Poodle" in next_nav_text

        take_screenshot("puppy_detail_prev_next.png")

        # Click Next pup link (Korean Teacup Poodle)
        eval_js("document.querySelectorAll('nav[aria-label=\"More puppies\"] a')[1].click()")
        time.sleep(2.0)

        new_h1 = eval_js("document.querySelector('h1')?.innerText")
        print(f"Navigated to Next Puppy H1: {new_h1}")
        assert "Korean Teacup Poodle" in new_h1

        new_url = eval_js("window.location.pathname")
        print(f"New pathname: {new_url}")
        assert new_url == "/puppies/korean-teacup-poodle-female"

        # Check Chapter 2 on new puppy
        poodle_ch2 = eval_js("document.querySelectorAll('.tp-chapter')[1].innerText")
        print(f"Poodle Chapter 2: {poodle_ch2}")
        assert "what comes with this Korean Teacup Poodle" in poodle_ch2

        print("\n--- TEST 8: Test Named Puppy (maltipoo-max-male) ---")
        eval_js("window.location.href = '/puppies/maltipoo-max-male'")
        time.sleep(2.0)

        max_h1 = eval_js("document.querySelector('h1')?.innerText")
        print(f"Max H1: {max_h1}")
        assert "Max" in max_h1

        max_ch2 = eval_js("document.querySelectorAll('.tp-chapter')[1].innerText")
        print(f"Max Chapter 2: {max_ch2}")
        assert "what comes with Max" in max_ch2

        max_prev = eval_js("document.querySelectorAll('nav[aria-label=\"More puppies\"] a')[0].innerText")
        print(f"Max Previous pup (cyclic wrap): {max_prev.replace(chr(10), ' ')}")
        assert "Previous pup" in max_prev

        take_screenshot("puppy_detail_max.png")

        print("\n==========================================")
        print("ALL PUPPY DETAIL TESTS PASSED SUCCESSFULLY!")
        print("==========================================")

    finally:
        try:
            ws.close()
        except:
            pass
        proc.terminate()

if __name__ == '__main__':
    test_puppy_detail()
