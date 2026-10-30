import urllib.request
import re
import os
import glob
from urllib.parse import urlparse, parse_qs, unquote

BASE_URL = "https://puppy.instabizweb.com"

def get_headers():
    return {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    }

def main():
    os.makedirs("public/images", exist_ok=True)
    os.makedirs("public/media", exist_ok=True)
    os.makedirs("public/_next/image", exist_ok=True)

    all_html_files = glob.glob("reference/pages/*.html") + glob.glob("reference/mains/*.html")
    img_urls = set()

    for hf in all_html_files:
        with open(hf, "r", encoding="utf-8") as f:
            html = f.read()
        for src in re.findall(r'src="([^"]+)"', html):
            if "image" in src or "brand" in src or ".jpg" in src or ".webp" in src or ".png" in src:
                img_urls.add(src)
        for srcset in re.findall(r'srcset="([^"]+)"', html):
            for part in srcset.split(","):
                u = part.strip().split(" ")[0]
                if u:
                    img_urls.add(u)

    print(f"Total image requests to check: {len(img_urls)}")

    success_count = 0
    for u in img_urls:
        clean_u = u.replace("&amp;", "&")
        # Check if it's a Next image url
        parsed = urlparse(clean_u)
        qs = parse_qs(parsed.query)
        inner_url = qs.get("url", [""])[0]

        # Target file name
        base_name = os.path.basename(inner_url) if inner_url else os.path.basename(parsed.path)
        if not base_name:
            continue

        target_path = os.path.join("public/images", base_name)
        if os.path.exists(target_path) and os.path.getsize(target_path) > 0:
            continue

        full_fetch_url = BASE_URL + clean_u if clean_u.startswith("/") else clean_u
        try:
            req = urllib.request.Request(full_fetch_url, headers=get_headers())
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
                with open(target_path, "wb") as f_out:
                    f_out.write(data)
                success_count += 1
                print(f"Downloaded: {base_name} ({len(data)} bytes)")
        except Exception as e:
            # Try fetching inner_url directly if Next image returned error
            if inner_url and inner_url.startswith("/"):
                try:
                    direct_url = BASE_URL + inner_url
                    req2 = urllib.request.Request(direct_url, headers=get_headers())
                    with urllib.request.urlopen(req2, timeout=10) as resp2:
                        data2 = resp2.read()
                        with open(target_path, "wb") as f_out2:
                            f_out2.write(data2)
                        success_count += 1
                        print(f"Downloaded via direct inner url: {base_name} ({len(data2)} bytes)")
                except Exception as e2:
                    print(f"Failed {base_name}: {e} / {e2}")

    print(f"Total newly downloaded images: {success_count}")
    print(f"Total images now in public/images: {len(os.listdir('public/images'))}")

if __name__ == "__main__":
    main()

