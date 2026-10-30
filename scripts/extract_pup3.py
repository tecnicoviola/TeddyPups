import cv2, os

cap = cv2.VideoCapture(r'd:\pup3.mp4')
fps = cap.get(cv2.CAP_PROP_FPS)
count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
duration = count / fps if fps > 0 else 0

print(f"Video info: {w}x{h}, {fps} fps, {count} frames, {duration:.2f} seconds")

# Save a frame every second or 0.5s to an output folder
out_dir = r'reference\pup3_frames'
os.makedirs(out_dir, exist_ok=True)

step = int(fps * 0.5) if fps > 0 else 15
frame_idx = 0
saved = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    if frame_idx % step == 0:
        cv2.imwrite(os.path.join(out_dir, f"frame_{frame_idx:04d}_{saved:02d}.jpg"), frame)
        saved += 1
    frame_idx += 1

cap.release()
print(f"Saved {saved} frames to {out_dir}")

