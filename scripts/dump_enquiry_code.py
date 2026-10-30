txt = open('d:/Blu_tai/reference/js/1y11gwrsbuw85.js', encoding='utf-8', errors='ignore').read()
idx = txt.find('Phone or WhatsApp')
snippet = txt[max(0, idx-2000):min(len(txt), idx+3000)]

with open('d:/Blu_tai/reference/original_enquiry_code.js', 'w', encoding='utf-8') as f:
    f.write(snippet)

print('Wrote original_enquiry_code.js, length:', len(snippet))
