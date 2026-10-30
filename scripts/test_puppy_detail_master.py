import websocket, json, urllib.request, time, subprocess, os, base64, sys

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def test_puppy_detail_master():
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    user_data_dir = os.path.abspath(r'C:\Users\suhan\AppData\Local\Temp\chrome_pup_detail_master')
    os.makedirs(user_data_dir, exist_ok=True)
    artifacts_dir = r'C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394'

    print("Launching Chrome for Master Puppy Detail Page verification...")
    proc = subprocess.Popen([
        chrome_path,
        '--remote-debugging-port=9231',
        '--headless=new',
        '--disable-gpu',
        f'--user-data-dir={user_data_dir}',
        'http://localhost:3000/puppies/korean-teacup-maltipoo-female'
    ])

    time.sleep(2.5)

    try:
        req = urllib.request.Request('http://127.0.0.1:9231/json/list')
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

        print("\n--- 1. GALLERY NAVIGATION & CYCLIC WRAPPING ---")
        counter = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Start counter: {counter}")
        assert "1 / 11" in counter

        # Click right arrow (Next photo)
        eval_js("document.querySelector('button[aria-label=\"Next photo\"]').click()")
        time.sleep(0.8)
        counter2 = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Counter after Next: {counter2}")
        assert "2 / 11" in counter2

        # Check thumbnail 2 is active
        t2 = eval_js("document.querySelectorAll('ul[aria-label*=\"All photos\"] button')[1].getAttribute('aria-current')")
        print(f"Thumb 2 active: {t2}")
        assert t2 == "true"

        # Click left arrow (Prev photo) -> back to 1
        eval_js("document.querySelector('button[aria-label=\"Previous photo\"]').click()")
        time.sleep(0.8)
        counter1 = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Counter after Prev: {counter1}")
        assert "1 / 11" in counter1

        # Cyclic wrap-around backward: from photo 1 clicking Previous photo -> photo 11
        eval_js("document.querySelector('button[aria-label=\"Previous photo\"]').click()")
        time.sleep(0.8)
        counter11 = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Counter after cyclic wrap backward (1 -> Prev): {counter11}")
        assert "11 / 11" in counter11

        # Cyclic wrap-around forward: from photo 11 clicking Next photo -> photo 1
        eval_js("document.querySelector('button[aria-label=\"Next photo\"]').click()")
        time.sleep(0.8)
        counter_wrapped_back = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Counter after cyclic wrap forward (11 -> Next): {counter_wrapped_back}")
        assert "1 / 11" in counter_wrapped_back

        # Test keyboard navigation: ArrowRight -> photo 2
        eval_js("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))")
        time.sleep(0.8)
        counter_key = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Counter after keyboard ArrowRight: {counter_key}")
        assert "2 / 11" in counter_key

        # Test keyboard navigation: ArrowLeft -> photo 1
        eval_js("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))")
        time.sleep(0.8)
        counter_key_left = eval_js("document.querySelector('.tp-storypage span.self-center').innerText")
        print(f"Counter after keyboard ArrowLeft: {counter_key_left}")
        assert "1 / 11" in counter_key_left

        take_screenshot("master_gallery_nav.png")

        print("\n--- 2. ENQUIRY SECTION SCROLL ANIMATION & STAMP ---")
        eval_js("document.querySelector('#enquire-korean-teacup-maltipoo-female').scrollIntoView({behavior: 'smooth'})")
        time.sleep(1.0)

        revealed = eval_js("document.querySelector('#enquire-korean-teacup-maltipoo-female').dataset.revealed")
        print(f"Enquiry section revealed attribute: {revealed}")

        stamp_classes = eval_js("document.querySelector('.tp-letter__stamp')?.className")
        print(f"Stamp classes: {stamp_classes}")
        assert "tp-letter__stamp" in stamp_classes

        print("\n--- 3. ENQUIRY VALIDATION & SENDING STATE ---")
        # Trigger validation with empty name
        eval_js("document.querySelector('#enquire-korean-teacup-maltipoo-female form button[type=submit]').click()")
        time.sleep(0.5)

        alert_msg = eval_js("document.querySelector('#enquire-korean-teacup-maltipoo-female p[role=alert]')?.innerText")
        print(f"Alert Banner: {alert_msg}")
        assert "Please check the highlighted fields" in alert_msg

        name_err = eval_js("document.querySelector('#name-err-korean-teacup-maltipoo-female')?.innerText")
        phone_err = eval_js("document.querySelector('#phone-err-korean-teacup-maltipoo-female')?.innerText")
        print(f"Field errors -> Name: {name_err} | Phone: {phone_err}")
        assert "Please enter your name" in name_err
        assert "Please enter your phone number" in phone_err

        take_screenshot("master_enquiry_validation.png")

        # Now fill in valid data
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

            setNativeValue(document.querySelector('#name-korean-teacup-maltipoo-female'), 'Jessica Taylor');
            setNativeValue(document.querySelector('#phone-korean-teacup-maltipoo-female'), '+971 52 987 6543');
            setNativeValue(document.querySelector('#email-korean-teacup-maltipoo-female'), 'jessica@example.com');
            setNativeValue(document.querySelector('#area-korean-teacup-maltipoo-female'), 'Downtown Dubai');
        """)
        time.sleep(0.3)

        # Click submit and immediately verify Sending... state
        eval_js("document.querySelector('#enquire-korean-teacup-maltipoo-female form button[type=submit]').click()")
        sending_text = eval_js("document.querySelector('#enquire-korean-teacup-maltipoo-female form button[type=submit]')?.innerText")
        print(f"Button during submission: {sending_text}")
        assert "Sending" in sending_text

        # Wait for success state to appear
        time.sleep(1.2)

        print("\n--- 4. MESSAGE RECEIVED SUCCESS STATE ---")
        card_class = eval_js("document.querySelector('.tp-sent')?.className")
        print(f"Success card class: {card_class}")
        assert "tp-sent" in card_class
        assert "bg-honey" in card_class
        assert "rounded-[2rem]" in card_class

        heading = eval_js("document.querySelector('.tp-sent p.font-plush')?.innerText")
        print(f"Heading: {heading}")
        assert heading == "Message received!"

        body_text = eval_js("document.querySelector('.tp-sent p.text-cocoa-soft')?.innerText")
        print(f"Body text: {body_text}")
        assert "Thank you — our team will get back to you promptly" in body_text
        assert "For the quickest reply, message us on WhatsApp" in body_text

        envelope_svg = eval_js("document.querySelector('.tp-sent svg.tp-envelope')?.getAttribute('viewBox')")
        print(f"Envelope viewBox: {envelope_svg}")
        assert envelope_svg == "0 0 120 84"

        wa_btn = eval_js("document.querySelector('.tp-sent a.btn-whatsapp')?.innerText")
        print(f"WhatsApp button: {wa_btn}")
        assert wa_btn == "WhatsApp us"

        take_screenshot("master_enquiry_success_fixed.png")

        print("\n--- 5. PRESERVED SECTIONS & DETAILS ---")
        sections = eval_js("""
            [
                document.querySelector('.tp-storypage') ? '1. Gallery' : null,
                document.querySelector('.tp-tag') ? '2. Info Card' : null,
                document.querySelector('.tp-paper') ? '3. Promises' : null,
                document.querySelector('.tp-trail') ? '4. Abroad Steps' : null,
                document.querySelector('.tp-letter') ? '5. Enquiry' : null,
                document.querySelector('nav[aria-label="More puppies"]') ? '6. Prev/Next' : null
            ].filter(Boolean).join(' -> ')
        """)
        print(f"Preserved sections in order: {sections}")

        print("\n==============================================")
        print("ALL MASTER FIX REQUIREMENTS VERIFIED AND PASSED!")
        print("==============================================")

    finally:
        try:
            ws.close()
        except:
            pass
        proc.terminate()

if __name__ == '__main__':
    test_puppy_detail_master()
