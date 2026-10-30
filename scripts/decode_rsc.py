import re
import json

def decode_rsc():
    with open("reference/pages/puppies_maltipoo-max-male.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Find all self.__next_f.push calls
    chunks = re.findall(r'self\.__next_f\.push\(\[(\d+),"(.*?)"\]\)', html, re.DOTALL)
    print("Found next_f chunks:", len(chunks))
    
    full_str = ""
    for idx, c in chunks:
        # unescape json string
        c_unescaped = c.encode().decode('unicode_escape')
        full_str += c_unescaped + "\n"

    with open("reference/rsc_decoded.txt", "w", encoding="utf-8") as out:
        out.write(full_str)

    print("Decoded RSC stream to reference/rsc_decoded.txt, size:", len(full_str))

if __name__ == "__main__":
    decode_rsc()

