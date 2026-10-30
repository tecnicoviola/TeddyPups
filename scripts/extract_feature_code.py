import re

def extract_paw_trail():
    with open("reference/js/04u0_mknmf3rz.js", "r", encoding="utf-8") as f:
        code = f.read()

    pos = code.find("PawTrailCanvas")
    print("PawTrailCanvas pos:", pos)
    if pos != -1:
        # extract around 4000 characters
        snippet = code[pos:pos+4000]
        with open("reference/paw_trail_code.js", "w", encoding="utf-8") as out:
            out.write(snippet)
        print("Saved reference/paw_trail_code.js")

def extract_hero():
    with open("reference/js/1wa3jfz4v5w2v.js", "r", encoding="utf-8") as f:
        code = f.read()

    # Search for hero or arch
    for m in re.finditer(r'tp-hero|tp-parade|pup-actor|arch', code):
        pos = m.start()
        print(f"Hero match '{m.group(0)}' at {pos}")
        snippet = code[max(0, pos-200):min(len(code), pos+2000)]
        with open(f"reference/hero_snippet_{m.group(0)}.js", "w", encoding="utf-8") as out:
            out.write(snippet)
        break

def extract_teddy_puppet():
    with open("reference/js/177ya708_1zuj.js", "r", encoding="utf-8") as f:
        code = f.read()

    pos = code.find("class{svg;els;written;pose;target;m;facing")
    if pos != -1:
        snippet = code[pos:pos+8000]
        with open("reference/teddy_puppet_class.js", "w", encoding="utf-8") as out:
            out.write(snippet)
        print("Saved reference/teddy_puppet_class.js")

if __name__ == "__main__":
    extract_paw_trail()
    extract_hero()
    extract_teddy_puppet()

