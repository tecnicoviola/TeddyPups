import cv2
import os

os.makedirs("reference/pup8_crops", exist_ok=True)
os.makedirs("reference/pup9_crops", exist_ok=True)

# For pup8, let's find the mascot location
frames8 = sorted(os.listdir("reference/pup8_frames"))
for i, f in enumerate(frames8):
    img = cv2.imread(os.path.join("reference/pup8_frames", f))
    if img is not None:
        h, w, _ = img.shape
        # In pup8, where is the mascot? Let's crop middle-left or where the FAQ search is
        # Usually search is on left or top. Let's crop [100:450, 50:450]
        crop = img[int(h*0.2):int(h*0.9), int(w*0.05):int(w*0.5)]
        cv2.imwrite(f"reference/pup8_crops/crop_{i:03d}.jpg", crop)

frames9 = sorted(os.listdir("reference/pup9_frames"))
for i, f in enumerate(frames9):
    img = cv2.imread(os.path.join("reference/pup9_frames", f))
    if img is not None:
        h, w, _ = img.shape
        # In pup9, mascot is below contact form on the right: [int(h*0.4):int(h*0.95), int(w*0.4):int(w*0.8)]
        crop = img[int(h*0.4):int(h*0.95), int(w*0.35):int(w*0.85)]
        cv2.imwrite(f"reference/pup9_crops/crop_{i:03d}.jpg", crop)

print("Crops saved!")

