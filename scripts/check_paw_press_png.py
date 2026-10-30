import cv2, numpy as np

img = cv2.imread('public/cursor/paw-press.png', cv2.IMREAD_UNCHANGED)
print("paw-press.png alpha min/max:", np.min(img[:,:,3]), np.max(img[:,:,3]))
# Find bounding box of non-zero alpha
alphas = img[:,:,3]
y_indices, x_indices = np.where(alphas > 0)
print(f"Bounding box: x [{np.min(x_indices)}, {np.max(x_indices)}], y [{np.min(y_indices)}, {np.max(y_indices)}]")

