import urllib.request
import re
import os
import json
import glob
from urllib.parse import urlparse, parse_qs, unquote

BASE_URL = "https://puppy.instabizweb.com"

def get_headers():
    return {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    }

def download_file(url, out_path):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        return True
    try:
        req = urllib.request.Request(url, headers=get_headers())
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            with open(out_path, "wb") as f:
                f.write(content)
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def main():
    os.makedirs("reference/assets", exist_ok=True)
    os.makedirs("reference/assets/images", exist_ok=True)
    os.makedirs("reference/assets/fonts", exist_ok=True)
    
    html_files = glob.glob("reference/pages/*.html")
    all_img_urls = set()
    all_font_urls = set()

    for hf in html_files:
        with open(hf, "r", encoding="utf-8") as f:
            html = f.read()

        # Find img src
        for src in re.findall(r'<img[^>]+src="([^"]+)"', html):
            all_img_urls.add(src)

        # Find img srcset
        for srcset in re.findall(r'srcset="([^"]+)"', html):
            for part in srcset.split(","):
                u = part.strip().split(" ")[0]
                if u:
                    all_img_urls.add(u)

        # Find background-image or url(...)
        for u in re.findall(r'url\([\'"]?([^\'"\)]+)[\'"]?\)', html):
            if any(u.endswith(ext) for ext in ['.woff2', '.woff', '.ttf']):
                all_font_urls.add(u)
            elif any(u.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.webp', '.svg']):
                all_img_urls.add(u)

        # Find link rel="preload" as="font"
        for u in re.findall(r'<link[^>]+as="font"[^>]+href="([^"]+)"', html):
            all_font_urls.add(u)

        # Brand / icons
        for u in re.findall(r'href="([^"]+\.(?:png|ico|svg|webp))(?:\?[^"]*)?"', html):
            all_img_urls.add(u)

    print(f"Found {len(all_img_urls)} unique image URLs and {len(all_font_urls)} font URLs.")

    # Download fonts
    for fu in sorted(all_font_urls):
        full_url = BASE_URL + fu if fu.startswith("/") else fu
        fname = os.path.basename(urlparse(full_url).path)
        out = os.path.join("reference/assets/fonts", fname)
        print(f"Downloading font: {fname}...")
        download_file(full_url, out)

    # Download images
    downloaded_images = {}
    for iu in sorted(all_img_urls):
        full_url = BASE_URL + iu if iu.startswith("/") else iu
        # If it's a Next.js optimized image like /_next/image?url=%2F...&w=...
        parsed = urlparse(full_url)
        if "/_next/image" in parsed.path:
            qs = parse_qs(parsed.query)
            orig_path = qs.get("url", [""])[0]
            w = qs.get("w", ["orig"])[0]
            clean_name = os.path.basename(orig_path)
            fname = f"{w}_{clean_name}" if orig_path else os.path.basename(parsed.path)
            # Also download the original unoptimized path if internal!
            if orig_path.startswith("/"):
                orig_full_url = BASE_URL + orig_path
                orig_fname = os.path.basename(orig_path)
                download_file(orig_full_url, os.path.join("reference/assets/images", orig_fname))
        else:
            fname = os.path.basename(parsed.path)
        
        if not fname or fname == "":
            fname = "asset_" + str(len(downloaded_images))

        out = os.path.join("reference/assets/images", fname)
        if download_file(full_url, out):
            downloaded_images[iu] = {
                "url": full_url,
                "local_file": out,
                "size": os.path.getsize(out)
            }

    with open("reference/data/asset_catalog.json", "w", encoding="utf-8") as f:
        json.dump({
            "images": downloaded_images,
            "fonts": list(all_font_urls)
        }, f, indent=2)

    print(f"Successfully downloaded {len(downloaded_images)} images and {len(all_font_urls)} fonts.")

if __name__ == "__main__":
    main()

