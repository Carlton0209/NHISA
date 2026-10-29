import { useEffect, useRef } from 'react';

type Bundle = {
  y: number; // centre line, as a fraction of height
  tilt: number; // rise across the width, fraction of height
  lines: number;
  spread: number; // bundle thickness, fraction of height
  amp: number; // main wave amplitude, fraction of height
  waves: number; // main wave periods across the width
  phase: number;
};

// Two silk-like bundles of curves.
const BUNDLES: Bundle[] = [
  { y: 0.2, tilt: 0.12, lines: 20, spread: 0.26, amp: 0.07, waves: 0.85, phase: 0 },
  { y: 0.52, tilt: -0.2, lines: 15, spread: 0.18, amp: 0.05, waves: 1.15, phase: 2.4 },
];

/** Dark night backdrop with faint, static flowing lines. Redrawn only on resize. */
export default function FlowLines({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#080a13');
      sky.addColorStop(0.6, '#0c0f1f');
      sky.addColorStop(1, '#12162b');
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      context.lineWidth = 1;
      const step = Math.max(8, width / 160);
      for (const b of BUNDLES) {
        for (let i = 0; i < b.lines; i++) {
          const k = i / (b.lines - 1) - 0.5;
          // Brightest through the middle of a bundle, fading at its edges.
          const alpha = 0.02 + 0.045 * (1 - Math.abs(k) * 2) ** 1.5;
          context.strokeStyle = `rgba(176, 182, 240, ${alpha.toFixed(3)})`;
          context.beginPath();
          for (let x = -step; x <= width + step; x += step) {
            const u = x / width;
            const breathe = 1 + 0.32 * Math.sin(u * 2.6 + b.phase);
            const y = height * (
              b.y + b.tilt * u
              + k * b.spread * breathe
              + b.amp * Math.sin(u * b.waves * Math.PI * 2 + b.phase + k * 0.9)
              + 0.018 * Math.sin(u * 7.3 + k * 2.2)
            );
            if (x === -step) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
        }
      }
    };

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return <canvas ref={canvasRef} className={`flow-lines ${className}`} aria-hidden="true" />;
}
