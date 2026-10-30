import os
import cv2

frames = sorted(os.listdir('reference/pup11_frames'))
print('Total pup11 frames:', len(frames))
for f in frames[::4]:
    print(f)

