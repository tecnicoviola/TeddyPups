with open('reference/js/04u0_mknmf3rz.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find("49054,")
if idx != -1:
    print(code[idx:idx+800])
else:
    print("49054 not found")

