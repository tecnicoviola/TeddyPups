import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const proc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9228',
  '--user-data-dir=C:\\Users\\suhan\\AppData\\Local\\Temp\\chrome_cdp_meet',
  'http://localhost:3000/',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9228/json/list');
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

    await new Promise((r) => setTimeout(r, 2000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('.tp-meet__teddy');
        if (!el) return 'el not found';
        const cs = getComputedStyle(el);
        const parent = el.parentElement;
        const parentCs = parent ? getComputedStyle(parent) : null;
        return JSON.stringify({
          display: cs.display,
          visibility: cs.visibility,
          width: cs.width,
          height: cs.height,
          position: cs.position,
          offsetParent: el.offsetParent ? el.offsetParent.tagName + '.' + el.offsetParent.className : null,
          parentDisplay: parentCs ? parentCs.display : null,
          parentWidth: parentCs ? parentCs.width : null,
          parentHeight: parentCs ? parentCs.height : null
        });
      })()`,
    });
    console.log('Meet teddy info:\n', JSON.parse(evalRes.result.value));
    ws.close();
    proc.kill();
  } catch (e) {
    console.error(e);
    proc.kill();
  }
}, 1000);

