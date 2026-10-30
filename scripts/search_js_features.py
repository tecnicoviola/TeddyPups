import glob
import re

def search():
    js_files = glob.glob("reference/js/*.js")
    print(f"Searching {len(js_files)} JS files...")

    keywords = ["PawTrail", "paw-press", "cursor/paw", "pawTrail", "pup-buddy", "pup-bubble", "hm?", "eye", "facing"]
    for jf in js_files:
        with open(jf, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        for kw in keywords:
            if kw.lower() in content.lower():
                matches = [m.start() for m in re.finditer(re.escape(kw), content, re.IGNORECASE)]
                print(f"[{os.path.basename(jf)}] found '{kw}' ({len(matches)} times)")
                for pos in matches[:2]:
                    snippet = content[max(0, pos-100):min(len(content), pos+200)]
                    print(f"   Snippet: {snippet!r}")

if __name__ == "__main__":
    import os
    search()

