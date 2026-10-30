import glob

for f in glob.glob('d:/Blu_tai/reference/**/*.js', recursive=True):
    txt = open(f, encoding='utf-8', errors='ignore').read()
    if 'Phone or WhatsApp' in txt:
        print('Found Phone or WhatsApp in:', f)
