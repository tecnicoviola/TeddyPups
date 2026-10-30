import os
import cv2

os.makedirs('reference/pup11_crops', exist_ok=True)
frames = sorted(os.listdir('reference/pup11_frames'))
for i, f in enumerate(frames):
    img = cv2.imread(os.path.join('reference/pup11_frames', f))
    if img is not None:
        h, w, _ = img.shape
        # Crop search + mascot + notes area: [h*0.15 : h*0.75, w*0.05 : w*0.5]
        crop = img[int(h*0.15):int(h*0.75), int(w*0.05):int(w*0.5)]
        cv2.imwrite(f'reference/pup11_crops/crop_{i:02d}.jpg', crop)
print('Saved pup11 crops!')

