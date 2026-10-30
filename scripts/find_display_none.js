import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const proc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9231',
  '--user-data-dir=C:\\Users\\suhan\\AppData\\Local\\Temp\\chrome_cdp_css',
  'http://localhost:3000/',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9231/json/list');
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
    await send('DOM.enable');
    await send('CSS.enable');

    const doc = await send('DOM.getDocument');
    const node = await send('DOM.querySelector', {
      nodeId: doc.root.nodeId,
      selector: '.tp-meet__teddy',
    });
    console.log('nodeId:', node.nodeId);

    const matched = await send('CSS.getMatchedStylesForNode', { nodeId: node.nodeId });
    for (const match of matched.matchedCSSRules) {
      console.log('Rule:', match.rule.selectorList.text);
      for (const prop of match.rule.style.cssProperties) {
        if (prop.name === 'display') {
          console.log(' -> display:', prop.value);
        }
      }
    }

    ws.close();
    proc.kill();
  } catch (e) {
    console.error(e);
    proc.kill();
  }
}, 1000);

