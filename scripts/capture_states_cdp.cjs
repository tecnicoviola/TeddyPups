const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Simple WebSocket client using Node 26 global WebSocket
async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(process.env.TEMP, 'chrome_cdp_test_' + Date.now());

  console.log('Launching Chrome...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9333',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1100',
    'about:blank'
  ]);

  // Wait for debug port to become available
  let version = null;
  for (let i = 0; i < 20; i++) {
    await wait(300);
    try {
      version = await get('http://127.0.0.1:9333/json/version');
      if (version && version.webSocketDebuggerUrl) break;
    } catch {}
  }

  if (!version) {
    console.error('Failed to connect to Chrome debug port');
    chrome.kill();
    return;
  }

  console.log('Connected to Chrome version:', version['Browser']);

  const targets = await get('http://127.0.0.1:9333/json/list');
  const target = targets[0];
  console.log('Using target:', target.webSocketDebuggerUrl);

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.reject(msg.error);
      else cb.resolve(msg.result);
    }
  };

  console.log('Enabling Page & Runtime...');
  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Navigating to http://localhost:3000...');
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await wait(2500); // Wait for page to load & peek animations

  const outDir = 'reference/screenshots/test_fixes';
  fs.mkdirSync(outDir, { recursive: true });

  async function takeScreenshot(name) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(path.join(outDir, name), buffer);
    console.log(`Saved screenshot ${name} (${buffer.length} bytes)`);
  }

  // 1. Initial Hero Stage
  await takeScreenshot('01_hero_default.png');

  // 2. Move cursor towards the left arched card (e.g., x=340, y=750)
  console.log('Dispatching mouse moves towards left puppy cards (Maltipoo / Teacup Poodle)...');
  for (let x = 700; x >= 320; x -= 40) {
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: x,
      y: 750,
      pointerType: 'mouse'
    });
    await wait(60);
  }
  await wait(400);

  // Take screenshot of Teddy looking left with "hm?" bubble
  await takeScreenshot('02_teddy_looking_left_hm.png');

  // 3. Hover directly over Teddy in the center (x=720, y=820)
  console.log('Dispatching mouse move directly onto Teddy...');
  for (let x = 320; x <= 720; x += 50) {
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: x,
      y: 820,
      pointerType: 'mouse'
    });
    await wait(40);
  }
  await wait(400);

  // Take screenshot of Teddy hovered (happy closed eyes ^ ^, blushing cheeks)
  await takeScreenshot('03_teddy_happy_hover.png');

  // 4. Test Mouse Trail: Move cursor in a gentle sweep across screen
  console.log('Dispatching sweeping mouse movement to draw paw trail...');
  for (let t = 0; t <= Math.PI * 2; t += 0.2) {
    const px = 720 + Math.cos(t) * 220;
    const py = 500 + Math.sin(t) * 120;
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: Math.round(px),
      y: Math.round(py),
      pointerType: 'mouse'
    });
    await wait(40);
  }
  await wait(150);

  // Take screenshot of the paw prints on the canvas
  await takeScreenshot('04_paw_trail_active.png');

  ws.close();
  chrome.kill();
  console.log('All tests completed successfully!');
}

main().catch(console.error);

