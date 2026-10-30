import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\suhan\\AppData\\Local\\Temp\\chrome_cdp_scroll1440';

async function getWsUrl(port) {
  for (let i = 0; i < 30; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http
          .get(`http://127.0.0.1:${port}/json/list`, (res) => {
            let body = '';
            res.on('data', (c) => (body += c));
            res.on('end', () => resolve(JSON.parse(body)));
          })
          .on('error', reject);
      });
      const page = data.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        return page.webSocketDebuggerUrl;
      }
      await new Promise((r) => setTimeout(r, 200));
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error('Chrome did not start in time');
}

async function capture() {
  const port = 9234;
  const proc = spawn(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      '--window-size=1440,900',
      'http://localhost:3000/',
    ],
    { stdio: 'ignore' }
  );

  try {
    const wsUrl = await getWsUrl(port);
    console.log('Connected to Page CDP:', wsUrl);

    const ws = new WebSocket(wsUrl);
    await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

    let id = 1;
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const msgId = id++;
        const onMsg = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === msgId) {
            ws.removeEventListener('message', onMsg);
            resolve(res.result);
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

    // Wait 2.5 seconds for page load, fonts, entrance animations
    await new Promise((r) => setTimeout(r, 2500));

    const scrollTargets = [
      { y: 0, name: 'mascot_scroll_0_peek.png', desc: 'Initial peeking behind quilt' },
      { y: 220, name: 'mascot_scroll_220_emerge.png', desc: 'Emerging, hopping out in front' },
      { y: 450, name: 'mascot_scroll_450_walking.png', desc: 'Full-body walking and turning' },
      { y: 700, name: 'mascot_scroll_700_meet.png', desc: 'Arriving at Meet the pups' },
      { y: 50, name: 'mascot_scroll_reverse_peek.png', desc: 'Reversing scroll back to quilt' },
    ];

    const outDir = 'C:\\Users\\suhan\\.gemini\\antigravity\\brain\\cfae791a-a006-4246-96bd-056b57651394';

    for (const target of scrollTargets) {
      console.log(`Scrolling to Y=${target.y} (${target.desc})...`);
      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: ${target.y}, behavior: 'instant' });`,
      });
      // Wait 600ms for RAF ticks to settle position and animation
      await new Promise((r) => setTimeout(r, 600));

      const debugState = await send('Runtime.evaluate', {
        expression: `(() => {
          const layer = document.querySelector('.pup-layer');
          const actor = document.querySelector('.pup-actor');
          const svg = actor ? actor.querySelector('svg') : null;
          const body = svg ? svg.querySelector('[data-p="body"]') : null;
          const ledge = svg ? svg.querySelector('[data-p="ledge"]') : null;
          return {
            scrollY: window.scrollY,
            front: layer ? layer.dataset.front : null,
            actorTransform: actor ? actor.style.transform : null,
            bodyOpacity: body ? body.getAttribute('opacity') : null,
            ledgeOpacity: ledge ? ledge.getAttribute('opacity') : null
          };
        })()`,
        returnByValue: true,
      });
      console.log(' State at Y=' + target.y + ':', debugState.result.value);

      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(res.data, 'base64');
      fs.writeFileSync(path.join(outDir, target.name), buf);
      console.log(` Saved screenshot: ${target.name} (${buf.length} bytes)`);
    }

    ws.close();
  } finally {
    proc.kill();
  }
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
