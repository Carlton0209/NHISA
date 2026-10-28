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

/** The photographs ship pre-matted (transparent sky), so they only need decoding. */
async function loadCutout(src: string) {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}

/** Mix the two foregrounds in one canvas, above a single independent sky. */
export default function RevealLayer({ autumnImage, winterImage, radius = 260 }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const winterBuffer = document.createElement('canvas');
    const bufferContext = winterBuffer.getContext('2d');
    if (!bufferContext) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let photos: [HTMLImageElement, HTMLImageElement] | null = null;
    let target: Cursor | null = null;
    let cursor: Cursor | null = null;
    let bounds = canvas.getBoundingClientRect();
    let raf = 0;
    let disposed = false;

    const draw = () => {
      if (!photos) return;
      const [autumn, winter] = photos;
      const { width, height } = canvas;

      context.globalCompositeOperation = 'source-over';
      context.clearRect(0, 0, width, height);
      context.drawImage(autumn, 0, 0);
      if (!cursor || !bounds.width || !bounds.height) return;

      // Match CSS object-fit: cover, including its crop on narrow viewports.
      const scale = Math.max(bounds.width / width, bounds.height / height);
      const x = (cursor.x - bounds.left - (bounds.width - width * scale) / 2) / scale;
      const y = (cursor.y - bounds.top - (bounds.height - height * scale) / 2) / scale;
      const r = radius / scale;
      const left = Math.max(0, Math.floor(x - r));
      const top = Math.max(0, Math.floor(y - r));
      const w = Math.min(width, Math.ceil(x + r)) - left;
      const h = Math.min(height, Math.ceil(y + r)) - top;
      if (w <= 0 || h <= 0) return;

      const mask = context.createRadialGradient(x, y, 0, x, y, r);
      SPOTLIGHT_STOPS.forEach(([offset, alpha]) => {
        mask.addColorStop(offset, `rgba(0, 0, 0, ${alpha})`);
      });

      // Both operations finish in this frame; no CSS mask or second animated
      // sky is involved. Sky pixels remain transparent through the whole mix.
      context.globalCompositeOperation = 'destination-out';
      context.fillStyle = mask;
      context.fillRect(left, top, w, h);

      bufferContext.globalCompositeOperation = 'source-over';
      bufferContext.clearRect(0, 0, width, height);
      bufferContext.drawImage(winter, left, top, w, h, left, top, w, h);
      bufferContext.globalCompositeOperation = 'destination-in';
      bufferContext.fillStyle = mask;
      bufferContext.fillRect(0, 0, width, height);

      // Add premultiplied contributions A*(1-mask) + W*mask. Source-over
      // would apply the feather twice and leak the sky through opaque scenery.
      context.globalCompositeOperation = 'lighter';
      context.drawImage(winterBuffer, 0, 0);
      context.globalCompositeOperation = 'source-over';
    };

    const tick = () => {
      raf = 0;
      if (!target || !cursor) return;
      const dx = target.x - cursor.x;
      const dy = target.y - cursor.y;
      const settled = reducedMotion.matches || (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1);
      cursor = settled
        ? { ...target }
        : { x: cursor.x + dx * 0.14, y: cursor.y + dy * 0.14 };
      draw();
      if (!settled) raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      target = { x: event.clientX, y: event.clientY };
      if (!cursor) cursor = { ...target };
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const hide = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      target = null;
      cursor = null;
      draw();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') hide();
    };

    const onVisibilityChange = () => {
      if (document.hidden) hide();
    };

    const resizeObserver = new ResizeObserver(() => {
      bounds = canvas.getBoundingClientRect();
      draw();
    });
    resizeObserver.observe(canvas);

    void Promise.all([loadCutout(autumnImage), loadCutout(winterImage)]).then(([autumn, winter]) => {
      if (disposed) return;
      photos = [autumn, winter];
      canvas.width = winterBuffer.width = autumn.naturalWidth;
      canvas.height = winterBuffer.height = autumn.naturalHeight;
      draw();
      canvas.classList.add('is-ready');
    }).catch((error: unknown) => {
      if (!disposed) console.error('Unable to load campus scenery.', error);
    });

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', hide);
    window.addEventListener('blur', hide);
    document.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', hide);
      window.removeEventListener('blur', hide);
      document.removeEventListener('pointerleave', hide);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [autumnImage, winterImage, radius]);

  return <canvas ref={canvasRef} className="scenery" aria-hidden="true" />;
}
