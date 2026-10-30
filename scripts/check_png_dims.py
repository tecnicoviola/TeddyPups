import cv2

for name in ['paw.png', 'paw-press.png']:
    path = f'public/cursor/{name}'
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img is not None:
        print(f"{name}: shape = {img.shape}, dtype = {img.dtype}")
    else:
        print(f"Could not load {name}")

