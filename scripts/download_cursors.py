import urllib.request
import os

BASE_URL = "https://puppy.instabizweb.com"

for c in ["/cursor/paw.svg", "/cursor/paw-press.svg"]:
    url = BASE_URL + c
    out_file = os.path.join("public", c.replace("/", "", 1))
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
            with open(out_file, "wb") as f:
                f.write(content)
            print(f"Downloaded {c} -> {out_file} ({len(content)} bytes)")
    except Exception as e:
        print(f"Failed to download {c}: {e}")

