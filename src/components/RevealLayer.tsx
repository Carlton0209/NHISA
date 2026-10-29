import { useEffect, useRef } from 'react';

type RevealLayerProps = {
  autumnImage: string;
  winterImage: string;
  radius?: number;
};

type Cursor = { x: number; y: number };

const SPOTLIGHT_STOPS: [number, number][] = [
  [0, 1], [0.4, 1], [0.6, 0.75], [0.75, 0.4], [0.88, 0.12], [1, 0],
];

async function loadPhoto(src: string) {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}

const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * The hero's season change. Scrolling through the hero lowers a soft snowline
 * from the sky, turning autumn into winter; the cursor opens a winter lens on
 * top. Both masks are combined into one before compositing, every frame.
 */
export default function RevealLayer({ autumnImage, winterImage, radius = 260 }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const hero = canvas?.closest<HTMLElement>('.hero');
    const track = canvas?.closest<HTMLElement>('.hero-track');
    if (!canvas || !context || !hero || !track) return;

    const maskCanvas = document.createElement('canvas');
    const winterBuffer = document.createElement('canvas');
    const mask = maskCanvas.getContext('2d');
    const buffer = winterBuffer.getContext('2d');
    if (!mask || !buffer) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let photos: [HTMLImageElement, HTMLImageElement] | null = null;
    let target: Cursor | null = null;
    let cursor: Cursor | null = null;
    let progress = 0;
    let bounds = canvas.getBoundingClientRect();
    let raf = 0;
    let disposed = false;

    const readProgress = () => {
      const rect = track.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      hero.style.setProperty('--p', progress.toFixed(4));
      hero.style.setProperty('--fade', smoothstep(0.36, 0.82, progress).toFixed(4));
    };

    const draw = () => {
      if (!photos) return;
      const [autumn, winter] = photos;
      const { width, height } = canvas;

      context.globalCompositeOperation = 'source-over';
      context.clearRect(0, 0, width, height);
      context.drawImage(autumn, 0, 0);

      const snow = smoothstep(0.04, 0.9, progress);
      const lens = cursor && bounds.width && bounds.height ? cursor : null;
      if (snow <= 0 && !lens) return;

      // One mask: the snowline (opaque above, feathered below) plus the lens.
      mask.globalCompositeOperation = 'source-over';
      mask.clearRect(0, 0, width, height);
      if (snow > 0) {
        const feather = height * 0.26;
        const line = snow * (height + feather);
        // Tilted gently: the line runs about 8% of the height higher on the right.
        const tilt = feather * ((height * 0.08) / width);
        const gradient = mask.createLinearGradient(0, line - feather, tilt, line);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        mask.fillStyle = gradient;
        mask.fillRect(0, 0, width, height);
      }
      if (lens) {
        // Match CSS object-fit: cover, including its crop on narrow viewports.
        const scale = Math.max(bounds.width / width, bounds.height / height);
        const x = (lens.x - bounds.left - (bounds.width - width * scale) / 2) / scale;
        const y = (lens.y - bounds.top - (bounds.height - height * scale) / 2) / scale;
        const r = radius / scale;
        const spot = mask.createRadialGradient(x, y, 0, x, y, r);
        SPOTLIGHT_STOPS.forEach(([offset, alpha]) => spot.addColorStop(offset, `rgba(0, 0, 0, ${alpha})`));
        mask.fillStyle = spot;
        mask.fillRect(x - r, y - r, r * 2, r * 2);
      }

      // Premultiplied blend A*(1-m) + W*m. Source-over would apply the
      // feather twice and leave a dark ring in the blend.
      context.globalCompositeOperation = 'destination-out';
      context.drawImage(maskCanvas, 0, 0);
      buffer.globalCompositeOperation = 'source-over';
      buffer.clearRect(0, 0, width, height);
      buffer.drawImage(winter, 0, 0);
      buffer.globalCompositeOperation = 'destination-in';
      buffer.drawImage(maskCanvas, 0, 0);
      context.globalCompositeOperation = 'lighter';
      context.drawImage(winterBuffer, 0, 0);
      context.globalCompositeOperation = 'source-over';
    };

    const tick = () => {
      raf = 0;
      if (target && cursor) {
        const dx = target.x - cursor.x;
        const dy = target.y - cursor.y;
        const settled = reducedMotion.matches || (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1);
        cursor = settled ? { ...target } : { x: cursor.x + dx * 0.14, y: cursor.y + dy * 0.14 };
        if (!settled) raf = requestAnimationFrame(tick);
      }
      draw();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      readProgress();
      bounds = canvas.getBoundingClientRect();
      schedule();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      target = { x: event.clientX, y: event.clientY };
      if (!cursor) cursor = { ...target };
      schedule();
    };

    const hide = () => {
      target = null;
      cursor = null;
      schedule();
    };

    const onVisibilityChange = () => {
      if (document.hidden) hide();
    };

    const resizeObserver = new ResizeObserver(() => {
      bounds = canvas.getBoundingClientRect();
      readProgress();
      schedule();
    });
    resizeObserver.observe(canvas);

    void Promise.all([loadPhoto(autumnImage), loadPhoto(winterImage)]).then(([autumn, winter]) => {
      if (disposed) return;
      photos = [autumn, winter];
      canvas.width = maskCanvas.width = winterBuffer.width = autumn.naturalWidth;
      canvas.height = maskCanvas.height = winterBuffer.height = autumn.naturalHeight;
      readProgress();
      draw();
      canvas.classList.add('is-ready');
    }).catch((error: unknown) => {
      if (!disposed) console.error('Unable to load campus scenery.', error);
    });

    readProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', hide);
    document.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', hide);
      document.removeEventListener('pointerleave', hide);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [autumnImage, winterImage, radius]);

  return <canvas ref={canvasRef} className="scenery" aria-hidden="true" />;
}
