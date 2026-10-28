import { useEffect, useRef } from 'react';

type Leaf = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  sway: number;
  swaySpeed: number;
  swayAmp: number;
  size: number;
  age: number;
  life: number;
  shape: LeafShape;
  front: string;
  back: string;
};

type LeafShape = { body: Path2D; veins: Path2D };

// [front, back] — the back face shows while the leaf is flipped over.
const PALETTE: [string, string][] = [
  ['#e8702a', '#a94a14'],
  ['#f59e0b', '#b45309'],
  ['#d2611f', '#8a3a0f'],
  ['#c0392b', '#7f1d1d'],
  ['#e5a33a', '#9a6212'],
  ['#b5541c', '#6e2e0c'],
  ['#d9a21b', '#8c6410'],
];

// Paths are drawn in a ~20-unit box centred on the origin.
const MAPLE_BODY =
  'M0,-10 L1.8,-6.2 L4.2,-7.2 L3.4,-3.4 L7.8,-4.6 L6.6,-2.4 L8.8,-1.2 L4.8,1.2 L5.4,3.4 L0.8,2.4 L0,3.2 ' +
  'L-0.8,2.4 L-5.4,3.4 L-4.8,1.2 L-8.8,-1.2 L-6.6,-2.4 L-7.8,-4.6 L-3.4,-3.4 L-4.2,-7.2 L-1.8,-6.2 Z';
const MAPLE_VEINS = 'M0,8 L0,-8.5 M0,1 L7.2,-4 M0,1 L-7.2,-4 M0,2 L4.8,3 M0,2 L-4.8,3';
const ELM_BODY = 'M0,-10 C5,-6 6,2 0,8 C-6,2 -5,-6 0,-10 Z';
const ELM_VEINS = 'M0,11 L0,-8.5 M0,-3 L3,-5.5 M0,-3 L-3,-5.5 M0,1 L3.6,-1.4 M0,1 L-3.6,-1.4';

const MAX_LEAVES = 160;
const SPACING = 28; // px of cursor travel per leaf
const DRAG_SPACING = 12; // denser while a button / finger is held down
const GRAVITY = 140;
const TERMINAL_VY = 110;
const STROKE_GAP_MS = 150; // a pause this long starts a fresh trail

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Full-bleed canvas that sheds autumn leaves behind the cursor. */
export default function LeafTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const shapes: LeafShape[] = [
      { body: new Path2D(MAPLE_BODY), veins: new Path2D(MAPLE_VEINS) },
      { body: new Path2D(ELM_BODY), veins: new Path2D(ELM_VEINS) },
    ];

    const leaves: Leaf[] = [];
    let dpr = 1;
    let rect = canvas.getBoundingClientRect();
    let raf = 0;
    let lastFrame = 0;
    let pressed = false;
    let carry = 0;
    let last: { x: number; y: number; t: number } | null = null;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    const spawn = (x: number, y: number, cvx: number, cvy: number, big = pressed) => {
      const [front, back] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      leaves.push({
        x: x + rand(-6, 6),
        y: y + rand(-6, 6),
        vx: clamp(cvx * 0.12, -260, 260) + rand(-50, 50),
        vy: clamp(cvy * 0.12, -260, 260) + rand(-70, 10),
        rot: rand(0, Math.PI * 2),
        spin: rand(-3, 3),
        flip: rand(0, Math.PI * 2),
        flipSpeed: rand(2, 6) * (Math.random() < 0.5 ? -1 : 1),
        sway: rand(0, Math.PI * 2),
        swaySpeed: rand(1.5, 3),
        swayAmp: rand(20, 50),
        size: big ? rand(16, 26) : rand(12, 20),
        age: 0,
        life: rand(2.2, 3.6),
        shape: shapes[Math.random() < 0.6 ? 0 : 1],
        front,
        back,
      });
      if (leaves.length > MAX_LEAVES) leaves.splice(0, leaves.length - MAX_LEAVES);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        l.age += dt;
        if (l.age >= l.life || l.y > rect.height + 30) {
          leaves.splice(i, 1);
          continue;
        }

        l.vy = Math.min(l.vy + GRAVITY * dt, TERMINAL_VY);
        l.vx *= Math.exp(-1.6 * dt);
        l.sway += l.swaySpeed * dt;
        l.x += (l.vx + Math.sin(l.sway) * l.swayAmp) * dt;
        l.y += l.vy * dt;
        l.rot += l.spin * dt;
        l.flip += l.flipSpeed * dt;

        const fadeIn = Math.min(1, l.age / 0.2);
        const fadeOut = Math.min(1, (l.life - l.age) / 0.8);
        // cos(flip) squashes the leaf horizontally to fake a 3D tumble.
        const face = Math.cos(l.flip);
        const s = l.size / 20;

        ctx.globalAlpha = fadeIn * fadeOut * 0.95;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rot);
        ctx.scale(s * Math.max(0.12, Math.abs(face)), s);
        ctx.fillStyle = face >= 0 ? l.front : l.back;
        ctx.fill(l.shape.body);
        ctx.strokeStyle = 'rgba(60, 20, 0, 0.35)';
        ctx.lineWidth = 0.6;
        ctx.stroke(l.shape.veins);
      }
      ctx.globalAlpha = 1;

      raf = leaves.length ? requestAnimationFrame(frame) : 0;
    };

    const ensureLoop = () => {
      if (raf) return;
      lastFrame = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const trail = (clientX: number, clientY: number) => {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const now = performance.now();

      if (!last || now - last.t > STROKE_GAP_MS) {
        last = { x, y, t: now };
        carry = 0;
        return;
      }

      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist === 0) return;

      const secs = Math.max(16, now - last.t) / 1000;
      const spacing = pressed ? DRAG_SPACING : SPACING;
      // Drop leaves evenly along the segment, carrying leftover distance forward.
      let d = spacing - carry;
      let spawned = 0;
      while (d <= dist && spawned < 8) {
        spawn(last.x + (dx * d) / dist, last.y + (dy * d) / dist, dx / secs, dy / secs);
        d += spacing;
        spawned++;
      }
      carry = spawned === 8 ? 0 : dist - (d - spacing);
      last = { x, y, t: now };
      if (spawned) ensureLoop();
    };

    const burst = (clientX: number, clientY: number) => {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      for (let i = 0; i < 6; i++) {
        const angle = rand(-Math.PI, 0);
        const speed = rand(600, 1400);
        spawn(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, true);
      }
      ensureLoop();
    };

    const onPointerMove = (e: PointerEvent) => trail(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => {
      pressed = true;
      burst(e.clientX, e.clientY);
    };
    const onPointerUp = () => {
      pressed = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) trail(t.clientX, t.clientY);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-[60] w-full h-full pointer-events-none" />;
}
