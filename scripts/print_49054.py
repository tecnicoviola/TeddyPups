with open('reference/js/177ya708_1zuj.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find("49054,")
print(code[idx:idx+1200])

