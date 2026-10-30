from PIL import Image, ImageChops

def inspect_regions():
    im1 = Image.open("reference/screenshots/original_desktop_1440x900.png").convert("RGB")
    im2 = Image.open("reference/screenshots/clone_desktop_1440x900.png").convert("RGB")
    w = min(im1.width, im2.width)
    h = min(im1.height, im2.height)

    # Check bands:
    # 0 to 100 px (Header)
    # 100 to 400 px (Hero title & illustration)
    # 400 to 900 px (Cards)
    regions = [
        ("Header (0-100px)", 0, 100),
        ("Hero (100-400px)", 100, 400),
        ("Cards (400-900px)", 400, min(900, h))
    ]

    for label, y1, y2 in regions:
        box = (0, y1, w, y2)
        r1 = im1.crop(box)
        r2 = im2.crop(box)
        diff = ImageChops.difference(r1, r2)
        diff_data = diff.getdata()
        close = sum(1 for p in diff_data if max(p) <= 20)
        tot = (y2 - y1) * w
        print(f"{label}: {(close / tot)*100:.2f}% match")

if __name__ == "__main__":
    inspect_regions()

