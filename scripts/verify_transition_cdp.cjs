const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

async function testTransition() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.resolve('.chrome_transition_test');

  const proc = spawn(chromePath, [
    '--remote-debugging-port=9223',
    '--headless=new',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function cdpReq(urlPath, method, postData) {
    return new Promise((resolve, reject) => {
      const opt = {
        hostname: '127.0.0.1',
        port: 9223,
        path: urlPath,
        method: method || 'GET',
        headers: postData ? { 'Content-Type': 'application/json' } : {}
      };
      const req = http.request(opt, (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          try { resolve(JSON.parse(body)); } catch { resolve(body); }
        });
      });
      req.on('error', reject);
      if (postData) req.write(JSON.stringify(postData));
      req.end();
    });
  }

  const list = await cdpReq('/json/list');
  const target = list.find(t => t.type === 'page');
  const wsUrl = target.webSocketDebuggerUrl;

  const WebSocket = require('ws');
  const ws = new WebSocket(wsUrl);

  await new Promise(resolve => ws.on('open', resolve));

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === id) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Wait 1.5s for initial intro curtain to finish
  await new Promise(r => setTimeout(r, 1500));

  // Check initial state
  const state1 = await send('Runtime.evaluate', {
    expression: 'document.querySelector(".tp-curtain")?.dataset.state'
  });
  console.log('State after initial load:', state1.result.value);

  // Click on Puppies navigation link
  console.log('Clicking on Puppies navigation link...');
  await send('Runtime.evaluate', {
    expression: 'document.querySelector("a[href=\'/puppies\']").click()'
  });

  // Check state immediately (should be covering or covered)
  await new Promise(r => setTimeout(r, 100));
  const state2 = await send('Runtime.evaluate', {
    expression: 'document.querySelector(".tp-curtain")?.dataset.state'
  });
  console.log('State 100ms after click (during transition):', state2.result.value);

  // Capture screenshot of transition in progress
  const snap = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\suhan\\.gemini\\antigravity\\brain\\cfae791a-a006-4246-96bd-056b57651394\\transition_curtain.png';
  fs.writeFileSync(outPath, Buffer.from(snap.data, 'base64'));
  console.log('Saved transition screenshot to', outPath);

  // Wait 1s for transition to finish and check destination
  await new Promise(r => setTimeout(r, 1000));
  const state3 = await send('Runtime.evaluate', {
    expression: '({ state: document.querySelector(".tp-curtain")?.dataset.state, url: window.location.pathname })'
  });
  console.log('State after navigation:', state3.result.value);

  ws.close();
  proc.kill();
  process.exit(0);
}

testTransition().catch(err => {
  console.error(err);
  process.exit(1);
});

