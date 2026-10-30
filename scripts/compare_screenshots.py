from PIL import Image, ImageChops, ImageStat
import os
import json
import math

PAIRS = [
    ("Desktop (1440x900)", "reference/screenshots/original_desktop_1440x900.png", "reference/screenshots/clone_desktop_1440x900.png", "reference/screenshots/diff_desktop.png"),
    ("Laptop (1366x768)", "reference/screenshots/original_laptop_1366x768.png", "reference/screenshots/clone_laptop_1366x768.png", "reference/screenshots/diff_laptop.png"),
    ("Tablet (768x1024)", "reference/screenshots/original_tablet_768x1024.png", "reference/screenshots/clone_tablet_768x1024.png", "reference/screenshots/diff_tablet.png"),
    ("Mobile (390x844)", "reference/screenshots/original_mobile_390x844.png", "reference/screenshots/clone_mobile_390x844.png", "reference/screenshots/diff_mobile.png"),
]

def compare():
    report = []
    for label, orig_path, clone_path, diff_path in PAIRS:
        if not os.path.exists(orig_path) or not os.path.exists(clone_path):
            print(f"Skipping {label}, file missing")
            continue

        im_orig = Image.open(orig_path).convert("RGB")
        im_clone = Image.open(clone_path).convert("RGB")

        # Match sizes
        w = min(im_orig.width, im_clone.width)
        h = min(im_orig.height, im_clone.height)
        im_orig_crop = im_orig.crop((0, 0, w, h))
        im_clone_crop = im_clone.crop((0, 0, w, h))

        diff = ImageChops.difference(im_orig_crop, im_clone_crop)
        diff.save(diff_path)

        stat = ImageStat.Stat(diff)
        # Root mean square per band
        rms = math.sqrt(sum(s**2 for s in stat.mean) / len(stat.mean))

        # Count pixels with minor diff (< 15 threshold)
        diff_data = diff.getdata()
        close_pixels = sum(1 for p in diff_data if max(p) <= 15)
        total_pixels = w * h
        similarity_pct = (close_pixels / total_pixels) * 100

        res = {
            "viewport": label,
            "original_size": f"{im_orig.width}x{im_orig.height}",
            "clone_size": f"{im_clone.width}x{im_clone.height}",
            "compared_area": f"{w}x{h}",
            "rms_error": round(rms, 2),
            "similarity_percent": round(similarity_pct, 2),
            "diff_image": diff_path
        }
        report.append(res)
        print(f"[{label}] Similarity: {res['similarity_percent']}% | RMS Error: {res['rms_error']}")

    with open("reference/screenshots/comparison_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

if __name__ == "__main__":
    compare()

