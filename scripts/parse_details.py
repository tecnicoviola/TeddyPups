import os
import re
import json
import glob
from bs4 import BeautifulSoup

def main():
    puppy_files = glob.glob("reference/pages/puppies_*.html")
    print(f"Found {len(puppy_files)} puppy detail page files.")

    all_puppies = []

    for pf in sorted(puppy_files):
        slug = os.path.basename(pf).replace(".html", "").replace("puppies_", "")
        with open(pf, "r", encoding="utf-8") as f:
            html = f.read()

        soup = BeautifulSoup(html, "html.parser")
        
        # Title
        title_el = soup.find("title")
        title = title_el.text if title_el else ""

        # Headings
        h1 = soup.find("h1")
        h1_text = h1.text.strip() if h1 else ""

        # Find price (usually contains AED or currency)
        price_matches = re.findall(r'(?:AED|[\$€£])\s*[\d,]+(?:\.\d+)?', html)
        
        # Find images on this page
        imgs = []
        for img in soup.find_all("img"):
            src = img.get("src")
            alt = img.get("alt", "")
            if src and not src.startswith("data:"):
                imgs.append({"src": src, "alt": alt})

        # Find all badges / key-value specs
        # Look for tables or dl or key-value divs
        specs = {}
        for row in soup.find_all(lambda tag: tag.name in ['tr', 'li', 'div'] and ('Breed' in tag.text or 'Gender' in tag.text or 'Age' in tag.text or 'Status' in tag.text)):
            text = row.get_text(separator=" ", strip=True)
            for key in ["Breed", "Gender", "Color", "Age", "Status", "Microchip", "Vaccinations", "Pedigree", "Delivery", "Expected Adult Weight"]:
                m = re.search(rf'{key}\s*[:\-]?\s*([A-Za-z0-9\s,\.\(\)\-]+?)(?=[A-Z][a-z]+:|$|\n)', text)
                if m and key not in specs:
                    specs[key] = m.group(1).strip()

        # Description text
        # usually under an about/description section
        paragraphs = [p.get_text(strip=True) for p in soup.find_all("p") if len(p.get_text(strip=True)) > 20]

        all_puppies.append({
            "slug": slug,
            "title": title,
            "name": h1_text,
            "prices_found": list(set(price_matches)),
            "specs": specs,
            "image_count": len(imgs),
            "images": imgs,
            "paragraphs": paragraphs[:5]
        })

    with open("reference/data/all_puppies_details.json", "w", encoding="utf-8") as f:
        json.dump(all_puppies, f, indent=2)

    print("Saved all puppy details. Sample puppy:")
    if all_puppies:
        p0 = all_puppies[0]
        print(f"Slug: {p0['slug']}")
        print(f"Name: {p0['name']}")
        print(f"Prices: {p0['prices_found']}")
        print(f"Specs: {p0['specs']}")

if __name__ == "__main__":
    main()

