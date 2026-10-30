import urllib.request
import re
import os
import json
import time

BASE_URL = "https://puppy.instabizweb.com"

PAGES = [
    "/",
    "/puppies",
    "/how-it-works",
    "/happy-families",
    "/gone-home",
    "/faq",
    "/contact",
    "/puppies/blue-marle-pomeranian",
    "/puppies/copper-male",
    "/puppies/korean-teacup-maltipoo-female",
    "/puppies/korean-teacup-pomeranian",
    "/puppies/korean-teacup-pomeranian-1",
    "/puppies/korean-teacup-pomeranian-male",
    "/puppies/korean-teacup-poodle-female",
    "/puppies/maltipoo-cavapoo-male",
    "/puppies/maltipoo-female",
    "/puppies/maltipoo-female-1",
    "/puppies/maltipoo-female-2",
    "/puppies/maltipoo-max-male",
    "/puppies/maltipoo-mia-girl",
    "/puppies/maltipoo-sadie-girl",
    "/puppies/pomeranian-ace-boy",
    "/puppies/pomeranian-female",
    "/puppies/poodle-leo-male",
    "/puppies/shitzu-female",
    "/puppies/shitzu-male",
    "/puppies/toy-poodle-male-female"
]

def fetch(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        return resp.status, dict(resp.headers), resp.read()

def main():
    os.makedirs("reference/pages", exist_ok=True)
    os.makedirs("reference/css", exist_ok=True)
    os.makedirs("reference/data", exist_ok=True)

    css_files = set()
    page_inventory = []

    for path in PAGES:
        url = f"{BASE_URL}{path}"
        slug_name = path.strip("/").replace("/", "_")
        if not slug_name:
            slug_name = "home"
        print(f"Fetching {path} -> {slug_name}...")
        try:
            status, headers, body = fetch(url)
            html = body.decode('utf-8', errors='ignore')
            
            # Save page html
            out_file = f"reference/pages/{slug_name}.html"
            with open(out_file, "w", encoding="utf-8") as f:
                f.write(html)

            # Extract title
            m_title = re.search(r'<title>(.*?)</title>', html)
            title = m_title.group(1) if m_title else ""

            # Extract CSS
            css_matches = re.findall(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"', html)
            for c in css_matches:
                css_files.add(c)

            page_inventory.append({
                "path": path,
                "slug": slug_name,
                "status": status,
                "title": title,
                "length": len(html)
            })
            time.sleep(0.2)
        except Exception as e:
            print(f"Error fetching {path}: {e}")
            page_inventory.append({
                "path": path,
                "slug": slug_name,
                "error": str(e)
            })

    with open("reference/data/page_inventory.json", "w", encoding="utf-8") as f:
        json.dump(page_inventory, f, indent=2)

    print("\n--- Downloading CSS Files ---")
    for css_url in sorted(css_files):
        print("CSS:", css_url)
        full_css_url = BASE_URL + css_url if css_url.startswith("/") else css_url
        try:
            _, _, css_body = fetch(full_css_url)
            css_name = os.path.basename(css_url.split("?")[0])
            with open(f"reference/css/{css_name}", "wb") as f:
                f.write(css_body)
            print(f"  Saved reference/css/{css_name} ({len(css_body)} bytes)")
        except Exception as e:
            print(f"  Failed to fetch CSS {css_url}: {e}")

if __name__ == "__main__":
    main()

