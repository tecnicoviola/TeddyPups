import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const proc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9233',
  '--user-data-dir=C:\\Users\\suhan\\AppData\\Local\\Temp\\chrome_cdp_debug1440',
  'http://localhost:3000/',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9233/json/list');
    const tabs = await res.json();
    const page = tabs.find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r, { once: true }));
    let id = 1;
    const send = (method, params = {}) =>
      new Promise((res) => {
        const msgId = id++;
        const onMsg = (ev) => {
          const d = JSON.parse(ev.data);
          if (d.id === msgId) {
            ws.removeEventListener('message', onMsg);
            res(d.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await new Promise((r) => setTimeout(r, 2000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const stops = Array.from(document.querySelectorAll('[data-pup-stop]')).map((s, idx) => ({
          idx,
          pose: s.dataset.pose,
          cls: s.className,
          rect: s.getBoundingClientRect(),
          top: s.getBoundingClientRect().top + window.scrollY
        }));
        return JSON.stringify({
          clientWidth: document.documentElement.clientWidth,
          stops
        });
      })()`,
    });
    console.log('Stops on 1440 desktop:\n', JSON.parse(evalRes.result.value));
    ws.close();
    proc.kill();
  } catch (e) {
    console.error(e);
    proc.kill();
  }
}, 1000);

