import websocket, json, urllib.request, time, subprocess, os, base64

def test_routes():
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    user_data_dir = os.path.abspath(r'C:\Users\suhan\AppData\Local\Temp\chrome_routes_profile')
    os.makedirs(user_data_dir, exist_ok=True)

    proc = subprocess.Popen([
        chrome_path,
        '--remote-debugging-port=9225',
        '--headless=new',
        '--disable-gpu',
        f'--user-data-dir={user_data_dir}',
        'http://localhost:3000'
    ])

    time.sleep(2.5)

    try:
        req = urllib.request.Request('http://127.0.0.1:9225/json/list')
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

        time.sleep(1.8) # wait for intro

        tests = [
            ('Puppies link', "document.querySelector('a[href=\"/puppies\"]').click()", '/puppies'),
            ('Happy Families link', "document.querySelector('a[href=\"/happy-families\"]').click()", '/happy-families'),
            ('How It Works link', "document.querySelector('a[href=\"/how-it-works\"]').click()", '/how-it-works'),
            ('FAQ link', "document.querySelector('a[href=\"/faq\"]').click()", '/faq'),
            ('Contact link', "document.querySelector('a[href=\"/contact\"]').click()", '/contact'),
            ('Home Logo link', "document.querySelector('a[href=\"/\"]').click()", '/'),
        ]

        for name, click_code, expected_path in tests:
            print(f'=== Testing: {name} ===')
            # Trigger click
            call_cdp('Runtime.evaluate', {'expression': click_code})
            time.sleep(0.12)
            cur_state = call_cdp('Runtime.evaluate', {'expression': 'document.querySelector(".tp-curtain")?.dataset.state'}).get('result', {}).get('value')
            print(f' -> Transition state: {cur_state}')
            assert cur_state in ['covering', 'covered'], f'Expected covering/covered, got {cur_state}'
            time.sleep(1.1)
            final_info = call_cdp('Runtime.evaluate', {'expression': 'JSON.stringify({ state: document.querySelector(".tp-curtain")?.dataset.state, path: window.location.pathname })'}).get('result', {}).get('value')
            print(f' -> Final: {final_info}')

        print('ALL TRANSITION TESTS PASSED SUCCESSFULLY!')
        ws.close()
    finally:
        proc.kill()

if __name__ == '__main__':
    test_routes()

