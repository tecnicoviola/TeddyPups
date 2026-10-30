import os
import glob
from bs4 import BeautifulSoup
import json

PAGES = ["home", "puppies", "how-it-works", "happy-families", "gone-home", "faq", "contact"]

def extract():
    os.makedirs("reference/mains", exist_ok=True)
    summary = {}
    for p in PAGES:
        path = f"reference/pages/{p}.html"
        if not os.path.exists(path):
            print(f"Missing {path}")
            continue
        with open(path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        main = soup.find("main")
        if main:
            out_file = f"reference/mains/{p}.html"
            with open(out_file, "w", encoding="utf-8") as f_out:
                f_out.write(str(main))
            summary[p] = {
                "length": len(str(main)),
                "classes": main.get("class"),
                "children": [c.name for c in main.children if c.name]
            }
            print(f"Extracted main for {p}: {len(str(main))} chars")
        else:
            print(f"No main tag in {p}")

    with open("reference/mains/summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

if __name__ == "__main__":
    extract()

