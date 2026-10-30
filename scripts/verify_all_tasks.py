import asyncio
import json
import os
import subprocess
import time
import urllib.request
import websockets

ARTIFACTS_DIR = r"C:\Users\suhan\.gemini\antigravity\brain\cfae791a-a006-4246-96bd-056b57651394"
CHROME_PROFILE = os.path.join(ARTIFACTS_DIR, "chrome_profile_temp")

class CDPClient:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.ws = None
        self.msg_id = 1

    async def connect(self):
        self.ws = await websockets.connect(self.ws_url, max_size=20*1024*1024)

    async def send(self, method, params=None):
        mid = self.msg_id
        self.msg_id += 1
        payload = {"id": mid, "method": method, "params": params or {}}
        await self.ws.send(json.dumps(payload))
        while True:
            res = json.loads(await self.ws.recv())
            if res.get("id") == mid:
                return res.get("result", {})

    async def eval(self, expr):
        res = await self.send("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
        if "exceptionDetails" in res:
            raise Exception(f"JS Eval exception: {res['exceptionDetails']}")
        return res.get("result", {}).get("value")

    async def screenshot(self, path):
        res = await self.send("Page.captureScreenshot", {"format": "png"})
        data = res.get("data")
        import base64
        with open(path, "wb") as f:
            f.write(base64.b64decode(data))
        print(f"Saved screenshot: {path}")

    async def close(self):
        if self.ws:
            await self.ws.close()

def get_base_url():
    for port in [3000, 3001]:
        try:
            req = urllib.request.urlopen(f"http://localhost:{port}/", timeout=1)
            if req.status == 200:
                print(f"Found server on port {port}")
                return f"http://localhost:{port}"
        except Exception:
            pass
    raise Exception("No dev server found on port 3000 or 3001")

async def run_tests():
    base_url = get_base_url()
    chrome_exe = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    os.makedirs(CHROME_PROFILE, exist_ok=True)

    proc = subprocess.Popen([
        chrome_exe,
        '--headless=new',
        '--remote-debugging-port=9222',
        f'--user-data-dir={CHROME_PROFILE}',
        '--disable-gpu',
        '--no-first-run',
        'about:blank'
    ])
    print(f"Started Chrome PID {proc.pid}")

    ws_url = None
    for _ in range(15):
        time.sleep(0.5)
        try:
            req = urllib.request.urlopen("http://localhost:9222/json", timeout=1)
            targets = json.loads(req.read().decode())
            page_targets = [t for t in targets if t.get("type") == "page"]
            if page_targets:
                ws_url = page_targets[0]["webSocketDebuggerUrl"]
                break
        except Exception:
            pass

    if not ws_url:
        proc.kill()
        raise Exception("Could not connect to Chrome debugging target on :9222")

    client = CDPClient(ws_url)
    await client.connect()

    try:
        # TEST 1: FAQ Page
        print("\n--- TEST 1: FAQ PAGE ---")
        await client.send("Page.navigate", {"url": f"{base_url}/faq"})
        await asyncio.sleep(2)

        # Check initial mascot bubble
        initial_q = await client.eval("""
            (() => {
                const el = document.querySelector('.tp-notes');
                const hasOpen = el ? el.hasAttribute('data-open') : null;
                const bubble = document.querySelector('.tp-notes__bubble');
                const text = bubble ? bubble.textContent : '';
                return { hasOpen, text };
            })()
        """)
        print("FAQ Initial state:", initial_q)
        assert initial_q["hasOpen"] is False, "data-open should be absent initially"
        assert initial_q["text"] == "?!", "Speech bubble container should have ?! spans"

        # Type in search input
        await client.eval("""
            (() => {
                const input = document.getElementById('faq-search-input');
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                setter.call(input, 'Maltipoo');
                input.dispatchEvent(new Event('input', { bubbles: true }));
            })()
        """)
        await asyncio.sleep(0.5)

        searching_state = await client.eval("""
            (() => {
                const el = document.querySelector('.tp-notes');
                const hasOpen = el ? el.hasAttribute('data-open') : null;
                const count = document.querySelector('.tp-notes__count')?.textContent;
                return { hasOpen, count };
            })()
        """)
        print("FAQ Searching state:", searching_state)
        assert searching_state["hasOpen"] is True, "data-open should be present while searching"
        assert "found" in searching_state["count"], f"Count should say found: {searching_state['count']}"

        await client.screenshot(os.path.join(ARTIFACTS_DIR, "faq_searching_state.png"))

        # Clear search input
        await client.eval("""
            (() => {
                const input = document.getElementById('faq-search-input');
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                setter.call(input, '');
                input.dispatchEvent(new Event('input', { bubbles: true }));
            })()
        """)
        await asyncio.sleep(0.5)

        cleared_state = await client.eval("""
            (() => {
                const el = document.querySelector('.tp-notes');
                const hasOpen = el ? el.hasAttribute('data-open') : null;
                const count = document.querySelector('.tp-notes__count')?.textContent;
                return { hasOpen, count };
            })()
        """)
        print("FAQ Cleared state:", cleared_state)
        assert cleared_state["hasOpen"] is False, "data-open should be absent after clearing"
        assert "notes on the board" in cleared_state["count"], f"Count should revert: {cleared_state['count']}"

        # TEST 2: Contact Page
        print("\n--- TEST 2: CONTACT PAGE ---")
        await client.send("Page.navigate", {"url": f"{base_url}/contact"})
        await asyncio.sleep(2)

        # Verify email in contact page
        contact_email = await client.eval("""
            (() => {
                const a = document.querySelector('a[href^="mailto:"]');
                return { href: a?.getAttribute('href'), text: a?.textContent?.trim() };
            })()
        """)
        print("Contact Email:", contact_email)
        assert contact_email["href"] == "mailto:teddypupsadmin@gmail.com", f"Wrong href: {contact_email['href']}"
        assert contact_email["text"] == "teddypupsadmin@gmail.com", f"Wrong text: {contact_email['text']}"

        # Submit empty form to trigger validation
        await client.eval("""
            (() => {
                const btn = document.querySelector('.tp-letterform button[type="submit"]');
                btn.click();
            })()
        """)
        await asyncio.sleep(0.5)

        val_state = await client.eval("""
            (() => {
                const alert = document.querySelector('.tp-letterform__alert');
                const alertTitle = alert?.querySelector('p')?.textContent;
                const errorItems = Array.from(alert?.querySelectorAll('li') || []).map(li => li.textContent);
                const invalidInputs = Array.from(document.querySelectorAll('[aria-invalid="true"]')).map(i => i.getAttribute('name'));
                const activeEl = document.activeElement?.getAttribute('name');
                return { alertTitle, errorItems, invalidInputs, activeEl };
            })()
        """)
        print("Validation error state:", val_state)
        assert val_state["alertTitle"] == "Please check the highlighted fields.", f"Wrong alert title: {val_state['alertTitle']}"
        assert "name" in val_state["invalidInputs"], "Name input should be invalid"
        assert "phone" in val_state["invalidInputs"], "Phone input should be invalid"
        assert val_state["activeEl"] == "name", "First invalid input (name) should have focus"

        await client.screenshot(os.path.join(ARTIFACTS_DIR, "contact_validation_alert.png"))

        # Fill valid form and submit
        await client.eval("""
            (() => {
                const nameInput = document.querySelector('input[name="name"]');
                const phoneInput = document.querySelector('input[name="phone"]');
                const emailInput = document.querySelector('input[name="email"]');
                const msgInput = document.querySelector('textarea[name="message"]');

                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;

                nativeInputValueSetter.call(nameInput, 'Sophia Al-Maktoum');
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));

                nativeInputValueSetter.call(phoneInput, '+971 50 987 6543');
                phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

                nativeInputValueSetter.call(emailInput, 'sophia@example.com');
                emailInput.dispatchEvent(new Event('input', { bubbles: true }));

                nativeTextareaValueSetter.call(msgInput, 'We are so excited to welcome our new puppy!');
                msgInput.dispatchEvent(new Event('input', { bubbles: true }));
            })()
        """)
        await asyncio.sleep(0.5)

        # Click submit
        await client.eval("""
            (() => {
                const btn = document.querySelector('.tp-letterform button[type="submit"]');
                btn.click();
            })()
        """)
        
        # Check sealing / posting state
        await asyncio.sleep(0.3)
        sealing_phase = await client.eval("""
            (() => {
                const post = document.querySelector('.tp-post');
                const phase = post?.getAttribute('data-phase');
                const btn = document.querySelector('.tp-letterform button[type="submit"]');
                const hasEnv = !!document.querySelector('.tp-post__envelope');
                return { phase, btnText: btn?.textContent, disabled: btn?.disabled, hasEnv };
            })()
        """)
        print("Sealing phase state:", sealing_phase)
        assert sealing_phase["phase"] in ["sealing", "posting"], f"Expected sealing/posting, got {sealing_phase['phase']}"
        assert sealing_phase["disabled"] is True, "Button should be disabled"
        assert sealing_phase["hasEnv"] is True, "Envelope SVG should be present"

        await client.screenshot(os.path.join(ARTIFACTS_DIR, "contact_letter_sealing.png"))

        # Wait for phase transition to sent (1750ms total)
        await asyncio.sleep(2.0)
        sent_state = await client.eval("""
            (() => {
                const post = document.querySelector('.tp-post');
                const phase = post?.getAttribute('data-phase');
                const sentBox = document.querySelector('.tp-post__sent');
                const heading = sentBox?.querySelector('p.font-plush')?.textContent;
                const whatsappBtn = sentBox?.querySelector('a.btn-whatsapp');
                return {
                    phase,
                    heading,
                    hasSentBox: !!sentBox,
                    whatsappHref: whatsappBtn?.getAttribute('href')
                };
            })()
        """)
        print("Sent confirmation state:", sent_state)
        assert sent_state["phase"] == "sent", f"Phase should be sent: {sent_state['phase']}"
        assert sent_state["heading"] == "Message received!", f"Wrong heading: {sent_state['heading']}"
        assert "wa.me" in sent_state["whatsappHref"], "WhatsApp link should be present"

        await client.screenshot(os.path.join(ARTIFACTS_DIR, "contact_letter_sent.png"))

        # TEST 3: Happy Families Page
        print("\n--- TEST 3: HAPPY FAMILIES PAGE ---")
        await client.send("Page.navigate", {"url": f"{base_url}/happy-families"})
        await asyncio.sleep(2)

        # Scroll to bottom foot mascot
        await client.eval("""
            (() => {
                const foot = document.querySelector('.tp-memories__foot');
                foot?.scrollIntoView({ block: 'center' });
            })()
        """)
        await asyncio.sleep(0.5)

        # Inspect foot mascot
        foot_mascot = await client.eval("""
            (() => {
                const foot = document.querySelector('.tp-memories__foot');
                const pup = foot?.querySelector('.pup-buddy');
                const facing = pup?.getAttribute('data-facing');
                const svg = pup?.querySelector('svg');
                const label = svg?.getAttribute('aria-label');
                const caption = foot?.querySelector('p.font-scrawl')?.textContent;
                return {
                    hasFoot: !!foot,
                    hasPup: !!pup,
                    facing,
                    label,
                    caption
                };
            })()
        """)
        print("Happy Families foot mascot:", foot_mascot)
        assert foot_mascot["hasPup"] is True, "PupBuddy must be present in tp-memories__foot"
        assert foot_mascot["facing"] == "left", f"Facing should be left: {foot_mascot['facing']}"
        assert foot_mascot["label"] == "Teddy, admiring the wall", f"Wrong label: {foot_mascot['label']}"
        assert foot_mascot["caption"] == "every one of them was a Teddy Pup once", f"Wrong caption: {foot_mascot['caption']}"

        # Verify tail wagging animation over 400ms
        tail_t1 = await client.eval("""
            (() => {
                const tail = document.querySelector('.tp-memories__foot [data-p="tail"]');
                return tail?.getAttribute('transform');
            })()
        """)
        await asyncio.sleep(0.4)
        tail_t2 = await client.eval("""
            (() => {
                const tail = document.querySelector('.tp-memories__foot [data-p="tail"]');
                return tail?.getAttribute('transform');
            })()
        """)
        print(f"Tail transforms: t1={tail_t1}, t2={tail_t2}")
        assert tail_t1 != tail_t2, f"Tail should animate! t1={tail_t1}, t2={tail_t2}"

        await client.screenshot(os.path.join(ARTIFACTS_DIR, "happy_families_foot_mascot.png"))

        # Verify photo modal click
        await client.eval("""
            (() => {
                const firstPhoto = document.querySelector('.tp-wall__print');
                firstPhoto?.click();
            })()
        """)
        await asyncio.sleep(0.5)

        modal_open = await client.eval("""
            (() => {
                const modal = document.querySelector('[role="dialog"], .tp-modal, .tp-viewer, dialog[open]');
                return !!modal;
            })()
        """)
        print("Photo modal open check:", modal_open)
        assert modal_open is True, "Photo modal should open on click"
        await client.screenshot(os.path.join(ARTIFACTS_DIR, "happy_families_photo_modal.png"))

        print("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY! 100%")

    finally:
        await client.close()
        proc.kill()

if __name__ == "__main__":
    asyncio.run(run_tests())
