import cv2
import os

def extract(video_path, out_dir, max_frames=45):
    os.makedirs(out_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Failed to open {video_path}")
        return
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps if fps > 0 else 0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print(f"\n--- {video_path} ---: {w}x{h}, {fps:.2f}fps, {total_frames} frames, {duration:.2f}s")
    
    step = max(1, total_frames // max_frames)
    frame_idx = 0
    saved = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % step == 0 and saved < max_frames:
            ts = frame_idx / fps if fps > 0 else 0
            cv2.imwrite(os.path.join(out_dir, f"frame_{saved:03d}_{ts:.2f}s.jpg"), frame)
            saved += 1
        frame_idx += 1
    cap.release()
    print(f"Saved {saved} frames to {out_dir}")

extract("d:/pup11.mp4", "reference/pup11_frames", 40)
extract("d:/pup12.mp4", "reference/pup12_frames", 50)
extract("d:/pup13.mp4", "reference/pup13_frames", 50)

