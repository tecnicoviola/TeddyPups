import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    hasTouch: false,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Ensure output dir exists
  const outDir = 'reference/screenshots/test_fixes';
  fs.mkdirSync(outDir, { recursive: true });

  // 1. Initial screenshot of hero stage
  console.log('Taking initial hero stage screenshot...');
  const heroStage = page.locator('.tp-hero');
  await heroStage.screenshot({ path: path.join(outDir, '01_initial_hero.png') });

  // 2. Move mouse to the left card (around Seat 1 or 0)
  console.log('Moving mouse towards left card to trigger Teddy eye tracking & hm? bubble...');
  const firstSeat = page.locator('.tp-lineup__seat').first();
  const seatBox = await firstSeat.boundingBox();
  if (seatBox) {
    // Move progressively to simulate realistic mouse trail
    await page.mouse.move(seatBox.x + 300, seatBox.y + 100);
    await page.waitForTimeout(100);
    await page.mouse.move(seatBox.x + 150, seatBox.y + 60);
    await page.waitForTimeout(100);
    await page.mouse.move(seatBox.x + 40, seatBox.y + 30);
  }
  await page.waitForTimeout(400);

  // Check Teddy eyes transform and speech bubble
  const eyeTransform = await page.evaluate(() => {
    const eyes = document.querySelector('[data-p="eyes"]');
    const bubble = document.querySelector('.pup-bubble');
    return {
      eyes: eyes ? eyes.getAttribute('transform') : null,
      bubbleShow: bubble ? bubble.getAttribute('data-show') : null,
      bubbleText: bubble ? bubble.textContent : null,
    };
  });
  console.log('Teddy state when looking left:', eyeTransform);

  await heroStage.screenshot({ path: path.join(outDir, '02_teddy_looking_left_with_bubble.png') });

  // 3. Hover directly over Teddy
  console.log('Hovering directly over Teddy...');
  const teddy = page.locator('.tp-hero__teddy');
  await teddy.hover();
  await page.waitForTimeout(300);

  const teddyHoverState = await page.evaluate(() => {
    const happyEyes = document.querySelector('[data-p="happy"]');
    const openEyes = document.querySelector('[data-p="open"]');
    return {
      happyOpacity: happyEyes ? happyEyes.getAttribute('opacity') : null,
      openOpacity: openEyes ? openEyes.getAttribute('opacity') : null,
    };
  });
  console.log('Teddy hover state:', teddyHoverState);

  await heroStage.screenshot({ path: path.join(outDir, '03_teddy_happy_hover.png') });

  // 4. Wait for card swap animation
  console.log('Waiting for card swapping animation...');
  // Move mouse away from cards to let auto-swap run
  await page.mouse.move(100, 100);
  await page.waitForTimeout(3200);

  const swappedState = await page.evaluate(() => {
    const activeTags = [...document.querySelectorAll('.tp-lineup__ghost')].map(g => g.getAttribute('data-tag'));
    const names = [...document.querySelectorAll('.tp-lineup__name')].map(n => n.textContent);
    return { activeTags, names };
  });
  console.log('Card swapping state after 3.2s:', swappedState);

  await heroStage.screenshot({ path: path.join(outDir, '04_cards_swapped.png') });

  // 5. Test canvas paw trail
  console.log('Moving cursor in zig-zag to test paw trail...');
  await page.mouse.move(300, 400);
  await page.mouse.move(380, 430);
  await page.mouse.move(450, 410);
  await page.mouse.move(530, 450);
  await page.mouse.move(620, 420);
  await page.waitForTimeout(100);

  await page.screenshot({ path: path.join(outDir, '05_paw_trail_canvas.png') });

  await browser.close();
  console.log('Test completed successfully! Screenshots saved to', outDir);
}

run().catch(console.error);

