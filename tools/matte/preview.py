"""Composite a matte over a dark backdrop and save inspection crops.

usage: preview.py cutout.png prefix
"""
import sys
import numpy as np
import cv2

src, prefix = sys.argv[1:3]
rgba = cv2.cvtColor(cv2.imread(src, cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA).astype(np.float64) / 255
H, W = rgba.shape[:2]

# Dark navy gradient with faint diagonal lines, close to the site backdrop.
y = np.linspace(0, 1, H)[:, None, None]
bg = (1 - y) * np.array([8, 14, 26]) / 255 + y * np.array([18, 30, 48]) / 255
bg = np.broadcast_to(bg, (H, W, 3)).copy()
yy, xx = np.mgrid[0:H, 0:W]
lines = (np.sin((yy + 0.25 * xx + 40 * np.sin(xx / 260)) / 9) > 0.985)
bg[lines] += 0.05

a = rgba[..., 3:4]
comp = rgba[..., :3] * a + bg * (1 - a)
out = (comp * 255).clip(0, 255).astype(np.uint8)
cv2.imwrite(prefix + "-full.jpg", cv2.cvtColor(cv2.resize(out, (1440, round(1440 * H / W)), interpolation=cv2.INTER_AREA), cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 88])

CROPS = {
    "lefttree": (0, 250, 460, 560),
    "redtree": (330, 540, 720, 880),
    "gap": (120, 640, 470, 920),
    "righttree": (1380, 270, 1932, 500),
    "roof": (640, 560, 1120, 720),
    "farright": (1740, 300, 1932, 430),
}
for name, (x0, y0, x1, y1) in CROPS.items():
    crop = out[y0:y1, x0:x1]
    scale = 2 if (x1 - x0) < 500 else 1.5
    crop = cv2.resize(crop, None, fx=scale, fy=scale, interpolation=cv2.INTER_NEAREST)
    cv2.imwrite(f"{prefix}-{name}.jpg", cv2.cvtColor(crop, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 92])
