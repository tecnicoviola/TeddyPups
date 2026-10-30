import os
from PIL import Image, ImageDraw

def create_paw_press_png():
    # 32x32 image with high precision
    scale = 4
    size = 32 * scale
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # Rounded rectangle coordinates
    pad = 4 * scale
    rect = [pad, pad, size - pad, size - pad]
    radius = 6 * scale

    # Draw soft shadow
    shadow_pad = 3 * scale
    shadow_rect = [pad, pad + 2 * scale, size - pad, size - pad + 2 * scale]
    draw.rounded_rectangle(shadow_rect, radius=radius, fill=(42, 23, 14, 40))

    # Draw white rounded square
    draw.rounded_rectangle(rect, radius=radius, fill=(255, 255, 255, 255), outline=(42, 23, 14, 255), width=max(1, int(1.8 * scale)))

    # Draw black paw print inside
    # Center is size / 2, size / 2
    cx, cy = size / 2, size / 2 + 1 * scale
    
    # Main pad (round bottom, arched top)
    pad_w = 9 * scale
    pad_h = 7 * scale
    draw.ellipse([cx - pad_w, cy - pad_h * 0.4, cx + pad_w, cy + pad_h * 1.2], fill=(42, 23, 14, 255))
    
    # 4 Toe pads
    toes = [
        (-6.5 * scale, -4.5 * scale, 3.2 * scale, 4.2 * scale),
        (-2.2 * scale, -7.2 * scale, 3.2 * scale, 4.4 * scale),
        (2.2 * scale, -7.2 * scale, 3.2 * scale, 4.4 * scale),
        (6.5 * scale, -4.5 * scale, 3.2 * scale, 4.2 * scale),
    ]
    for tx, ty, tw, th in toes:
        draw.ellipse([cx + tx - tw, cy + ty - th, cx + tx + tw, cy + ty + th], fill=(42, 23, 14, 255))

    # Resize down with Lanczos anti-aliasing
    final_im = im.resize((32, 32), Image.Resampling.LANCZOS)
    out_path = os.path.join('public', 'cursor', 'paw-press.png')
    final_im.save(out_path, 'PNG')
    print('Generated', out_path)

if __name__ == '__main__':
    create_paw_press_png()

