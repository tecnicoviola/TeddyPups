with open('reference/js/177ya708_1zuj.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
# Let's search for 'ledgePaws' or 'tailStem'
idx_paths = c.find('ledgePaws')
print('idx_paths:', idx_paths)
# find module definition containing ledgePaws or defining 1063
# In Turbopack:
# e.s(["p",0, ...])
# Let's search for where 1063 is defined
for m in re.finditer(r'\b1063\b', c):
    print('Match at:', m.start(), c[max(0, m.start()-50):min(len(c), m.end()+50)])

# Find module that defines 1063
idx_def = [m.start() for m in re.finditer(r'\b1063\b', c)][-1]
# find function start
mod_start = c.rfind('var t=e.i(', 0, idx_def)
if mod_start == -1 or idx_def - mod_start > 20000:
    mod_start = c.rfind('e=>{', 0, idx_def)

with open('reference/module_1063_extracted.js', 'w', encoding='utf-8') as out:
    out.write(c[mod_start:idx_def+20])
print('Saved module_1063_extracted.js, size:', len(c[mod_start:idx_def+20]))
