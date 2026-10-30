import glob
import re
import urllib.request
import os

BASE_URL = "https://puppy.instabizweb.com"

def get_js_chunks():
    os.makedirs("reference/js", exist_ok=True)
    all_scripts = set()
    for f in glob.glob("reference/pages/*.html"):
        with open(f, "r", encoding="utf-8") as fh:
            content = fh.read()
        for s in re.findall(r'src="([^"]+\.js)"', content):
            all_scripts.add(s)

    print(f"Found {len(all_scripts)} unique JS chunks.")
    for s in sorted(all_scripts):
        fname = os.path.basename(s)
        out_path = os.path.join("reference/js", fname)
        if not os.path.exists(out_path):
            url = BASE_URL + s if s.startswith("/") else s
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req) as resp:
                    with open(out_path, "wb") as out_f:
                        out_f.write(resp.read())
                print(f"Downloaded {fname}")
            except Exception as e:
                print(f"Error downloading {fname}: {e}")
        else:
            print(f"Cached {fname}")

if __name__ == "__main__":
    get_js_chunks()

