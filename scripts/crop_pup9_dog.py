import cv2
import os

frames = sorted(os.listdir("reference/pup9_frames"))
for i, f in enumerate(frames):
    img = cv2.imread(os.path.join("reference/pup9_frames", f))
    if img is not None:
        h, w, _ = img.shape
        # Contact mascot is under the contact form on the right: [int(h*0.5):int(h*0.9), int(w*0.5):int(w*0.8)]
        crop = img[int(h*0.5):int(h*0.9), int(w*0.5):int(w*0.8)]
        cv2.imwrite(f"reference/pup9_crops/dog_{i:02d}.jpg", crop)

print("Saved dog crops from pup9!")

