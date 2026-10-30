import cv2
import os

for vid in ['pup15', 'pup16', 'pup17']:
    out_dir = f'reference/{vid}_frames'
    os.makedirs(out_dir, exist_ok=True)
    cap = cv2.VideoCapture(rf'..\{vid}.mp4')
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    dur = total / fps
    print(f"{vid}.mp4: {total} frames, {dur:.2f}s, {fps:.2f} fps")

    for i in range(25):
        t = (i / 24) * (total - 1)
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(t))
        ret, frame = cap.read()
        if ret:
            sec = t / fps
            cv2.imwrite(f"{out_dir}/frame_{i:03d}_{sec:.2f}s.jpg", frame)
    cap.release()

print("All video frames extracted!")

