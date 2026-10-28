import { useEffect, useRef } from 'react';

type Bundle = {
  y: number; // centre line, as a fraction of height
  tilt: number; // rise across the width, fraction of height
  lines: number;
  spread: number; // bundle thickness, fraction of height
  amp: number; // main wave amplitude, fraction of height
  waves: number; // main wave periods across the width
  speed: number;
  phase: number;
};

// Two silk-like bundles drifting in opposite directions.
const BUNDLES: Bundle[] = [
  { y: 0.2, tilt: 0.12, lines: 20, spread: 0.26, amp: 0.07, waves: 0.85, speed: 0.05, phase: 0 },
  { y: 0.52, tilt: -0.2, lines: 15, spread: 0.18, amp: 0.05, waves: 1.15, speed: -0.04, phase: 2.4 },
];

const FRAME_MS = 1000 / 30;

/** Dark night backdrop with faint, slowly flowing lines. */
export default function FlowLines({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;

    const draw = (time: number) => {
      const t = time / 1000;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#03060b');
      sky.addColorStop(0.6, '#08101b');
      sky.addColorStop(1, '#0d1726');
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      context.lineWidth = 1;
      const step = Math.max(8, width / 160);
      for (const b of BUNDLES) {
        for (let i = 0; i < b.lines; i++) {
          const k = i / (b.lines - 1) - 0.5;
          // Brightest through the middle of a bundle, fading at its edges.
          const alpha = 0.02 + 0.045 * (1 - Math.abs(k) * 2) ** 1.5;
          context.strokeStyle = `rgba(160, 186, 220, ${alpha.toFixed(3)})`;
          context.beginPath();
          for (let x = -step; x <= width + step; x += step) {
            const u = x / width;
            const breathe = 1 + 0.32 * Math.sin(u * 2.6 + t * b.speed * 5 + b.phase);
            const y = height * (
              b.y + b.tilt * u
              + k * b.spread * breathe
              + b.amp * Math.sin(u * b.waves * Math.PI * 2 + t * b.speed * 8 + b.phase + k * 0.9)
              + 0.018 * Math.sin(u * 7.3 - t * b.speed * 6 + k * 2.2)
            );
            if (x === -step) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
        }
      }
    };

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      if (time - last < FRAME_MS) return;
      last = time;
      draw(time);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (reducedMotion.matches || document.hidden) draw(0);
      else raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      draw(performance.now());
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    start();
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener('change', start);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', start);
      reducedMotion.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={canvasRef} className={`flow-lines ${className}`} aria-hidden="true" />;
}
