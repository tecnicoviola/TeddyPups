import cv2
import os

def extract_video_info_and_frames(video_path, out_dir, max_frames=30):
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
    print(f"\n--- {video_path} ---")
    print(f"Resolution: {w}x{h}, FPS: {fps:.2f}, Total frames: {total_frames}, Duration: {duration:.2f}s")
    
    step = max(1, total_frames // max_frames)
    frame_idx = 0
    saved_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % step == 0 and saved_count < max_frames:
            timestamp = frame_idx / fps if fps > 0 else 0
            out_name = os.path.join(out_dir, f"frame_{saved_count:03d}_{timestamp:.2f}s.jpg")
            cv2.imwrite(out_name, frame)
            saved_count += 1
        frame_idx += 1
    cap.release()
    print(f"Saved {saved_count} frames to {out_dir}")

if __name__ == "__main__":
    extract_video_info_and_frames("d:/pup8.mp4", "reference/pup8_frames", max_frames=40)
    extract_video_info_and_frames("d:/pup9.mp4", "reference/pup9_frames", max_frames=30)

