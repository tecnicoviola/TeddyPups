import cv2
import os

frames = sorted(os.listdir('reference/pup14_frames'))

for f in frames:
    img = cv2.imread(f'reference/pup14_frames/{f}')
    # Check if frame has video element or play button
    # Let's inspect last 10 frames
    pass

print("Inspecting frame 35-39...")
for idx in range(30, 40):
    f = frames[idx]
    img = cv2.imread(f'reference/pup14_frames/{f}')
    # Save a small preview
    cv2.imwrite(f'reference/pup14_preview_{idx}.jpg', cv2.resize(img, (480, 270)))

print("Saved previews!")

