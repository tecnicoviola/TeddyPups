import os
import re
import json
import glob
from bs4 import BeautifulSoup

def build_data():
    os.makedirs("src/data", exist_ok=True)
    html_files = sorted(glob.glob("reference/pages/puppies_*.html"))
    print(f"Found {len(html_files)} puppy pages.")

    puppies = []

    for hf in html_files:
        slug = os.path.basename(hf).replace("puppies_", "").replace(".html", "")
        with open(hf, "r", encoding="utf-8") as f:
            html = f.read()

        soup = BeautifulSoup(html, "html.parser")

        # Title
        title_el = soup.find("title")
        page_title = title_el.text.strip() if title_el else ""

        # Heading (Name)
        h1 = soup.find("h1")
        name = h1.text.strip() if h1 else slug.replace("-", " ").title()

        # Extract all image tags
        imgs = []
        for img in soup.find_all("img"):
            src = img.get("src", "")
            alt = img.get("alt", "")
            if src and "logo" not in src and "icon" not in src:
                # normalize Next image url
                m = re.search(r'url=([^&]+)', src)
                if m:
                    from urllib.parse import unquote
                    clean_src = unquote(m.group(1))
                else:
                    clean_src = src
                # check filename
                fname = os.path.basename(clean_src)
                imgs.append({
                    "src": f"/images/{fname}",
                    "alt": alt or name
                })

        # Remove duplicate image paths
        seen_img = set()
        clean_imgs = []
        for im in imgs:
            if im["src"] not in seen_img:
                seen_img.add(im["src"])
                clean_imgs.append(im)

        # Extract specs
        text_all = soup.get_text(separator="\n", strip=True)
        lines = [line.strip() for line in text_all.split("\n") if line.strip()]

        breed = ""
        gender = ""
        age = "3 months"
        color = ""
        status = "Available"
        location = "Dubai, UAE"
        price = "AED 14,000"

        # Search for price pattern
        price_m = re.search(r'AED\s*[\d,]+', text_all)
        if price_m:
            price = price_m.group(0)

        # Parse key-values
        for i, line in enumerate(lines):
            l_lower = line.lower()
            if l_lower == "breed" and i + 1 < len(lines):
                breed = lines[i+1]
            elif l_lower == "gender" and i + 1 < len(lines):
                gender = lines[i+1]
            elif l_lower == "age" and i + 1 < len(lines):
                age = lines[i+1]
            elif l_lower == "colour" or l_lower == "color" and i + 1 < len(lines):
                color = lines[i+1]
            elif l_lower == "status" and i + 1 < len(lines):
                status = lines[i+1]
            elif l_lower == "where" and i + 1 < len(lines):
                location = lines[i+1]

        if not breed:
            if "pomeranian" in slug:
                breed = "Pomeranian"
            elif "maltipoo" in slug:
                breed = "Maltipoo"
            elif "poodle" in slug:
                breed = "Toy Poodle"
            elif "shitzu" in slug or "shih" in slug:
                breed = "Shih Tzu"
            else:
                breed = "Puppy"

        if not gender:
            if "female" in slug or "girl" in slug:
                gender = "Girl"
            elif "male" in slug or "boy" in slug:
                gender = "Boy"
            else:
                gender = "Boy or Girl"

        if not color:
            if "blue-marle" in slug or "marble" in slug:
                color = "Blue Marble"
            elif "copper" in slug:
                color = "Copper"
            elif "cream" in slug:
                color = "Cream"
            elif "white" in slug:
                color = "White"
            elif "red" in slug:
                color = "Red"
            elif "caramel" in slug:
                color = "Caramel"
            elif "apricot" in slug:
                color = "Apricot"
            else:
                color = "Natural"

        # Description paragraphs
        desc_p = []
        for p in soup.find_all("p"):
            p_text = p.get_text(strip=True)
            if len(p_text) > 30 and "cookie" not in p_text.lower() and "rights reserved" not in p_text.lower():
                desc_p.append(p_text)

        puppies.append({
            "slug": slug,
            "name": name,
            "title": page_title,
            "breed": breed,
            "gender": gender,
            "age": age,
            "color": color,
            "status": status,
            "location": location,
            "price": price,
            "images": clean_imgs if clean_imgs else [{"src": "/brand/logo.png", "alt": name}],
            "description": desc_p[:3]
        })

    # Write TypeScript file
    ts_content = "export interface Puppy {\n" \
                 "  slug: string;\n" \
                 "  name: string;\n" \
                 "  title: string;\n" \
                 "  breed: string;\n" \
                 "  gender: string;\n" \
                 "  age: string;\n" \
                 "  color: string;\n" \
                 "  status: string;\n" \
                 "  location: string;\n" \
                 "  price: string;\n" \
                 "  images: { src: string; alt: string }[];\n" \
                 "  description: string[];\n" \
                 "}\n\n" \
                 f"export const PUPPIES: Puppy[] = {json.dumps(puppies, indent=2)};\n"

    with open("src/data/puppiesData.ts", "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Generated src/data/puppiesData.ts with {len(puppies)} puppies!")

if __name__ == "__main__":
    build_data()

