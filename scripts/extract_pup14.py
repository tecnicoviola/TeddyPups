import cv2
import os

os.makedirs('reference/pup14_frames', exist_ok=True)
cap = cv2.VideoCapture(r'..\pup14.mp4')
fps = cap.get(cv2.CAP_PROP_FPS) or 30
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
dur = total / fps
print(f"pup14.mp4: {total} frames, {dur:.2f}s, {fps:.2f} fps")

# Extract 40 evenly spaced frames
for i in range(40):
    t = (i / 39) * (total - 1)
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(t))
    ret, frame = cap.read()
    if ret:
        sec = t / fps
        out_name = f"reference/pup14_frames/frame_{i:03d}_{sec:.2f}s.jpg"
        cv2.imwrite(out_name, frame)

cap.release()
print("pup14.mp4 frames extracted!")

