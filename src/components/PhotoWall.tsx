import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, Hourglass, ImagePlus, RotateCcw, Trash2, X } from 'lucide-react';
import { WALL_CAPTION, WALL_PHOTOS, type WallShape } from '../content/photos';
import { CONTACT } from '../content/site';
import { href } from '../lib/router';
import {
  MAX_WAITING,
  SHARED,
  WallError,
  approvedPhotos,
  captcha,
  hasSession,
  ownPhotos,
  publicUrl,
  sendPhoto,
  withdraw,
  type Sent,
  type SharedPhoto,
} from '../lib/wall';

/** Where a polaroid sits: its centre as a fraction of the board, its tilt in degrees, its pin across the top in %. */
type Spot = { x: number; y: number; r: number; pin: number };
type Pinned = { id: string; src: string; alt: string; shape: WallShape; caption: string; mine?: boolean; waiting?: boolean };
/** A photo this visitor added; `sent` once it has gone to the shared wall. */
type Upload = { id: string; src: string; shape: WallShape; sent?: Sent };
/** What a visitor has done to the wall, kept in their own browser only. */
type Saved = { uploads: Upload[]; moved: Record<string, Spot>; order: string[] };
type Box = { x: number; y: number; w: number; h: number };
/** The board's size, what to keep clear of, and whether it is the full wall, which grows to fit its photos. */
type Frame = { W: number; H: number; blocks: Box[]; full: boolean };
type Slot = { cy: number; a: number; b: number };
type Layout = { u: number; W: number; H: number; spots: Record<string, Spot>; slots: Slot[] };

// The visitor's photos and the homepage arrangement; the full wall keeps its own arrangement.
const KEY = 'nhisa.photo-wall.v1';
const FULL_KEY = 'nhisa.photo-wall.full.v1';
const MAX_UPLOADS = 24;
const UPLOAD_WIDTH = 720;
const SHAPES: Record<WallShape, { k: number; ratio: number; css: string }> = {
  portrait: { k: 1, ratio: 5 / 4, css: '4 / 5' },
  landscape: { k: 1.24, ratio: 3 / 4, css: '4 / 3' },
  wide: { k: 1.36, ratio: 9 / 16, css: '16 / 9' },
};
const isMine = (id: string) => id.startsWith('mine-');

/** A polaroid's height per unit of width: a 5% top border, the picture at 90% width, a 15% bottom border. */
const tall = (shape: WallShape) => 0.2 + 0.9 * SHAPES[shape].ratio;
const clamp = (v: number, lo: number, hi: number) => (lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v)));

/** A repeatable random sequence per key, so every visitor sees the same arrangement. */
function random(key: string) {
  let a = [...key].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tilt(rnd: () => number) {
  return { r: (rnd() < 0.5 ? -1 : 1) * (2 + rnd() * 6), pin: 40 + rnd() * 20 };
}

/** A portrait polaroid's width. The full wall grows to fit, so only its width counts there, and its photos are larger. */
const unitFor = (W: number, H: number, full: boolean) =>
  full ? Math.max(60, W < 560 ? W * 0.4 : Math.min(W * 0.15, 260)) : Math.max(60, W < 560 ? W * 0.29 : Math.min(W * 0.14, H * 0.24));
const padFor = (W: number) => Math.max(10, W * 0.025);

/** How tall the full wall has to be for `count` photos to get a place each, below its buttons. */
function fullHeight(count: number, W: number, blocks: Box[]) {
  const u = unitFor(W, 0, true);
  const pad = padFor(W);
  const perRow = Math.max(1, Math.floor((W - 2 * pad) / (u * 0.97)));
  const top = Math.max(0, ...blocks.map((k) => k.y + k.h));
  return Math.ceil(top + 2 * pad + u * tall('portrait') + (Math.ceil(count / perRow) - 1) * u * 1.2);
}

/**
 * Scatter the photos in loose rows across the board, around the heading and
 * the buttons (`blocks`), spreading them over every row rather than filling
 * the first ones. More photos than room go in a second layer between the rows,
 * except on a phone's homepage wall, which shows only what fits.
 */
function scatter(photos: { id: string; shape: WallShape }[], { W, H, blocks, full }: Frame): Layout {
  const small = W < 560;
  const u = unitFor(W, H, full);
  const pad = padFor(W);
  const half = (u * tall('portrait')) / 2;
  const margin = u * 0.2;
  const gap = u * 0.08;
  // Rows keep clear of anything too wide to fit a photo beside: the heading at
  // the bottom of a phone's homepage wall, the buttons at the top of the full wall.
  const roomy = (k: Box) => Math.max(k.x - pad, W - pad - k.x - k.w) - margin >= u;
  const blocking = blocks.filter((k) => !roomy(k));
  // Below a block, leave room for the pins too.
  const ceiling = Math.max(pad, ...blocking.filter((k) => k.y + k.h / 2 < H / 2).map((k) => k.y + k.h + gap + u * 0.12));
  const floor = Math.min(H - pad, ...blocking.filter((k) => k.y + k.h / 2 >= H / 2).map((k) => k.y - gap));
  const room = floor - ceiling - 2 * half;
  const rows = Math.max(1, Math.floor(room / (u * 1.15)) + 1);
  const step = rows > 1 ? Math.min(room / (rows - 1), u * 1.25) : 0;

  const slots: Slot[] = [];
  for (let i = 0; i < rows; i++) {
    const cy = ceiling + half + i * step;
    let spans: [number, number][] = [[pad, W - pad]];
    for (const k of blocks) {
      if (k.y - gap >= cy + half || k.y + k.h + gap <= cy - half) continue;
      spans = spans.flatMap(([a, b]): [number, number][] => [
        [a, Math.min(b, k.x - margin)],
        [Math.max(a, k.x + k.w + margin), b],
      ]);
    }
    for (const [a, b] of spans) if (b - a >= u) slots.push({ cy, a, b });
  }

  const width = (shape: WallShape) => u * SHAPES[shape].k * 0.86;
  const average = photos.reduce((sum, p) => sum + width(p.shape), 0) / Math.max(1, photos.length);
  const caps = slots.map((s) => Math.max(1, Math.floor((s.b - s.a) / average)));
  const total = caps.reduce((a, b) => a + b, 0);
  const share = Math.min(1, photos.length / Math.max(1, total));
  const counts = caps.map((c) => Math.floor(c * share));
  let left = Math.min(photos.length, total) - counts.reduce((a, b) => a + b, 0);
  caps
    .map((c, i) => [c * share - counts[i], i] as const)
    .sort((a, b) => b[0] - a[0])
    .forEach(([, i]) => {
      if (left > 0 && counts[i] < caps[i]) {
        counts[i]++;
        left--;
      }
    });

  const spots: Record<string, Spot> = {};
  const put = (id: string, shape: WallShape, cx: number, cy: number, seed = id) => {
    const rnd = random(seed);
    const w = u * SHAPES[shape].k;
    const h = w * tall(shape);
    const x = clamp(cx + (rnd() - 0.5) * u * 0.18, w / 2 + 4, W - w / 2 - 4);
    const y = clamp(cy + (rnd() - 0.5) * u * 0.24, h / 2 + u * 0.1, H - h / 2 - 4);
    spots[id] = { x: x / W, y: y / H, ...tilt(rnd) };
  };

  let next = 0;
  slots.forEach((slot, i) => {
    const group = photos.slice(next, next + counts[i]);
    next += group.length;
    const widths = group.map((p) => width(p.shape));
    const gap = (slot.b - slot.a - widths.reduce((a, b) => a + b, 0)) / Math.max(1, group.length);
    let x = slot.a + gap / 2;
    group.forEach((p, j) => {
      put(p.id, p.shape, x + widths[j] / 2, slot.cy);
      x += widths[j] + gap;
    });
  });
  // A phone's homepage wall shows only the photos that fit.
  for (; next < photos.length && (full || !small); next++) {
    const p = photos[next];
    const slot = slots[next % Math.max(1, slots.length)];
    const rnd = random(`${p.id}:extra`);
    if (!slot) {
      put(p.id, p.shape, W / 2, H / 2);
      continue;
    }
    // Between this row and the next, unless that would cover the heading or the buttons.
    const cx = slot.a + rnd() * (slot.b - slot.a);
    const w = u * SHAPES[p.shape].k;
    const h = w * tall(p.shape);
    const below = slot.cy + step / 2;
    const covers = blocks.some((k) => cx + w / 2 > k.x - margin && cx - w / 2 < k.x + k.w + margin && below + h / 2 > k.y - gap && below - h / 2 < k.y + k.h + gap);
    put(p.id, p.shape, cx, covers ? slot.cy : below, `${p.id}:extra`);
  }
  return { u, W, H, spots, slots };
}

/** Somewhere free for a new photo: where it was dropped, or a random stretch of a row. */
function placeUpload(id: string, layout: Layout, at?: { x: number; y: number }): Spot {
  const rnd = random(id);
  if (at) return { ...at, ...tilt(rnd) };
  const length = layout.slots.reduce((sum, s) => sum + s.b - s.a, 0);
  let pick = rnd() * length;
  const slot = layout.slots.find((s) => (pick -= s.b - s.a) <= 0) ?? layout.slots[0];
  if (!slot) return { x: 0.5, y: 0.4, ...tilt(rnd) };
  return { x: (slot.a + rnd() * (slot.b - slot.a)) / layout.W, y: (slot.cy + (rnd() - 0.5) * layout.u * 0.4) / layout.H, ...tilt(rnd) };
}

/** Shrink and crop a photo to its polaroid window; portraits keep more of the top, where faces usually are. */
async function toPolaroid(file: File): Promise<{ src: string; shape: WallShape; blob: Blob }> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const shape: WallShape = h / w > 1.05 ? 'portrait' : h / w > 0.66 ? 'landscape' : 'wide';
    const { ratio } = SHAPES[shape];
    const cw = Math.min(w, h / ratio);
    const ch = cw * ratio;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(Math.min(UPLOAD_WIDTH, cw));
    canvas.height = Math.round(canvas.width * ratio);
    canvas.getContext('2d')!.drawImage(img, (w - cw) / 2, (h - ch) * (shape === 'portrait' ? 0.3 : 0.5), cw, ch, 0, 0, canvas.width, canvas.height);
    // Re-encoding also drops the original's metadata, such as where it was taken.
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/jpeg', 0.8));
    return { src: canvas.toDataURL('image/jpeg', 0.8), shape, blob };
  } finally {
    URL.revokeObjectURL(url);
  }
}

const isSpot = (s: unknown): s is Spot =>
  !!s && typeof s === 'object' && ['x', 'y', 'r', 'pin'].every((k) => Number.isFinite((s as Record<string, unknown>)[k]));
const isSent = (s: unknown): s is Sent =>
  !!s && typeof s === 'object' && ['id', 'path', 'user'].every((k) => typeof (s as Record<string, unknown>)[k] === 'string');

function read(key: string): Record<string, unknown> {
  try {
    const s = JSON.parse(localStorage.getItem(key) ?? 'null');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}

function load(full: boolean): Saved {
  const s = read(KEY);
  const board = full ? read(FULL_KEY) : s;
  return {
    uploads: Array.isArray(s.uploads)
      ? s.uploads.filter(
          (p: Upload) =>
            typeof p?.id === 'string' &&
            typeof p.src === 'string' &&
            p.src.startsWith('data:image/') &&
            p.shape in SHAPES &&
            (p.sent === undefined || isSent(p.sent)),
        )
      : [],
    moved: Object.fromEntries(Object.entries(board.moved ?? {}).filter(([, spot]) => isSpot(spot))) as Record<string, Spot>,
    order: Array.isArray(board.order) ? board.order.filter((id: unknown) => typeof id === 'string') : [],
  };
}

function store(full: boolean, saved: Saved) {
  try {
    if (!full) {
      localStorage.setItem(KEY, JSON.stringify(saved));
      return true;
    }
    // The full wall shares the visitor's photos with the homepage and keeps its own arrangement.
    localStorage.setItem(KEY, JSON.stringify({ ...read(KEY), uploads: saved.uploads }));
    localStorage.setItem(FULL_KEY, JSON.stringify({ moved: saved.moved, order: saved.order }));
    return true;
  } catch {
    return false;
  }
}

/** Measure an element against the board, ignoring the transforms of entrance animations. */
function boxWithin(el: HTMLElement, root: HTMLElement): Box {
  let x = 0;
  let y = 0;
  for (let node: HTMLElement | null = el; node && node !== root; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function Pin() {
  return (
    <svg className="wall-pin" viewBox="0 0 36 36" aria-hidden="true">
      <ellipse cx="21" cy="24" rx="7.5" ry="5.5" fill="url(#wall-pin-collar)" />
      <circle cx="17" cy="15" r="11" fill="url(#wall-pin-head)" />
      <ellipse cx="13" cy="10" rx="3.6" ry="2.2" fill="#fff" opacity="0.6" transform="rotate(-35 13 10)" />
    </svg>
  );
}

type ItemProps = {
  photo: Pinned;
  spot: Spot;
  z: number;
  index: number;
  /** Half the polaroid's size, as a fraction of the board, to keep it on the board. */
  half: { x: number; y: number };
  fresh: boolean;
  onFront: (id: string) => void;
  onMove: (id: string, spot: Spot) => void;
  onOpen: (photo: Pinned) => void;
  onRemove: (id: string) => void;
};

type Drag = { pointer: number; sx: number; sy: number; W: number; H: number; active: boolean; moved: boolean; timer: number };

/** One pinned polaroid: drag it (hold first on touch), click it to see it larger, or move it with the arrow keys. */
function WallItem({ photo, spot, z, index, half, fresh, onFront, onMove, onOpen, onRemove }: ItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const drag = useRef<Drag | null>(null);
  const live = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);
  const shape = SHAPES[photo.shape];
  const keep = (x: number, y: number) => ({ x: clamp(x, half.x, 1 - half.x), y: clamp(y, half.y, 1 - half.y) });
  const at = live.current ?? keep(spot.x, spot.y);

  // A touch that has turned into a drag must not scroll the page.
  useEffect(() => {
    const el = handle.current!;
    const hold = (event: TouchEvent) => drag.current?.active && event.preventDefault();
    el.addEventListener('touchmove', hold, { passive: false });
    return () => el.removeEventListener('touchmove', hold);
  }, []);

  const pickUp = () => {
    const d = drag.current;
    if (!d) return;
    d.active = true;
    ref.current?.classList.add('is-dragging');
  };

  const finish = () => {
    const d = drag.current;
    if (!d) return;
    window.clearTimeout(d.timer);
    ref.current?.classList.remove('is-dragging');
    if (d.moved && live.current) {
      dragged.current = true;
      onMove(photo.id, { ...spot, ...live.current });
    }
    live.current = null;
    drag.current = null;
  };

  return (
    <li
      ref={ref}
      className={`wall-item${fresh ? ' is-new' : ''}`}
      style={
        {
          left: `${at.x * 100}%`,
          top: `${at.y * 100}%`,
          zIndex: z,
          '--k': shape.k,
          '--r': `${spot.r}deg`,
          '--ratio': shape.css,
          '--i': index,
          '--pin-x': `${spot.pin}%`,
        } as CSSProperties
      }
    >
      <div className="wall-drop">
        <div className="wall-lift">
          <button
            ref={handle}
            type="button"
            className="wall-photo"
            aria-describedby="wall-help"
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              const board = ref.current!.offsetParent!.getBoundingClientRect();
              const pointer = event.pointerId;
              dragged.current = false;
              onFront(photo.id);
              drag.current = { pointer, sx: event.clientX, sy: event.clientY, W: board.width, H: board.height, active: false, moved: false, timer: 0 };
              // Captured on the button itself, so a click still lands on it after a press that didn't move.
              if (event.pointerType !== 'touch') return event.currentTarget.setPointerCapture(pointer);
              // On touch, a short hold picks the photo up; a swipe still scrolls the page.
              drag.current.timer = window.setTimeout(() => {
                handle.current?.setPointerCapture(pointer);
                pickUp();
                navigator.vibrate?.(8);
              }, 260);
            }}
            onPointerMove={(event) => {
              const d = drag.current;
              if (!d || event.pointerId !== d.pointer) return;
              const dx = event.clientX - d.sx;
              const dy = event.clientY - d.sy;
              if (!d.active) {
                if (Math.hypot(dx, dy) < 4) return;
                if (event.pointerType === 'touch') return finish();
                pickUp();
              }
              d.moved = true;
              live.current = keep(spot.x + dx / d.W, spot.y + dy / d.H);
              ref.current!.style.left = `${live.current.x * 100}%`;
              ref.current!.style.top = `${live.current.y * 100}%`;
            }}
            onPointerUp={finish}
            onPointerCancel={finish}
            onContextMenu={(event) => drag.current && event.preventDefault()}
            onClick={() => {
              if (dragged.current) dragged.current = false;
              else onOpen(photo);
            }}
            onKeyDown={(event) => {
              const step = event.shiftKey ? 0.06 : 0.02;
              const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
              if (!move) return;
              event.preventDefault();
              onFront(photo.id);
              onMove(photo.id, { ...spot, ...keep(spot.x + move[0], spot.y + move[1]) });
            }}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" draggable={false} />
            {photo.waiting && (
              <span className="wall-tag">
                <Hourglass size={11} aria-hidden="true" />
                Waiting
              </span>
            )}
          </button>
          <Pin />
          {photo.mine && (
            <button type="button" className="wall-remove" aria-label="Remove this photo from the wall" onClick={() => onRemove(photo.id)}>
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

type Point = { x: number; y: number };
type Ask = { files: File[]; at?: Point };

/**
 * The most community photos at once. On the homepage they alternate with the
 * festival photos and take their places, so it is at most half theirs; the
 * full wall shows the festival photos and up to 60 more.
 */
const COMMUNITY_LIMIT = { home: 8, full: 60 };
const FESTIVAL: Pinned[] = WALL_PHOTOS.map((p) => ({ ...p, caption: WALL_CAPTION }));
const isImage = (file: File) => file.type.startsWith('image/');

function interleave<T>(a: T[], b: T[]) {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

/**
 * "Find your moment." as a pinboard: NHISA's festival photos pinned at a tilt,
 * which visitors can drag around, open, and add their own to. Where a visitor
 * leaves things stays in their browser. With a Supabase project set up
 * (lib/wall.ts), photos they add go to an officer and, once approved, onto
 * everyone's wall; without one, they stay in that browser too.
 *
 * `home` is the homepage tile, with the heading and a link to the full wall;
 * `full` is that page's board, which grows as tall as its photos need.
 */
export default function PhotoWall({ className = '', variant = 'home' }: { className?: string; variant?: 'home' | 'full' }) {
  const full = variant === 'full';
  const boardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sendRef = useRef<HTMLDialogElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const check = useRef<ReturnType<typeof captcha> | null>(null);
  const warned = useRef(false);

  const [saved, setSaved] = useState<Saved>(() => load(full));
  const [frame, setFrame] = useState<Frame | null>(null);
  const [inView, setInView] = useState(false);
  const [viewing, setViewing] = useState<Pinned | null>(null);
  const [dropping, setDropping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [fresh, setFresh] = useState<string[]>([]);
  const [community, setCommunity] = useState<SharedPhoto[]>([]);
  const [ownApproved, setOwnApproved] = useState<string[]>([]);
  const [paused, setPaused] = useState(false);
  const [ask, setAsk] = useState<Ask | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [askError, setAskError] = useState('');

  useLayoutEffect(() => {
    const board = boardRef.current!;
    const parts = ([headingRef.current, controlsRef.current] as (HTMLElement | null)[]).filter((el): el is HTMLElement => Boolean(el));
    const measure = () =>
      setFrame({ W: board.clientWidth, H: board.clientHeight, blocks: parts.map((el) => boxWithin(el, board)), full });
    measure();
    const observer = new ResizeObserver(measure);
    [board, ...parts].forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(boardRef.current!);
    return () => observer.disconnect();
  }, []);

  const firstSave = useRef(true);
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    if (!store(full, saved) && !warned.current) {
      warned.current = true;
      setStatus('This browser has no room to keep your photos, so they will be gone when you leave.');
    }
  }, [saved]);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(''), Math.max(6000, status.length * 70));
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (viewing && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [viewing]);

  // The approved community photos, once per visit. If they can't be reached, the wall is festival photos only.
  useEffect(() => {
    if (!SHARED) return;
    let live = true;
    approvedPhotos(COMMUNITY_LIMIT[variant]).then(
      (rows) => live && setCommunity(rows),
      () => live && setPaused(true),
    );
    return () => {
      live = false;
    };
  }, []);

  // Check on the photos this browser sent: approved ones lose their tag, turned-down ones leave the wall.
  useEffect(() => {
    if (!SHARED) return;
    const sent = saved.uploads.flatMap((u) => (u.sent ? [u.sent] : []));
    const users = [...new Set(sent.map((s) => s.user))];
    if (!users.length) return;
    let live = true;
    Promise.all(users.map(ownPhotos)).then(
      (lists) => {
        if (!live) return;
        const checked = new Set(users.filter((_, i) => lists[i]));
        const rows = lists.flatMap((list) => list ?? []);
        const exists = new Set(rows.map((r) => r.id));
        setOwnApproved(rows.filter((r) => r.status === 'approved').map((r) => r.id));
        const gone = sent.filter((s) => checked.has(s.user) && !exists.has(s.id)).map((s) => `mine-${s.id}`);
        if (!gone.length) return;
        setSaved((s) => ({
          uploads: s.uploads.filter((u) => !gone.includes(u.id)),
          moved: Object.fromEntries(Object.entries(s.moved).filter(([id]) => !gone.includes(id))),
          order: s.order.filter((id) => !gone.includes(id)),
        }));
        setStatus(gone.length === 1 ? 'One of your photos wasn’t added to the wall.' : `${gone.length} of your photos weren’t added to the wall.`);
      },
      () => {},
    );
    return () => {
      live = false;
    };
    // Once per visit, for the photos this browser had when it arrived.
  }, []);

  // The send dialog: open it, and start the captcha if this browser has never signed in.
  useEffect(() => {
    if (!ask) return;
    if (!sendRef.current?.open) sendRef.current?.showModal();
    if (!check.current && !hasSession()) check.current = captcha(captchaRef.current!);
  }, [ask]);

  const approved = useMemo(() => new Set([...community.map((c) => c.id), ...ownApproved]), [community, ownApproved]);
  const seeds = useMemo<Pinned[]>(() => {
    const mine = new Set(saved.uploads.flatMap((u) => (u.sent ? [u.sent.id] : [])));
    const shared = community.map((c) => ({
      id: `shared-${c.id}`,
      src: publicUrl(c.path),
      shape: c.shape,
      alt: mine.has(c.id) ? 'Your photo' : 'A photo from the NHISA community',
      caption: mine.has(c.id) ? 'Your photo, on the wall for everyone.' : 'From the NHISA community',
      mine: mine.has(c.id),
    }));
    const all = interleave<Pinned>(shared, FESTIVAL);
    // On the homepage, community photos take festival photos' places, so the tile keeps its sixteen.
    return full ? all : all.slice(0, FESTIVAL.length);
  }, [community, saved.uploads, full]);
  const layout = useMemo(() => (frame ? scatter(seeds, frame) : null), [frame, seeds]);
  // The full wall's height: enough rows for every photo, whatever the screen width.
  const tallEnough = full && frame ? fullHeight(seeds.length + saved.uploads.length, frame.W, frame.blocks) : 0;
  const pinned = useMemo<Pinned[]>(() => {
    const onWall = new Set(community.map((c) => c.id));
    const own = saved.uploads
      // A visitor's own approved photo shows once, as the shared copy.
      .filter((u) => !(u.sent && onWall.has(u.sent.id)))
      .map((p, i) => {
        const waiting = Boolean(p.sent && !approved.has(p.sent.id));
        return {
          id: p.id,
          src: p.src,
          shape: p.shape,
          alt: `Photo you added (${i + 1})`,
          caption: !p.sent
            ? 'Added by you. Only this browser can see it.'
            : waiting
              ? 'Waiting for an NHISA officer to approve it. Until then, only you can see it.'
              : 'Your photo, on the wall for everyone.',
          mine: true,
          waiting,
        };
      });
    return [...seeds, ...own];
  }, [seeds, saved.uploads, community, approved]);
  // Untouched photos keep a fixed shuffle; the ones a visitor picked up sit on top, last touched highest.
  const stack = useMemo(() => {
    const rnd = random('wall');
    const shuffled = seeds.map((p) => [rnd(), p.id] as const).sort((a, b) => a[0] - b[0]).map(([, id]) => id);
    const ids = pinned.map((p) => p.id);
    const touched = saved.order.filter((id) => ids.includes(id));
    return [...shuffled, ...ids.filter((id) => !shuffled.includes(id))].filter((id) => !touched.includes(id)).concat(touched);
  }, [seeds, pinned, saved.order]);

  const toFront = useCallback(
    (id: string) => setSaved((s) => (s.order[s.order.length - 1] === id ? s : { ...s, order: [...s.order.filter((x) => x !== id), id] })),
    [],
  );
  const moveTo = useCallback((id: string, spot: Spot) => setSaved((s) => ({ ...s, moved: { ...s.moved, [id]: spot } })), []);

  const remove = async (id: string) => {
    const upload = saved.uploads.find((u) => u.id === id || (u.sent && `shared-${u.sent.id}` === id));
    if (!upload) return;
    const { sent } = upload;
    if (sent) {
      try {
        await withdraw(sent);
      } catch {
        return setStatus('Your photo couldn’t be taken down just now. Try again in a moment.');
      }
      setCommunity((c) => c.filter((p) => p.id !== sent.id));
    }
    const keys = [upload.id, `shared-${sent?.id}`];
    setSaved((s) => ({
      uploads: s.uploads.filter((u) => u.id !== upload.id),
      moved: Object.fromEntries(Object.entries(s.moved).filter(([key]) => !keys.includes(key))),
      order: s.order.filter((key) => !keys.includes(key)),
    }));
    setStatus(sent ? 'Your photo is off the wall.' : 'Photo removed from the wall.');
  };
  const tidy = () =>
    setSaved((s) => ({
      ...s,
      moved: Object.fromEntries(Object.entries(s.moved).filter(([id]) => isMine(id))),
      order: s.order.filter(isMine),
    }));

  const pin = (added: { upload: Upload; spot: Spot }[]) => {
    setSaved((s) => ({
      uploads: [...s.uploads, ...added.map((a) => a.upload)],
      moved: { ...s.moved, ...Object.fromEntries(added.map((a) => [a.upload.id, a.spot])) },
      order: [...s.order, ...added.map((a) => a.upload.id)],
    }));
    setFresh(added.map((a) => a.upload.id));
  };
  const spread = (at: Point | undefined, i: number) => at && { x: at.x + i * 0.03, y: at.y + i * 0.03 };
  const plural = (n: number, one: string, many: string) => (n === 1 ? one : `${n} ${many}`);

  // Without a shared wall: photos stay in this browser.
  const pinLocally = async (files: File[], at?: Point) => {
    if (!layout) return;
    const images = files.filter(isImage);
    if (!images.length) return setStatus('That file isn’t a photo. Try a JPG or PNG.');
    const room = MAX_UPLOADS - saved.uploads.length;
    if (room <= 0) return setStatus(`The wall holds ${MAX_UPLOADS} of your photos. Remove one to add another.`);

    setBusy(true);
    const added: { upload: Upload; spot: Spot }[] = [];
    for (const [i, file] of images.slice(0, room).entries()) {
      try {
        const { src, shape } = await toPolaroid(file);
        const id = `mine-${Date.now().toString(36)}-${i}`;
        added.push({ upload: { id, src, shape }, spot: placeUpload(id, layout, spread(at, i)) });
      } catch {
        // An image the browser can't read (HEIC on some desktops) is skipped.
      }
    }
    setBusy(false);
    if (added.length) pin(added);
    const skipped = images.length - added.length;
    setStatus(
      [
        added.length && `${plural(added.length, 'Your photo is', 'photos are')} on the wall.`,
        skipped && `${plural(skipped, 'One photo', 'photos')} couldn’t be added.`,
      ]
        .filter(Boolean)
        .join(' '),
    );
  };

  // With a shared wall: photos go to an officer, and show here with a "Waiting" tag meanwhile.
  const send = async (files: File[], at?: Point) => {
    if (!layout) return;
    const images = files.filter(isImage);
    if (!images.length) return setAskError('That file isn’t a photo. Try a JPG or PNG.');
    const full = `You have ${MAX_WAITING} photos waiting already. You can add more once an officer has looked at them.`;
    const room = MAX_WAITING - saved.uploads.filter((u) => u.sent && !approved.has(u.sent.id)).length;
    if (room <= 0) return setAskError(full);

    setBusy(true);
    setAskError('');
    let token: string | undefined;
    try {
      token = check.current ? await check.current.token : undefined;
    } catch {
      setBusy(false);
      return setAskError('The security check didn’t finish. Close this and try again.');
    }
    const added: { upload: Upload; spot: Spot }[] = [];
    let refused = false;
    for (const [i, file] of images.slice(0, room).entries()) {
      try {
        const polaroid = await toPolaroid(file);
        const sent = await sendPhoto(polaroid.blob, polaroid.shape, token);
        // The token is good once; later photos ride on the session it opened.
        token = undefined;
        const id = `mine-${sent.id}`;
        added.push({ upload: { id, src: polaroid.src, shape: polaroid.shape, sent }, spot: placeUpload(id, layout, spread(at, i)) });
      } catch (error) {
        if (error instanceof WallError && error.reason === 'full') {
          refused = true;
          break;
        }
      }
    }
    setBusy(false);
    if (!added.length) return setAskError(refused ? full : 'Your photo couldn’t be sent. Check your connection and try again.');

    pin(added);
    sendRef.current?.close();
    const skipped = images.length - added.length;
    setStatus(
      `Thanks! ${plural(added.length, 'Your photo is', 'photos are')} waiting for an NHISA officer. Until then, only you can see ${added.length === 1 ? 'it' : 'them'}.` +
        (skipped ? ` ${plural(skipped, 'One photo', 'photos')} couldn’t be sent.` : ''),
    );
  };

  const startAdding = (files: File[] = [], at?: Point) => {
    if (SHARED) return setAsk({ files, at });
    if (files.length) return pinLocally(files, at);
    inputRef.current?.click();
  };
  const closeAsk = () => {
    check.current?.cancel();
    check.current = null;
    setAsk(null);
    setAgreed(false);
    setAskError('');
  };

  const moved = Object.keys(saved.moved).some((id) => !isMine(id));
  const asked = ask?.files.length ?? 0;

  return (
    <div
      ref={boardRef}
      className={`photo-wall field-careers relative isolate flex flex-col overflow-hidden rounded-[1.25rem] p-5 md:p-8 ${full ? 'justify-start' : 'justify-end'} ${inView ? 'is-in' : ''} ${className}`}
      style={tallEnough ? { height: tallEnough } : undefined}
      onDragOver={(event) => {
        if (paused || !event.dataTransfer.types.includes('Files')) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        setDropping(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropping(false);
      }}
      onDrop={(event) => {
        if (paused || !event.dataTransfer.files.length) return;
        event.preventDefault();
        setDropping(false);
        const rect = event.currentTarget.getBoundingClientRect();
        startAdding([...event.dataTransfer.files], { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height });
      }}
    >
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="wall-pin-head" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#ffd9bd" />
            <stop offset="0.22" stopColor="#ff8d42" />
            <stop offset="0.65" stopColor="#f76900" />
            <stop offset="1" stopColor="#9c3d00" />
          </radialGradient>
          <linearGradient id="wall-pin-collar" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e05f00" />
            <stop offset="1" stopColor="#7a2f00" />
          </linearGradient>
        </defs>
      </svg>

      {layout && (
        <ul className="wall-board" aria-label="Photos from NHISA events and members" style={{ '--u': `${layout.u}px` } as CSSProperties}>
          {pinned.map((photo, index) => {
            // A visitor's own photo added on the other wall has no place here yet: give it one.
            const spot = saved.moved[photo.id] ?? layout.spots[photo.id] ?? (photo.mine ? placeUpload(photo.id, layout) : undefined);
            if (!spot) return null;
            const w = layout.u * SHAPES[photo.shape].k;
            return (
              <WallItem
                key={photo.id}
                photo={photo}
                spot={spot}
                z={stack.indexOf(photo.id) + 1}
                index={index}
                half={{ x: w / 2 / layout.W, y: (w * tall(photo.shape)) / 2 / layout.H + (layout.u * 0.1) / layout.H }}
                fresh={fresh.includes(photo.id)}
                onFront={toFront}
                onMove={moveTo}
                onOpen={setViewing}
                onRemove={remove}
              />
            );
          })}
        </ul>
      )}
      <p id="wall-help" className="sr-only">
        Opens the photo larger. Use the arrow keys to move it on the wall.
      </p>

      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        {!full && (
          <h2 ref={headingRef} id="intro-title" data-reveal className="t-display relative w-fit xl:shrink-0">
            Find your
            <br />
            moment.
          </h2>
        )}
        <div ref={controlsRef} className={`relative z-30 flex min-w-0 flex-col items-start gap-2.5 ${full ? '' : 'xl:items-end'}`}>
          <div className={`flex flex-wrap gap-2 ${full ? '' : 'xl:justify-end'}`}>
            {moved && (
              <button type="button" onClick={tidy} aria-label="Put the photos back" title="Put the photos back" className="glass-button w-11">
                <RotateCcw size={16} aria-hidden="true" />
              </button>
            )}
            <button type="button" onClick={() => startAdding()} disabled={busy || paused} className="glass-button whitespace-nowrap px-5">
              <ImagePlus size={17} aria-hidden="true" />
              {busy && !ask ? 'Pinning…' : 'Add your photo'}
            </button>
            {!full && (
              <a href={href('/wall')} className="glass-button whitespace-nowrap px-5">
                See the full wall
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            )}
          </div>
          <p className={`t-meta max-w-[30ch] ${full ? '' : 'xl:text-right'}`} aria-live="polite">
            {status ||
              (paused ? (
                'Adding photos is paused right now.'
              ) : (
                <>
                  <span className="[@media(hover:none)]:hidden">Drag photos around. </span>
                  <span className="hidden [@media(hover:none)]:inline">Hold a photo to move it. </span>
                  {SHARED ? 'Yours go up once an officer approves them.' : 'Yours stay on this device.'}
                </>
              ))}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              const files = [...(event.target.files ?? [])];
              event.target.value = '';
              if (SHARED) send(files, ask?.at);
              else pinLocally(files);
            }}
          />
        </div>
      </div>

      {dropping && (
        <div className="pointer-events-none absolute inset-2 z-40 flex items-center justify-center rounded-[1rem] border-2 border-dashed border-white/60 bg-[#232860]/75 text-[var(--step-lead)] font-medium">
          Drop to pin it on the wall
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="image-dialog"
        aria-label={viewing?.alt}
        onClose={() => setViewing(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        {viewing && (
          <figure className="relative">
            <img src={viewing.src} alt={viewing.alt} className="block max-h-[72vh] w-full rounded-xl bg-[var(--bg)] object-contain" />
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
              {viewing.caption}
              {viewing.mine && (
                <button
                  type="button"
                  onClick={() => {
                    remove(viewing.id);
                    dialogRef.current?.close();
                  }}
                  className="glass-button px-4"
                >
                  <Trash2 size={15} aria-hidden="true" />
                  Remove from the wall
                </button>
              )}
            </figcaption>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" autoFocus className="glass-button absolute -right-3 -top-3 h-9 w-9">
              <X size={18} aria-hidden="true" />
            </button>
          </figure>
        )}
      </dialog>

      {SHARED && (
        <dialog
          ref={sendRef}
          className="image-dialog send-dialog"
          aria-labelledby="send-title"
          onClose={closeAsk}
          onCancel={(event) => busy && event.preventDefault()}
          onClick={(event) => {
            if (event.target === sendRef.current && !busy) sendRef.current.close();
          }}
        >
          <div className="relative p-1 sm:p-3">
            <h3 id="send-title" className="pr-8 text-[var(--step-lead)] font-medium leading-tight text-white">
              Add your photo to the wall
            </h3>
            <p className="t-body mt-3 text-white/75">
              An NHISA officer looks at every photo before it goes up for everyone. Until then, only you can see it here.
            </p>
            <label className="mt-6 flex cursor-pointer items-start gap-3 text-white">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-[#aab3ff]"
              />
              <span>Everyone in {asked > 1 ? 'these photos' : 'the photo'} is happy for it to be on the NHISA website.</span>
            </label>
            <div ref={captchaRef} className="mt-5 empty:hidden" />
            {askError && (
              <p role="alert" className="mt-4 text-[#ffc2b5]">
                {askError}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                disabled={!agreed || busy}
                onClick={() => (asked ? send(ask!.files, ask!.at) : inputRef.current?.click())}
                className="glass-button px-6"
              >
                <ImagePlus size={17} aria-hidden="true" />
                {busy ? 'Sending…' : asked ? `Send ${plural(asked, 'photo', 'photos')}` : 'Choose photos'}
              </button>
              <button type="button" disabled={busy} onClick={() => sendRef.current?.close()} className="t-meta underline underline-offset-4 hover:text-white">
                Cancel
              </button>
            </div>
            <p className="t-meta mt-6">
              Photos are made smaller, and their location data is removed, before they leave your device. You can take yours down at any time from this
              browser{CONTACT.email ? <>, or email <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">{CONTACT.email}</a></> : ''}.
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => sendRef.current?.close()}
              aria-label="Close"
              className="glass-button absolute -right-3 -top-3 h-9 w-9"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
