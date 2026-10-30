import urllib.request
import re
import os
import json
from html import unescape

BASE_URL = "https://puppy.instabizweb.com"

def fetch_url(url):
    print(f"Fetching {url}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        content = resp.read()
        return resp.status, dict(resp.headers), content

def main():
    os.makedirs("reference", exist_ok=True)
    os.makedirs("reference/assets", exist_ok=True)
    os.makedirs("reference/screenshots", exist_ok=True)
    os.makedirs("docs", exist_ok=True)

    status, headers, content = fetch_url(f"{BASE_URL}/puppies")
    html_text = content.decode('utf-8', errors='ignore')
    
    with open("reference/puppies_raw.html", "w", encoding="utf-8") as f:
        f.write(html_text)
    print("Saved reference/puppies_raw.html, size:", len(html_text))

    # Extract all hrefs
    hrefs = set(re.findall(r'href="([^"]+)"', html_text))
    # Extract all srcs
    srcs = set(re.findall(r'src="([^"]+)"', html_text))
    # Extract all images from srcset
    srcsets = re.findall(r'srcset="([^"]+)"', html_text, re.IGNORECASE)

    print("\n--- Discovered hrefs ---")
    internal_routes = set()
    for h in sorted(hrefs):
        print("  href:", h)
        if h.startswith("/") and not h.startswith("//") and not h.startswith("/_next"):
            internal_routes.add(h)

    print("\n--- Internal Routes ---")
    for r in sorted(internal_routes):
        print("  route:", r)

    # Search for Next.js flight data / self.__next_f
    flight_data = re.findall(r'self\.__next_f\.push\(\[(.*?)\}\]\)', html_text, re.DOTALL)
    print("\nNext.js flight data chunks count:", len(flight_data))

    # Also search for JSON scripts
    json_scripts = re.findall(r'<script[^>]*type="application/json"[^>]*>(.*?)</script>', html_text, re.DOTALL)
    print("Application JSON scripts count:", len(json_scripts))
    for i, js in enumerate(json_scripts):
        with open(f"reference/script_{i}.json", "w", encoding="utf-8") as f:
            f.write(js)

    # Save summary of discovered assets
    assets = {
        "hrefs": sorted(list(hrefs)),
        "srcs": sorted(list(srcs)),
        "internal_routes": sorted(list(internal_routes))
    }
    with open("reference/discovered_urls.json", "w", encoding="utf-8") as f:
        json.dump(assets, f, indent=2)

if __name__ == "__main__":
    main()

