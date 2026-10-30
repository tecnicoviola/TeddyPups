with open('reference/js/04u0_mknmf3rz.js', 'r', encoding='utf-8') as f:
    code = f.read()

import re
m = re.findall(r'"(M32 30\.5[^"]+)"', code)
print('Found paw paths:', len(m))
if m:
    print('Paw path:', m[0])
else:
    # search around module 49054 or 43476
    idx = code.find("PawTrailCanvas")
    print(code[idx-500:idx])

