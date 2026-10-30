import websocket, json, urllib.request, time, subprocess, os, base64

def test_puppy_filters():
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    user_data_dir = os.path.abspath(r'C:\Users\suhan\AppData\Local\Temp\chrome_filter_profile')
    os.makedirs(user_data_dir, exist_ok=True)

    proc = subprocess.Popen([
        chrome_path,
        '--remote-debugging-port=9226',
        '--headless=new',
        '--disable-gpu',
        f'--user-data-dir={user_data_dir}',
        'http://localhost:3000/puppies'
    ])

    time.sleep(2.5)

    try:
        req = urllib.request.Request('http://127.0.0.1:9226/json/list')
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
        call_cdp('Emulation.setDeviceMetricsOverride', {
            'width': 1280,
            'height': 900,
            'deviceScaleFactor': 1,
            'mobile': False
        })

        time.sleep(1.8) # wait for intro curtain

        def eval_val(expr):
            r = call_cdp('Runtime.evaluate', {'expression': expr})
            return r.get('result', {}).get('value')

        # 1. Check initial state
        count_text = eval_val('document.querySelector("p[aria-live=\'polite\']")?.textContent?.trim()')
        card_count = eval_val('document.querySelectorAll(".tp-sketches > li")?.length')
        print(f'Initial: count_text=\"{count_text}\", card_count={card_count}')
        assert card_count == 15, f'Expected 15 cards, got {card_count}'
        assert count_text == '15 puppies looking for a home', f'Unexpected count text: {count_text}'

        # Capture initial screenshot
        snap1 = call_cdp('Page.captureScreenshot', {'format': 'png'})
        out1 = r'C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394\puppies_unfiltered.png'
        with open(out1, 'wb') as f:
            f.write(base64.b64decode(snap1['data']))
        print('Saved initial screenshot:', out1)

        # 2. Click "Korean Teacup"
        print('--- Clicking Korean Teacup ---')
        eval_val('[...document.querySelectorAll(".tp-sticker-chip")].find(el => el.textContent.includes("Korean Teacup")).click()')
        time.sleep(0.3)
        c2 = eval_val('document.querySelector("p[aria-live=\'polite\']")?.textContent?.trim()')
        cards2 = eval_val('document.querySelectorAll(".tp-sketches > li")?.length')
        print(f'After Korean Teacup: count=\"{c2}\", cards={cards2}')
        assert cards2 == 5, f'Expected 5 cards, got {cards2}'
        assert '5 puppies match' in c2

        # 3. Click "Maltipoo" (Korean Teacup + Maltipoo)
        print('--- Clicking Maltipoo ---')
        eval_val('[...document.querySelectorAll(".tp-sticker-chip")].find(el => el.textContent.includes("Maltipoo")).click()')
        time.sleep(0.3)
        c3 = eval_val('document.querySelector("p[aria-live=\'polite\']")?.textContent?.trim()')
        cards3 = eval_val('document.querySelectorAll(".tp-sketches > li")?.length')
        print(f'After Korean Teacup + Maltipoo: count=\"{c3}\", cards={cards3}')
        assert cards3 == 1, f'Expected 1 card, got {cards3}'
        assert '1 puppy match' in c3

        # 4. Click "Girls"
        print('--- Clicking Girls ---')
        eval_val('[...document.querySelectorAll(".tp-sticker-chip")].find(el => el.textContent.includes("Girls")).click()')
        time.sleep(0.3)
        c4 = eval_val('document.querySelector("p[aria-live=\'polite\']")?.textContent?.trim()')
        cards4 = eval_val('document.querySelectorAll(".tp-sketches > li")?.length')
        print(f'After Korean Teacup + Maltipoo + Girls: count=\"{c4}\", cards={cards4}')
        assert cards4 == 1, f'Expected 1 card, got {cards4}'

        # Capture filtered screenshot
        snap2 = call_cdp('Page.captureScreenshot', {'format': 'png'})
        out2 = r'C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394\puppies_filtered_combination.png'
        with open(out2, 'wb') as f:
            f.write(base64.b64decode(snap2['data']))
        print('Saved filtered screenshot:', out2)

        # 5. Clear filters
        print('--- Clicking Clear filters ---')
        eval_val('document.querySelector(".link-ink")?.click()')
        time.sleep(0.3)
        c5 = eval_val('document.querySelector("p[aria-live=\'polite\']")?.textContent?.trim()')
        cards5 = eval_val('document.querySelectorAll(".tp-sketches > li")?.length')
        print(f'After Clear filters: count=\"{c5}\", cards={cards5}')
        assert cards5 == 15, f'Expected 15 cards, got {cards5}'

        # 6. Test Empty State: Korean Teacup + Cavapoo (no korean teacup cavapoos)
        print('--- Testing Empty State (Korean Teacup + Cavapoo) ---')
        eval_val('[...document.querySelectorAll(".tp-sticker-chip")].find(el => el.textContent.includes("Korean Teacup")).click()')
        time.sleep(0.2)
        eval_val('[...document.querySelectorAll(".tp-sticker-chip")].find(el => el.textContent.includes("Cavapoo")).click()')
        time.sleep(0.3)
        c6 = eval_val('document.querySelector("p[aria-live=\'polite\']")?.textContent?.trim()')
        cards6 = eval_val('document.querySelectorAll(".tp-sketches > li")?.length')
        empty_msg = eval_val('document.querySelector(".text-big")?.textContent?.trim()')
        print(f'Empty state: count=\"{c6}\", cards={cards6}, message=\"{empty_msg}\"')
        assert cards6 == 0, f'Expected 0 cards, got {cards6}'
        assert empty_msg == 'No puppies match just now.'

        # Capture empty state screenshot
        snap3 = call_cdp('Page.captureScreenshot', {'format': 'png'})
        out3 = r'C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394\puppies_empty_state.png'
        with open(out3, 'wb') as f:
            f.write(base64.b64decode(snap3['data']))
        print('Saved empty state screenshot:', out3)

        print('ALL FILTER TESTS PASSED WITH 100% SUCCESS!')
        ws.close()
    finally:
        proc.kill()

if __name__ == '__main__':
    test_puppy_filters()

