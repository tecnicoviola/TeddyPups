import subprocess, os, time, json, urllib.request, websocket, base64

def render_svg_to_png(svg_path, out_png_path, size=32):
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    user_data_dir = os.path.abspath(r'C:\Users\suhan\AppData\Local\Temp\chrome_svg_profile')
    os.makedirs(user_data_dir, exist_ok=True)

    abs_svg = os.path.abspath(svg_path).replace('\\', '/')
    html = f'''<!DOCTYPE html><html><head><style>
        * {{ margin: 0; padding: 0; }}
        html, body {{ background: transparent; overflow: hidden; }}
        img {{ width: {size}px; height: {size}px; display: block; }}
    </style></head><body><img src="file:///{abs_svg}" /></body></html>'''
    
    html_path = os.path.abspath('reference/render_temp.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)

    clean_html_path = html_path.replace("\\", "/")
    proc = subprocess.Popen([
        chrome_path,
        '--remote-debugging-port=9228',
        '--headless=new',
        '--disable-gpu',
        '--default-background-color=00000000',
        f'--user-data-dir={user_data_dir}',
        f'file:///{clean_html_path}'
    ])

    time.sleep(2.0)

    try:
        target = None
        for _ in range(10):
            try:
                req = urllib.request.Request('http://127.0.0.1:9228/json/list')
                with urllib.request.urlopen(req) as resp:
                    targets = json.loads(resp.read().decode())
                pages = [t for t in targets if t.get('type') == 'page']
                if pages:
                    target = pages[0]
                    break
            except Exception:
                pass
            time.sleep(0.5)

        if not target:
            raise RuntimeError("No page target found")
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

        call_cdp('Emulation.setDeviceMetricsOverride', {
            'width': size,
            'height': size,
            'deviceScaleFactor': 1,
            'mobile': False
        })
        call_cdp('Emulation.setDefaultBackgroundColorOverride', {
            'color': {'r': 0, 'g': 0, 'b': 0, 'a': 0}
        })
        time.sleep(0.5)

        snap = call_cdp('Page.captureScreenshot', {
            'format': 'png',
            'fromSurface': True,
            'clip': {'x': 0, 'y': 0, 'width': size, 'height': size, 'scale': 1}
        })
        with open(out_png_path, 'wb') as f:
            f.write(base64.b64decode(snap['data']))
        print(f"Saved {out_png_path}")
        ws.close()
    finally:
        proc.kill()
        time.sleep(0.5)

render_svg_to_png('public/cursor/paw.svg', 'public/cursor/paw.png', 32)
render_svg_to_png('public/cursor/paw-press.svg', 'public/cursor/paw-press.png', 32)
