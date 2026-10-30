from PIL import Image
import os

img = Image.open('reference/screenshots/original_desktop_1440x900.png')
print('Size:', img.size)

# Crop middle where cards or sections are
h = img.size[1]
w = img.size[0]

# Let's crop vertical slices to inspect
for y in range(0, min(h, 4000), 700):
    box = (0, y, w, min(h, y + 700))
    cropped = img.crop(box)
    cropped.save(f'reference/screenshots/slice_{y}.png')
    print(f'Saved slice_{y}.png')
