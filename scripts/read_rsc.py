with open('reference/rsc_decoded.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('Total lines in RSC decoded:', len(lines))
for line in lines:
    if any(k in line for k in ['article', 'StoryRibbon', 'tp-storybook', 'EnquiryForm', 'tp-paper', 'tp-letter']):
        print('-->', line[:200])

