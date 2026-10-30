with open("src/pages/HomePage.tsx", "r", encoding="utf-8") as f:
    code = f.read()

idx = code.find("const REST_OF_PAGE_HTML = ")
if idx != -1:
    end = code.find(";\n", idx)
    raw = code[idx+len("const REST_OF_PAGE_HTML = "):end]
    print("Found length:", len(raw))
    print("Contains data-pup-stop count:", raw.count("data-pup-stop"))
    print("Contains tp-flight count:", raw.count("tp-flight"))
    print("Contains tp-chat count:", raw.count("tp-chat"))
    print("Contains tp-house count:", raw.count("tp-house"))
    print("Contains tp-dusk count:", raw.count("tp-dusk"))

