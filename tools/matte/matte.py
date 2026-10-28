"""Cut the sky out of a hero photo: soft tree edges, crisp roof, no sky spill.

usage: matte.py photo.jpg sky.npy out.png
  sky.npy  SegFormer sky probability (segment.py)
"""
import sys
import numpy as np
import cv2
from pymatting import estimate_foreground_ml

photo, sky_path, out_path = sys.argv[1:4]
season = "winter" if "winter" in photo else "autumn"

img = cv2.cvtColor(cv2.imread(photo, cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB).astype(np.float64) / 255.0
H, W = img.shape[:2]
p = np.load(sky_path).astype(np.float32)
rgb255 = img * 255
lum = rgb255.mean(-1)
blueness = cv2.medianBlur((rgb255[..., 2] - np.maximum(rgb255[..., 0], rgb255[..., 1])).astype(np.float32), 3)
chroma = rgb255[..., 2] - rgb255[..., 1]

# Building top edge measured in photo space (1932x1280), accurate to ~2 px.
ROOFLINE = np.array([
    [0, 883], [290, 883], [483, 934], [618, 870], [660, 687],
    [700, 677], [750, 671], [800, 659], [850, 653], [900, 643],
    [950, 634], [1000, 618], [1050, 588], [1100, 562], [1150, 540],
    [1200, 520], [1250, 505], [1300, 490], [1350, 475], [1400, 461],
    [1450, 449], [1500, 436], [1600, 412], [1700, 389], [1800, 368],
    [1820, 364], [1840, 360], [1860, 356], [1880, 352], [1900, 348],
    [1920, 344], [1932, 342],
], np.float64)
cols = np.arange(W)
rows = np.arange(H)[:, None].astype(np.float64)
roof = np.interp(cols, ROOFLINE[:, 0], ROOFLINE[:, 1])
ROOF_START = 690  # left of this the "roofline" is ground level, not a roof


def disk(r):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))


# --- 1. Exact roof edge, column by column ------------------------------------
def refine_edge(signal, x, seed, search):
    """Row of the strongest downward drop of `signal` near `seed` (sub-pixel)."""
    xs = slice(max(0, x - 2), min(W, x + 3))
    best, best_y = -np.inf, seed
    for y in range(int(seed) - search, int(seed) + search + 1):
        drop = signal[y - 3:y - 1, xs].mean() - signal[y + 1:y + 3, xs].mean()
        score = drop - 0.6 * abs(y - seed)
        if drop > 6 and score > best:
            best, best_y = score, y
    return best_y


edge = roof.copy()
for x in range(ROOF_START, W):
    # Sky to metal trim is a sharp chroma drop; at the far right the grey sky
    # and parapet share chroma, so the luminance drop marks the edge instead.
    signal = chroma if x < 1830 else lum
    edge[x] = refine_edge(signal, x, roof[x], 6 if x < 1830 else 5)
seg = edge[ROOF_START:].copy()
med = np.array([np.median(seg[max(0, i - 6):i + 7]) for i in range(len(seg))])
edge[ROOF_START:] = np.convolve(np.pad(med, 4, mode="edge"), np.ones(9) / 9, mode="valid")

below = np.where(cols[None, :] >= ROOF_START, rows > edge[None, :] + 1.0, rows > roof[None, :] + 12)
open_roof = np.broadcast_to((((cols >= 700) & (cols <= 1440)) | (cols >= 1830))[None, :], (H, W))

# --- 2. Regions from the segmentation ----------------------------------------
sky_seg = ((p > 0.5) & ~below).astype(np.uint8)
to_sky = cv2.distanceTransform(1 - sky_seg, cv2.DIST_L2, 5)  # foreground: distance to sky
to_fg = cv2.distanceTransform(sky_seg, cv2.DIST_L2, 5)  # sky: distance to foreground
tree = ~below & ~open_roof & (((sky_seg == 0) & (to_sky < 320)) | ((sky_seg == 1) & (to_fg < 40)))
sky_core = (sky_seg == 1) & (to_fg >= 40)

# --- 3. Trees: unmix each pixel between local sky and local foliage ----------
# The photo's HDR halo makes the sky beside the trees much lighter than open
# sky, but it stays clearly blue, while foliage, bark and snow do not.
sky_above, fg_below = (18, -8) if season == "autumn" else (30, 4)
bright_halo = (blueness > (6 if season == "autumn" else 22)) & (lum > (140 if season == "autumn" else 165))
r_, g_, b_ = rgb255[..., 0], rgb255[..., 1], rgb255[..., 2]
sky_tinted = np.zeros((H, W), bool)
if season == "autumn":
    # Nothing in an autumn canopy is neutral grey or light cyan except the
    # haze and halo seen through it.
    bright_halo |= (blueness > 0) & (lum > 95) & (np.abs(r_ - g_) < 14)
    bright_halo |= (b_ - g_ > -6) & (b_ - r_ > 25) & (lum > 110)
    # Light pixels with more blue than green are leaves mixed with sky (the
    # pink rim of the red crown): never certain foreground.
    sky_tinted = (b_ - g_ > 8) & (lum > 115)
conf_sky = (((blueness > sky_above) & (lum > 70)) | bright_halo) & tree | sky_core
conf_fg = (((blueness < fg_below) | ((lum < 60) & (blueness < sky_above))) & tree & ~conf_sky & ~sky_tinted) | below


def fill_local(mask):
    """Normalised convolution: nearest-first estimate of the colours under `mask`."""
    m = mask.astype(np.float64)
    est = np.zeros_like(img)
    done = np.zeros((H, W), bool)
    for sigma in (3, 6, 12, 24, 48, 96):
        k = int(sigma * 3) * 2 + 1
        wsum = cv2.GaussianBlur(m, (k, k), sigma)
        val = cv2.GaussianBlur(img * m[..., None], (k, k), sigma) / np.maximum(wsum, 1e-9)[..., None]
        take = ~done & (wsum > 0.12)
        est[take] = val[take]
        done |= take
    return est, done


def guided(I, p_, r, eps):
    """Grey-guide guided filter (He et al.) so alpha follows real edges."""
    box = lambda x: cv2.boxFilter(x, -1, (2 * r + 1, 2 * r + 1))
    mI, mp = box(I), box(p_)
    a = (box(I * p_) - mI * mp) / (box(I * I) - mI * mI + eps)
    b = mp - a * mI
    return box(a) * I + box(b)


B_loc, has_b = fill_local(conf_sky)
F_loc, has_f = fill_local(conf_fg)
d = F_loc - B_loc
a_tree = np.clip(((img - B_loc) * d).sum(-1) / np.maximum((d * d).sum(-1), 1e-4), 0, 1)
a_tree[~has_b] = 1.0
a_tree[~has_f] = 0.0
a_tree[conf_fg] = 1.0
a_tree[conf_sky & ((blueness > sky_above + 10) | bright_halo)] = 0.0
a_tree[sky_core] = 0.0
a_tree = cv2.medianBlur(a_tree.astype(np.float32), 3).astype(np.float64)
a_tree = np.clip(guided(img.mean(-1), a_tree, 1, 1e-4), 0, 1)
# Choke: faint residue at canopy edges is halo, not leaves.
lo, span = (0.12, 0.8) if season == "autumn" else (0.2, 0.72)
a_tree = np.clip((a_tree - lo) / span, 0, 1)
if season == "winter":
    # Real snow almost never reaches this blueness; such pixels are sky
    # blurred into twigs, which otherwise leaves a grey web between branches.
    a_tree = np.minimum(a_tree, np.clip((sky_above + 2 - blueness) / 14, 0, 1))

# --- 4. Assemble ---------------------------------------------------------------
alpha = np.ones((H, W))
alpha[sky_seg == 1] = 0.0
alpha = np.where(tree, a_tree, alpha)
roof_alpha = np.clip(rows - edge[None, :] + 0.5, 0, 1)
alpha = np.where(open_roof, np.where(sky_seg == 1, 0.0, roof_alpha), alpha)
alpha = np.where(open_roof & (rows > edge[None, :] + 1.0), 1.0, alpha)
alpha[below] = 1.0
# The warm horizon haze between the left trees cannot be told apart from the
# distant white houses, so the low strip is kept as photographed and reads as
# a lighter horizon under the dark sky.
horizon = np.clip((rows - 785) / 20, 0, 1) * (cols[None, :] < 640)
alpha = np.maximum(alpha, horizon)
alpha[alpha < 0.02] = 0.0

# --- 5. Foreground colours without the old sky mixed in ----------------------
F = np.clip(estimate_foreground_ml(img, alpha), 0, 1)

# Autumn edges take their colour from nearby foliage, so semi-transparent
# pixels never glow with the light halo they were mixed with. In winter the
# local average mixes white snow with dark bark into grey, so the solver's own
# estimate (snow white) is kept.
if season == "autumn":
    w = np.clip((alpha - 0.45) / 0.5, 0, 1)[..., None]
    F = np.where(tree[..., None] & (alpha < 1)[..., None], w * F + (1 - w) * F_loc, F)
cap = np.maximum(F[..., 0], F[..., 1]) + (0.0 if season == "autumn" else 10 / 255)
F[..., 2] = np.where(tree & (alpha < 1), np.minimum(F[..., 2], cap), F[..., 2])

# Edge burn: the photo's HDR halo also brightened the leaves along the sky,
# which reads as a pale rim on a dark sky. Fade it out over a few pixels.
clear = (alpha < 0.5).astype(np.uint8)
near = cv2.distanceTransform(1 - clear, cv2.DIST_L2, 5)
strength = 0.24 if season == "autumn" else 0.1
burn = 1 - strength * np.exp(-near / 4.0)
F = np.where((tree & (alpha > 0))[..., None], F * burn[..., None], F)

# Roof trim: remove the sky colour sampled just above the edge.
edge_px = open_roof & (alpha > 0) & (alpha < 1)
ys, xs = np.nonzero(edge_px)
for y, x in zip(ys, xs):
    yb = int(round(edge[x])) - 6
    Bc = img[yb - 1:yb + 2, x].mean(0)
    a = alpha[y, x]
    F[y, x] = np.clip((img[y, x] - (1 - a) * Bc) / a, 0, 1)

out = (np.dstack([F, alpha]) * 255 + 0.5).astype(np.uint8)
cv2.imwrite(out_path, cv2.cvtColor(out, cv2.COLOR_RGBA2BGRA))
print("done", out_path)
