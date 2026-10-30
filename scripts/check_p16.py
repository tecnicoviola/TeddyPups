import cv2
import os

frames = sorted(os.listdir('reference/pup16_frames'))
print("pup16 frames count:", len(frames))
for f in frames[15:25]:
    print(f)

