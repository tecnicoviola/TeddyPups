# Let's inspect some frames from pup8
import cv2
import os

for idx in [0, 5, 10, 15, 20, 25, 30, 35]:
    fn = f"reference/pup8_crops/dog_{idx:02d}.jpg"
    if os.path.exists(fn):
        print(f"Frame {idx} exists")

