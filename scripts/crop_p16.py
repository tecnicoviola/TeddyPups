import cv2

img = cv2.imread('reference/pup16_frames/frame_022_7.29s.jpg')
h, w, _ = img.shape
# Crop the middle/bottom where form is
crop = img[int(h*0.3):int(h*0.9), int(w*0.3):int(w*0.9)]
cv2.imwrite('reference/pup16_crop_sent.jpg', crop)
print(f"Original shape: {img.shape}, saved crop: reference/pup16_crop_sent.jpg")

