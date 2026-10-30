import os
import cv2

os.makedirs('reference/pup12_crops', exist_ok=True)
frames = sorted(os.listdir('reference/pup12_frames'))
print('Total pup12 frames:', len(frames))

# Let's inspect frames around 0s - 7.9s
for i, f in enumerate(frames):
    img = cv2.imread(os.path.join('reference/pup12_frames', f))
    if img is not None:
        h, w, _ = img.shape
        # The form is in the center / top right
        crop = img[int(h*0.1):int(h*0.9), int(w*0.3):int(w*0.9)]
        cv2.imwrite(f'reference/pup12_crops/crop_{i:02d}.jpg', crop)

print('Saved pup12 crops!')

