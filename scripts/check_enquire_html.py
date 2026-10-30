txt = open('d:/Blu_tai/reference/pages/puppies_korean-teacup-maltipoo-female.html', encoding='utf-8', errors='ignore').read()
idx = txt.find('id="enquire-')
print('Enquiry section html:')
print(txt[idx:idx+2500])
