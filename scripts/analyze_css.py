import re
import os
import json

def analyze_css():
    css_files = ["reference/css/2gh-2btcjgkih.css", "reference/css/10jf32vdx50lp.css"]
    all_css = ""
    for cf in css_files:
        if os.path.exists(cf):
            with open(cf, "r", encoding="utf-8", errors="ignore") as f:
                all_css += f.read() + "\n"

    print("Total combined CSS length:", len(all_css))

    # Find root CSS variables
    root_vars = re.findall(r'(--[\w\-]+)\s*:\s*([^;\}]+)', all_css)
    var_dict = {}
    for k, v in root_vars:
        if k not in var_dict:
            var_dict[k] = v.strip()

    # Find font families
    font_families = set(re.findall(r'font-family\s*:\s*([^;\}]+)', all_css))

    # Find colors (hex, rgb, hsl)
    hex_colors = set(re.findall(r'#[0-9a-fA-F]{3,8}', all_css))

    # Find media queries
    media_queries = set(re.findall(r'@media[^{]+', all_css))

    analysis = {
        "variables": var_dict,
        "font_families": sorted(list(font_families)),
        "hex_colors": sorted(list(hex_colors)),
        "media_queries": sorted(list(media_queries))[:20]
    }

    with open("reference/data/css_analysis.json", "w", encoding="utf-8") as f:
        json.dump(analysis, f, indent=2)

    print(f"Extracted {len(var_dict)} CSS variables, {len(font_families)} font families, {len(hex_colors)} colors.")
    print("Sample variables:", list(var_dict.items())[:10])
    print("Font families:", font_families)

if __name__ == "__main__":
    analyze_css()

