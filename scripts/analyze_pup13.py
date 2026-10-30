import os
import cv2
import numpy as np

# In pup13, what happens? Let's check frames at different timestamps
# 0s, 2s, 4s, 6s, 8s, 10s
for f in sorted(os.listdir('reference/pup13_frames'))[::5]:
    print(f)

