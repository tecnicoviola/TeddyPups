import os

frames = sorted(os.listdir("reference/pup8_frames"))
print(f"Total pup8 frames: {len(frames)}")
for f in frames[:15]:
    print(f)
print("...")
for f in frames[-15:]:
    print(f)

