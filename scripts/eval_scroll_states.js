import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const proc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9226',
  '--user-data-dir=C:\\Users\\suhan\\AppData\\Local\\Temp\\chrome_cdp_eval',
  'http://localhost:3000/',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9226/json/list');
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

    for (const y of [0, 150, 300, 600]) {
      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: ${y}, behavior: 'instant' });`,
      });
      await new Promise((r) => setTimeout(r, 400));
      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const layer = document.querySelector('.pup-layer');
          const actor = document.querySelector('.pup-actor');
          const svg = actor ? actor.querySelector('svg') : null;
          const body = svg ? svg.querySelector('[data-p="body"]') : null;
          const ledge = svg ? svg.querySelector('[data-p="ledge"]') : null;
          const root = svg ? svg.querySelector('[data-p="root"]') : null;
          return JSON.stringify({
            scrollY: window.scrollY,
            layerFront: layer ? layer.dataset.front : null,
            actorTransform: actor ? actor.style.transform : null,
            rootTransform: root ? root.getAttribute('transform') : null,
            bodyOpacity: body ? body.getAttribute('opacity') : null,
            ledgeOpacity: ledge ? ledge.getAttribute('opacity') : null
          });
        })()`,
      });
      console.log(`Y=${y}:`, evalRes.result.value);
    }
    ws.close();
    proc.kill();
  } catch (e) {
    console.error(e);
    proc.kill();
  }
}, 1000);

