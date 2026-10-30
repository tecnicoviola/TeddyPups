import glob

for f in glob.glob("reference/js/*.js"):
    with open(f, "r", encoding="utf-8", errors="ignore") as fh:
        code = fh.read()
    if "49054," in code:
        idx = code.find("49054,")
        print(f, code[idx:idx+500])

