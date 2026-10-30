import os
import cv2

os.makedirs('reference/pup13_crops', exist_ok=True)
frames = sorted(os.listdir('reference/pup13_frames'))
print('Total pup13 frames:', len(frames))

# Let's crop the mascot at the bottom of the polaroids / page
for i, f in enumerate(frames):
    img = cv2.imread(os.path.join('reference/pup13_frames', f))
    if img is not None:
        h, w, _ = img.shape
        # Mascot and text are around the center/bottom
        crop = img[int(h*0.3):int(h*0.95), int(w*0.2):int(w*0.8)]
        cv2.imwrite(f'reference/pup13_crops/crop_{i:02d}.jpg', crop)

print('Saved pup13 crops!')

