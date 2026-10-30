import cv2
import numpy as np
import os

frames = sorted(os.listdir("reference/pup8_frames"))
for i, f in enumerate(frames):
    img = cv2.imread(os.path.join("reference/pup8_frames", f))
    if img is not None:
        # Mascot is located on the left side under the search input
        # Let's crop around [h*0.35 : h*0.65, w*0.12 : w*0.35]
        h, w, _ = img.shape
        crop = img[int(h*0.35):int(h*0.65), int(w*0.12):int(w*0.35)]
        cv2.imwrite(f"reference/pup8_crops/dog_{i:02d}.jpg", crop)

print("Saved dog crops from pup8!")

