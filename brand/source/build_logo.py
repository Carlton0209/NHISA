"""NHISA logo kit, direction C (Ring by Ring). Every shape is a filled outline; no strokes, no live text.

Writes the master SVGs into <out>/logo. Usage: python kit.py <out-dir>
"""
import math
import os
import sys

OUT = sys.argv[1] if len(sys.argv) > 1 else 'kit'
LOGO = os.path.join(OUT, 'logo')
os.makedirs(LOGO, exist_ok=True)

NAVY, PERI = '#232860', '#7C86F5'            # on light grounds
PAPER, PERI_TINT = '#F4F5FB', '#AAB3FF'      # on dark grounds
LIGHT = {'past': NAVY, 'ours': PERI, 'type': NAVY}
DARK = {'past': PAPER, 'ours': PERI_TINT, 'type': PAPER}


def f(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return '0' if s == '-0' else s


def pt(x, y):
    return f'{f(x)} {f(y)}'


def poly(points, dx=0.0, dy=0.0, k=1.0):
    return 'M' + ' L'.join(pt(x * k + dx, y * k + dy) for x, y in points) + ' Z'


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" width="{f(w)}" height="{f(h)}" '
            f'role="img" aria-labelledby="title"><title id="title">{title}</title>{body}</svg>\n')


def save(name, content):
    with open(os.path.join(LOGO, name), 'w', encoding='utf-8') as fh:
        fh.write(content)


# ---------------------------------------------------------------- symbol

def arch(cx, base, spring, r, w, open_deg=None):
    """One arch as a filled band: two legs on the base line and a half ring between them.
    With open_deg the right side is left unbuilt and the band ends in a round cap at that angle."""
    ro, ri = r + w / 2, r - w / 2
    head = f'M{pt(cx - ro, base)} V{f(spring)} A{f(ro)} {f(ro)} 0 0 1 '
    if open_deg is None:
        return (head + f'{pt(cx + ro, spring)} V{f(base)} H{f(cx + ri)} V{f(spring)} '
                f'A{f(ri)} {f(ri)} 0 0 0 {pt(cx - ri, spring)} V{f(base)} Z')
    t = math.radians(open_deg)
    po = (cx + ro * math.cos(t), spring - ro * math.sin(t))
    pi = (cx + ri * math.cos(t), spring - ri * math.sin(t))
    return (head + f'{pt(*po)} A{f(w / 2)} {f(w / 2)} 0 0 1 {pt(*pi)} '
            f'A{f(ri)} {f(ri)} 0 0 0 {pt(cx - ri, spring)} V{f(base)} Z')


# Full drawing: three rings on a 256 canvas. Small cut: two heavier rings for 16-32 px.
FULL = dict(cx=132, base=224, legs=80, radii=(30, 68, 106), w=22, open_deg=30)
SMALL = dict(cx=132, base=236, legs=96, radii=(40, 102), w=36, open_deg=30)
THIN = 0.965   # reversed artwork is thinned ~3.5 %, light on dark reads heavier


def symbol_paths(spec, colors, x=0.0, y=0.0, k=1.0, reversed_=False):
    w = spec['w'] * (THIN if reversed_ else 1)
    cx, base = x + spec['cx'] * k, y + spec['base'] * k
    spring = base - spec['legs'] * k
    *past, ours = spec['radii']
    d_past = ' '.join(arch(cx, base, spring, r * k, w * k) for r in past)
    d_ours = arch(cx, base, spring, ours * k, w * k, spec['open_deg'])
    return f'<path fill="{colors["past"]}" d="{d_past}"/><path fill="{colors["ours"]}" d="{d_ours}"/>'


def symbol_box(spec):
    """Visual bounds of the symbol in its own units: left, top, right, bottom."""
    *_, ours = spec['radii']
    half = spec['w'] / 2
    spring = spec['base'] - spec['legs']
    t = math.radians(spec['open_deg'])
    right_inner = spec['cx'] + spec['radii'][-2] + half
    right_cap = spec['cx'] + ours * math.cos(t) + half
    return (spec['cx'] - ours - half, spring - ours - half, max(right_inner, right_cap), spec['base'])


# ---------------------------------------------------------------- letters
# Geometric caps drawn as outlines. cap = cap height, s = stem, h = horizontal stroke (a little thinner).

def n_letter(cap, s, slant=30):
    # the diagonal runs at exactly 30 degrees off vertical and is as heavy as a stem across its slope
    theta = math.radians(slant)
    hw = s / math.cos(theta)
    t = math.tan(theta)
    width = cap * t + hw
    rs = width - s
    pts = [(0, 0), (hw, 0), (rs, (rs - hw) / t), (rs, 0), (width, 0), (width, cap), (width - hw, cap),
           (s, s / t), (s, cap), (0, cap)]
    return [('nonzero', poly(pts))], width


def h_letter(cap, s, h, width):
    b0 = cap * 0.4
    pts = [(0, 0), (s, 0), (s, b0), (width - s, b0), (width - s, 0), (width, 0), (width, cap), (width - s, cap),
           (width - s, b0 + h), (s, b0 + h), (s, cap), (0, cap)]
    return [('nonzero', poly(pts))], width


def i_letter(cap, s):
    return [('nonzero', poly([(0, 0), (s, 0), (s, cap), (0, cap)]))], s


def a_letter(cap, s, h, width):
    hw = s
    for _ in range(20):
        dx = width / 2 - hw / 2
        theta = math.atan(dx / cap)
        hw = s / math.cos(theta)
    t = math.tan(theta)
    cx, half = width / 2, hw / 2
    li = lambda y: cx - half + hw - t * y
    ri = lambda y: cx + half - hw + t * y
    apex = ((cx - half + hw) - (cx + half - hw)) / (2 * t)
    b1 = cap * 0.8
    b0 = b1 - h
    outer = [(cx - half, 0), (cx + half, 0), (width, cap), (width - hw, cap), (ri(b1), b1), (li(b1), b1), (hw, cap), (0, cap)]
    hole = [(cx, apex), (ri(b0), b0), (li(b0), b0)]
    return [('evenodd', poly(outer) + ' ' + poly(hole))], width


def e_letter(cap, s, h, width):
    mid = cap * 0.45 - h / 2
    pts = [(0, 0), (width, 0), (width, h), (s, h), (s, mid), (width * 0.9, mid), (width * 0.9, mid + h), (s, mid + h),
           (s, cap - h), (width, cap - h), (width, cap), (0, cap)]
    return [('nonzero', poly(pts))], width


def t_letter(cap, s, h, width):
    x0 = (width - s) / 2
    pts = [(0, 0), (width, 0), (width, h), (x0 + s, h), (x0 + s, cap), (x0, cap), (x0, h), (0, h)]
    return [('nonzero', poly(pts))], width


def l_letter(cap, s, h, width):
    pts = [(0, 0), (s, 0), (s, cap - h), (width, cap - h), (width, cap), (0, cap)]
    return [('nonzero', poly(pts))], width


def w_letter(cap, s, width, over=2.0):
    q = width / 4
    hw = s
    for _ in range(20):
        theta = math.atan((q - hw / 2) / cap)
        hw = s / math.cos(theta)
    half = hw / 2
    y1 = cap + over
    # four strokes, all wound the same way so they unite under nonzero
    strokes = [
        [(0, 0), (hw, 0), (q + half, y1), (q - half, y1)],
        [(2 * q - half, 0), (2 * q + half, 0), (q + half, y1), (q - half, y1)],
        [(2 * q - half, 0), (2 * q + half, 0), (3 * q + half, y1), (3 * q - half, y1)],
        [(width - hw, 0), (width, 0), (3 * q + half, y1), (3 * q - half, y1)],
    ]
    fixed = []
    for p in strokes:
        # make every quad clockwise on screen
        area = sum(x0 * y1_ - x1_ * y0 for (x0, y0), (x1_, y1_) in zip(p, p[1:] + p[:1]))
        fixed.append(p if area > 0 else p[::-1])
    return [('nonzero', ' '.join(poly(p) for p in fixed))], width


def ellipse_pt(cx, cy, rx, ry, deg):
    t = math.radians(deg)
    return cx + rx * math.cos(t), cy - ry * math.sin(t)


def o_letter(cap, s, h, over=2.0):
    r = cap / 2 + over
    cx, cy = r, cap / 2
    outer = f'M{pt(cx, cy - r)} A{f(r)} {f(r)} 0 1 1 {pt(cx, cy + r)} A{f(r)} {f(r)} 0 1 1 {pt(cx, cy - r)} Z'
    ix, iy = r - s, r - h
    inner = f'M{pt(cx, cy - iy)} A{f(ix)} {f(iy)} 0 1 0 {pt(cx, cy + iy)} A{f(ix)} {f(iy)} 0 1 0 {pt(cx, cy - iy)} Z'
    return [('evenodd', outer + ' ' + inner)], 2 * r


def c_letter(cap, s, h, over=2.0, gap_deg=42):
    r = cap / 2 + over
    cx, cy = r, cap / 2
    ix, iy = r - s, r - h
    a0, a1 = gap_deg, 360 - gap_deg
    po0, po1 = ellipse_pt(cx, cy, r, r, a0), ellipse_pt(cx, cy, r, r, a1)
    pi0, pi1 = ellipse_pt(cx, cy, ix, iy, a0), ellipse_pt(cx, cy, ix, iy, a1)
    d = (f'M{pt(*po0)} A{f(r)} {f(r)} 0 1 0 {pt(*po1)} L{pt(*pi1)} '
         f'A{f(ix)} {f(iy)} 0 1 1 {pt(*pi0)} Z')
    width = cx + r * math.cos(math.radians(a0))
    return [('nonzero', d)], width


def d_letter(cap, s, h, width, over=2.0):
    r = cap / 2
    xs = width - r - over
    outer = f'M0 0 H{f(xs)} A{f(r + over)} {f(r)} 0 0 1 {pt(xs, cap)} H0 Z'
    inner = f'M{pt(s, h)} H{f(xs)} A{f(r + over - s)} {f(r - h)} 0 0 1 {pt(xs, cap - h)} H{f(s)} Z'
    return [('evenodd', outer + ' ' + inner)], width


def u_letter(cap, s, h, width, over=2.0):
    r = width / 2
    y = cap - r
    d = (f'M0 0 H{f(s)} V{f(y)} A{f(r - s)} {f(r - h + over)} 0 0 0 {pt(width - s, y)} V0 H{f(width)} V{f(y)} '
         f'A{f(r)} {f(r + over)} 0 0 1 {pt(0, y)} Z')
    return [('nonzero', d)], width


def r_letter(cap, s, h, width):
    bowl_h = cap * 0.54
    rb = bowl_h / 2
    xs = width * 0.88 - rb
    stem = [(0, 0), (s, 0), (s, cap), (0, cap)]
    outer = f'M0 0 H{f(xs)} A{f(rb)} {f(rb)} 0 0 1 {pt(xs, bowl_h)} H0 Z'
    inner = f'M{pt(s, h)} V{f(bowl_h - h)} H{f(xs)} A{f(rb - s)} {f(rb - h)} 0 0 0 {pt(xs, h)} Z'
    # leg from the bowl's lower joint to the foot
    hw = s * 1.15
    x0 = xs - s * 0.2
    leg = [(x0, bowl_h - h), (x0 + hw, bowl_h - h), (width, cap), (width - hw, cap)]
    return [('nonzero', poly(stem) + ' ' + outer + ' ' + inner + ' ' + poly(leg))], width


def s_letter(cap, s, h, over=2.0, squash=1.0):
    """S from two stacked ellipses, outlined. Horizontals (h) are a little thinner than the sides (s)."""
    a_off, b_off = s / 2, h / 2
    total = cap + 2 * over - 2 * b_off          # centreline height
    ryt = total * 0.48 / 2
    ryb = total * 0.52 / 2
    rxt = ryt * 1.22 * squash
    rxb = ryb * 1.24 * squash
    cx = rxb + a_off
    top = -over + b_off
    cyt = top + ryt
    j = cyt + ryt
    cyb = j + ryb
    e = lambda cy, rx, ry, deg: ellipse_pt(cx, cy, rx, ry, deg)
    to, ti = e(cyt, rxt + a_off, ryt + b_off, 32), e(cyt, rxt - a_off, ryt - b_off, 32)
    bo, bi = e(cyb, rxb + a_off, ryb + b_off, -148), e(cyb, rxb - a_off, ryb - b_off, -148)
    d = (f'M{pt(*to)} A{f(rxt + a_off)} {f(ryt + b_off)} 0 1 0 {pt(cx, j + b_off)} '
         f'A{f(rxb - a_off)} {f(ryb - b_off)} 0 1 1 {pt(*bi)} L{pt(*bo)} '
         f'A{f(rxb + a_off)} {f(ryb + b_off)} 0 1 0 {pt(cx, j - b_off)} '
         f'A{f(rxt - a_off)} {f(ryt - b_off)} 0 1 1 {pt(*ti)} Z')
    return [('nonzero', d)], 2 * cx


# ---------------------------------------------------------------- words

def glyph(ch, cap, s, h):
    o = cap * 0.017          # overshoot for round letters, ~1.7 % of the cap height
    return {
        'N': lambda: n_letter(cap, s),
        'H': lambda: h_letter(cap, s, h, cap * 0.77),
        'I': lambda: i_letter(cap, s),
        'A': lambda: a_letter(cap, s, h, cap * 0.92),
        'S': lambda: s_letter(cap, s, h, o),
        'E': lambda: e_letter(cap, s, h, cap * 0.56),
        'T': lambda: t_letter(cap, s, h, cap * 0.62),
        'L': lambda: l_letter(cap, s, h, cap * 0.5),
        'W': lambda: w_letter(cap, s, cap * 1.06, 0),
        'O': lambda: o_letter(cap, s, h, o),
        'C': lambda: c_letter(cap, s, h, o),
        'D': lambda: d_letter(cap, s, h, cap * 0.8, o),
        'U': lambda: u_letter(cap, s, h, cap * 0.72, o),
        'R': lambda: r_letter(cap, s, h, cap * 0.68),
    }[ch]()


ROUND, SLANT = set('OCSDU'), set('AW')


def gap_after(a, b, base):
    g = base
    if a in SLANT or b in SLANT:
        g -= base * 0.4
    if a in ROUND or b in ROUND:
        g -= base * 0.2
    if a == 'T' or b == 'T':
        g -= base * 0.3
    return g


def word(text, x0, y0, cap, s, h, color, track, space, pairs=None):
    """Lay out text with cap top at (x0, y0). Returns (svg, width)."""
    pieces, x, prev = [], x0, None
    for ch in text:
        if ch == ' ':
            x += space
            prev = None
            continue
        if prev:
            x += (pairs or {}).get(prev + ch, gap_after(prev, ch, track))
        shapes, w = glyph(ch, cap, s, h)
        for rule, d in shapes:
            pieces.append(f'<path fill="{color}"{" fill-rule=\"evenodd\"" if rule == "evenodd" else ""} '
                          f'transform="translate({f(x)} {f(y0)})" d="{d}"/>')
        x += w
        prev = ch
    return ''.join(pieces), x - x0


# The wordmark: cap 120, stems 22, horizontals 19; spacing set by eye.
WM = dict(cap=120.0, s=22.0, h=19.0)
WM_PAIRS = {'NH': 28, 'HI': 28, 'IS': 24, 'SA': 12}


def wordmark(x0, y0, k, color, thin=1.0):
    return word('NHISA', x0, y0, WM['cap'] * k, WM['s'] * k * thin, WM['h'] * k * thin, color, 0, 0,
                {p: v * k for p, v in WM_PAIRS.items()})


DESC = dict(s_ratio=0.135, h_ratio=0.12, track=0.30, space=0.62)


def descriptor(text, x0, y0, cap, color, thin=1.0):
    return word(text, x0, y0, cap, cap * DESC['s_ratio'] * thin, cap * DESC['h_ratio'] * thin, color,
                cap * DESC['track'], cap * DESC['space'])


# ---------------------------------------------------------------- lockups

def build(colors, rev, tag):
    thin = THIN if rev else 1.0
    L, T, R, B = symbol_box(FULL)
    sym_w, sym_h = R - L, B - T
    smallest = (FULL['radii'][0] + FULL['w'] / 2) * 2           # width of the smallest arch

    # symbol only
    save(f'nhisa-symbol{tag}.svg', svg(256, 256, symbol_paths(FULL, colors, reversed_=rev), 'NHISA symbol'))
    save(f'nhisa-symbol-small{tag}.svg', svg(256, 256, symbol_paths(SMALL, colors, reversed_=rev), 'NHISA symbol, small sizes'))

    # wordmark only
    pad = 24
    wm, wm_w = wordmark(pad, 68, 1.0, colors['type'], thin)
    save(f'nhisa-wordmark{tag}.svg', svg(round(wm_w + 2 * pad), 256, wm, 'NHISA wordmark'))

    # horizontal: the arch stands on the wordmark's base line, 1.5 x cap height tall
    cap = 84.0
    k_sym = cap * 1.5 / sym_h
    k_wm = cap / WM['cap']
    gap = smallest * k_sym * 0.62
    baseline = 128 + cap * 1.5 / 2
    sx = pad - L * k_sym
    sy = baseline - B * k_sym
    sym = symbol_paths(FULL, colors, sx, sy, k_sym, rev)
    wm, wm_w = wordmark(pad + sym_w * k_sym + gap, baseline - cap, k_wm, colors['type'], thin)
    width = round(pad + sym_w * k_sym + gap + wm_w + pad)
    save(f'nhisa-horizontal{tag}.svg', svg(width, 256, sym + wm, 'NHISA logo'))

    # stacked: symbol centred over the wordmark
    cap_s = 72.0
    k_wm = cap_s / WM['cap']
    _, wm_w = wordmark(0, 0, k_wm, colors['type'], thin)
    k_sym = 168 / sym_h
    gap_s = smallest * k_sym * 0.55
    width = round(max(wm_w, sym_w * k_sym) + 2 * pad)
    height = round(pad + 168 + gap_s + cap_s + pad)
    sx = width / 2 - (L + sym_w / 2) * k_sym
    sym = symbol_paths(FULL, colors, sx, pad - T * k_sym, k_sym, rev)
    wm, _ = wordmark((width - wm_w) / 2, pad + 168 + gap_s, k_wm, colors['type'], thin)
    save(f'nhisa-stacked{tag}.svg', svg(width, height, sym + wm, 'NHISA logo, stacked'))

    # full name: symbol | NHISA over the name in two lines
    cap = 84.0
    d_cap = 15.0
    line_gap = d_cap * 0.85
    first_gap = cap * 0.34
    block_h = cap + first_gap + d_cap + line_gap + d_cap
    k_sym = block_h / sym_h
    top = 128 - block_h / 2
    sx = pad - L * k_sym
    sym = symbol_paths(FULL, colors, sx, top - T * k_sym, k_sym, rev)
    tx = pad + sym_w * k_sym + smallest * k_sym * 0.62
    wm, wm_w = wordmark(tx, top, cap / WM['cap'], colors['type'], thin)
    l1, w1 = descriptor('NEWHOUSE INTERNATIONAL', tx + 2, top + cap + first_gap, d_cap, colors['type'], thin)
    l2, w2 = descriptor('STUDENT ASSOCIATION', tx + 2, top + cap + first_gap + d_cap + line_gap, d_cap, colors['type'], thin)
    width = round(tx + max(wm_w, w1 + 2, w2 + 2) + pad)
    save(f'nhisa-full-name{tag}.svg', svg(width, 256, sym + wm + l1 + l2, 'NHISA, Newhouse International Student Association'))


if __name__ == '__main__':
    build(LIGHT, False, '')
    build(DARK, True, '-reversed')
    print('wrote', len(os.listdir(LOGO)), 'files to', LOGO)


def favicon_tile(path):
    """Tab and app icon: the small cut, light on a Newhouse-night tile, so it reads on light and dark tab bars."""
    L, T, R, B = symbol_box(SMALL)
    k = 196 / max(R - L, B - T)
    x = 128 - (L + (R - L) / 2) * k
    y = 128 - (T + (B - T) / 2) * k - 3          # a touch above centre
    body = f'<rect width="256" height="256" rx="56" fill="{NAVY}"/>' + symbol_paths(SMALL, DARK, x, y, k, True)
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(svg(256, 256, body, 'NHISA'))


if __name__ == '__main__' and len(sys.argv) > 2 and sys.argv[2] == 'favicon':
    favicon_tile(os.path.join(LOGO, 'nhisa-favicon.svg'))


def avatar(path):
    """Social avatar: the full symbol, light on navy, kept inside the circle crop."""
    L, T, R, B = symbol_box(FULL)
    k = 140 / max(R - L, B - T)
    x = 128 - (L + (R - L) / 2) * k
    y = 128 - (T + (B - T) / 2) * k - 2
    body = f'<rect width="256" height="256" fill="{NAVY}"/>' + symbol_paths(FULL, DARK, x, y, k, True)
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(svg(256, 256, body, 'NHISA'))


if __name__ == '__main__' and len(sys.argv) > 2 and sys.argv[2] == 'avatar':
    avatar(os.path.join(LOGO, 'nhisa-avatar.svg'))
