/**
 * Entrances: mark the document as scripted (so hidden-until-revealed styles
 * apply only when this runs), then reveal [data-reveal] and .pic-in elements
 * once each as they enter the viewport, including those added by later pages.
 */
export function installReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  document.documentElement.classList.add('js');

  const pending = new Set<Element>();
  const show = (el: Element) => {
    el.classList.add('is-in');
    observer.unobserve(el);
    pending.delete(el);
  };
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && show(entry.target)),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  );
  const scan = () =>
    document.querySelectorAll('[data-reveal]:not(.is-in), .pic-in:not(.is-in)').forEach((el) => {
      if (pending.has(el)) return;
      pending.add(el);
      observer.observe(el);
    });
  scan();
  const mutations = new MutationObserver(scan);
  mutations.observe(document.getElementById('root')!, { childList: true, subtree: true });

  // A fast scroll or a jump can carry an element past the viewport between frames; show what is already above it.
  let frame = 0;
  const catchUp = () => {
    frame = 0;
    pending.forEach((el) => el.getBoundingClientRect().bottom < 0 && show(el));
  };
  const onScroll = () => {
    frame ||= requestAnimationFrame(catchUp);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    observer.disconnect();
    mutations.disconnect();
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(frame);
    document.documentElement.classList.remove('js');
  };
}

/** Is the chapter currently under `y` (px from the top) a light field? */
export function lightUnder(y: number) {
  const el = document.elementsFromPoint(window.innerWidth / 2, y).find((e) => (e as HTMLElement).dataset?.ink);
  return (el as HTMLElement | undefined)?.dataset.ink === 'light';
}
