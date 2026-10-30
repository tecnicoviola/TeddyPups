import json
import glob
from bs4 import BeautifulSoup
import re

def clean_data():
    with open("reference/pages/puppies.html", "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    # Find the cards container
    # Cards have links to /puppies/...
    cards = []
    card_anchors = soup.find_all("a", href=re.compile(r"^/puppies/([a-z0-9\-]+)$"))
    print(f"Found {len(card_anchors)} puppy card anchors on /puppies")
    
    seen = set()
    for a in card_anchors:
        href = a["href"]
        if href in seen:
            continue
        seen.add(href)
        
        # Image
        img = a.find("img")
        img_src = img["src"] if img else ""
        img_alt = img.get("alt", "") if img else ""
        
        # Badge / status
        # Check text
        all_text = list(a.stripped_strings)
        
        cards.append({
            "href": href,
            "slug": href.replace("/puppies/", ""),
            "img_src": img_src,
            "img_alt": img_alt,
            "strings": all_text
        })

    with open("reference/data/puppies_clean_listing.json", "w", encoding="utf-8") as f:
        json.dump(cards, f, indent=2)

    for i, c in enumerate(cards):
        print(f"[{i+1}] {c['slug']}: {c['strings']}")

if __name__ == "__main__":
    clean_data()

