import glob
frames = sorted(glob.glob('d:/Blu_tai/reference/pup16_frames/*.jpg'))
for i, f in enumerate(frames):
    print(f'Frame {i}: {f}')

