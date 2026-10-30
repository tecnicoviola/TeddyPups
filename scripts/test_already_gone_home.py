import websocket, json, urllib.request, time, subprocess, os, base64, sys

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def test_already_gone_home():
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    user_data_dir = os.path.abspath(r'C:\Users\suhan\AppData\Local\Temp\chrome_gone_profile')
    os.makedirs(user_data_dir, exist_ok=True)

    proc = subprocess.Popen([
        chrome_path,
        '--remote-debugging-port=9227',
        '--headless=new',
        '--disable-gpu',
        f'--user-data-dir={user_data_dir}',
        'http://localhost:3000/puppies'
    ])

    time.sleep(2.5)

    try:
        req = urllib.request.Request('http://127.0.0.1:9227/json/list')
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

        time.sleep(2.0) # wait for intro curtain

        def eval_val(expr):
            r = call_cdp('Runtime.evaluate', {'expression': expr, 'returnByValue': True})
            return r.get('result', {}).get('value')

        # 1. Verify existence of .tp-gone-strip
        title = eval_val('document.querySelector("#gone-title")?.textContent?.trim()')
        subtitle = eval_val('document.querySelector(".tp-gone-strip p")?.textContent?.trim()')
        cta_text = eval_val('document.querySelector(".tp-gone-strip a.btn-primary")?.textContent?.trim()')
        cta_href = eval_val('document.querySelector(".tp-gone-strip a.btn-primary")?.getAttribute("href")')

        print(f'Title: "{title}"')
        print(f'Subtitle: "{subtitle}"')
        print(f'CTA: "{cta_text}" -> {cta_href}')

        assert title == 'Already gone home', f'Unexpected title: {title}'
        assert subtitle == 'These puppies have found their families.', f'Unexpected subtitle: {subtitle}'
        assert cta_text == "See the puppies who've gone home", f'Unexpected CTA text: {cta_text}'
        assert cta_href == '/gone-home', f'Unexpected CTA href: {cta_href}'

        # 2. Verify 5 adopted puppy items
        puppies_info = eval_val('''
            [...document.querySelectorAll(".tp-gone-strip__row li a")].map(a => ({
                name: a.querySelector(".tp-sketch__name")?.textContent?.trim(),
                href: a.getAttribute("href"),
                sticker: a.querySelector(".tp-sketch__sticker")?.textContent?.trim(),
                hasImage: !!a.querySelector("img"),
                imageSrc: a.querySelector("img")?.getAttribute("src")
            }))
        ''')
        print('Adopted puppies count:', len(puppies_info))
        for p in puppies_info:
            print(' -', p)

        assert len(puppies_info) == 5, f'Expected 5 adopted puppies, got {len(puppies_info)}'
        expected_names = ['Ace', 'Leo', 'Mia', 'Sadie', 'Pomeranian']
        for i, name in enumerate(expected_names):
            assert puppies_info[i]['name'] == name, f'Puppy {i} name mismatch: expected {name}, got {puppies_info[i]["name"]}'
            assert puppies_info[i]['sticker'] == 'gone home ♥', f'Puppy {i} sticker mismatch: {puppies_info[i]["sticker"]}'
            assert puppies_info[i]['hasImage'], f'Puppy {i} is missing image'

        # Scroll .tp-gone-strip into view
        eval_val('document.querySelector(".tp-gone-strip").scrollIntoView({ behavior: "instant", block: "center" })')
        time.sleep(0.5)

        # Capture desktop screenshot
        snap_desktop = call_cdp('Page.captureScreenshot', {'format': 'png'})
        out_desktop = r'C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394\already_gone_home_section.png'
        with open(out_desktop, 'wb') as f:
            f.write(base64.b64decode(snap_desktop['data']))
        print('Saved desktop screenshot:', out_desktop)

        # 3. Test Hover on card 1 (Ace)
        box = eval_val('''
            (() => {
                const rect = document.querySelector(".tp-gone-strip__row li a")?.getBoundingClientRect();
                return rect ? { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 } : null;
            })()
        ''')
        if box:
            print(f'Hovering card at ({box["x"]}, {box["y"]})')
            call_cdp('Input.dispatchMouseEvent', {
                'type': 'mouseMoved',
                'x': box['x'],
                'y': box['y']
            })
            time.sleep(0.5)
            snap_hover = call_cdp('Page.captureScreenshot', {'format': 'png'})
            out_hover = r'C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394\already_gone_home_hover.png'
            with open(out_hover, 'wb') as f:
                f.write(base64.b64decode(snap_hover['data']))
            print('Saved hover screenshot:', out_hover)

        # 4. Test Mobile Responsive layout (iPhone 14 width: 390px)
        call_cdp('Emulation.setDeviceMetricsOverride', {
            'width': 390,
            'height': 844,
            'deviceScaleFactor': 2,
            'mobile': True
        })
        time.sleep(0.5)
        eval_val('document.querySelector(".tp-gone-strip").scrollIntoView({ behavior: "instant", block: "center" })')
        time.sleep(0.5)

        snap_mobile = call_cdp('Page.captureScreenshot', {'format': 'png'})
        out_mobile = r'C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394\already_gone_home_mobile.png'
        with open(out_mobile, 'wb') as f:
            f.write(base64.b64decode(snap_mobile['data']))
        print('Saved mobile screenshot:', out_mobile)

        # 5. Restore desktop and test CTA button navigation to /gone-home
        call_cdp('Emulation.setDeviceMetricsOverride', {
            'width': 1280,
            'height': 900,
            'deviceScaleFactor': 1,
            'mobile': False
        })
        time.sleep(0.3)
        eval_val('document.querySelector(".tp-gone-strip").scrollIntoView({ behavior: "instant", block: "center" })')
        time.sleep(0.3)

        print('--- Clicking CTA "See the puppies who\'ve gone home" ---')
        eval_val('document.querySelector(".tp-gone-strip a.btn-primary").click()')
        
        # Wait a moment and check URL
        time.sleep(1.0)
        curr_url = eval_val('window.location.pathname')
        print(f'Navigated pathname: {curr_url}')
        assert curr_url == '/gone-home', f'Expected /gone-home, got {curr_url}'

        ws.close()
        print('All tests passed successfully!')

    finally:
        proc.kill()

if __name__ == '__main__':
    test_already_gone_home()
