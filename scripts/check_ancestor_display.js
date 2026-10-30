import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const proc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9230',
  '--user-data-dir=C:\\Users\\suhan\\AppData\\Local\\Temp\\chrome_cdp_anc',
  'http://localhost:3000/',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9230/json/list');
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
        let el = document.querySelector('.tp-meet__teddy');
        const chain = [];
        while (el) {
          const cs = getComputedStyle(el);
          chain.push({
            tag: el.tagName,
            cls: el.className,
            display: cs.display
          });
          el = el.parentElement;
        }
        return JSON.stringify(chain);
      })()`,
    });
    console.log('Ancestor chain:\n', JSON.parse(evalRes.result.value));
    ws.close();
    proc.kill();
  } catch (e) {
    console.error(e);
    proc.kill();
  }
}, 1000);

