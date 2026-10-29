/**
 * Site-wide interaction plumbing: pointer light on glass, rows and cards, and
 * page transitions in which the page title travels to its new position.
 */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Track the pointer over the element it is on, as --px/--py (and card tilt). */
export function installPointerLight() {
  let current: HTMLElement | null = null;

  const reset = (el: HTMLElement) => {
    el.style.removeProperty('--rx');
    el.style.removeProperty('--ry');
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const el = (event.target as Element | null)?.closest?.<HTMLElement>('.glass-button, .row, .tilt') ?? null;
    if (current && current !== el) reset(current);
    current = el;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    el.style.setProperty('--px', `${x}px`);
    el.style.setProperty('--py', `${y}px`);
    if (el.classList.contains('tilt') && !reducedMotion()) {
      el.style.setProperty('--rx', `${(y / rect.height - 0.5) * -5}deg`);
      el.style.setProperty('--ry', `${(x / rect.width - 0.5) * 6}deg`);
    }
  };
  const onLeave = () => current && reset(current);

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  return () => {
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
  };
}

// The title of the card or link just clicked, which becomes the next page's heading.
let clickedTitle: HTMLElement | null = null;

export function installTitleCapture() {
  const onClick = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest?.('a[href^="#/"]');
    clickedTitle = link?.querySelector<HTMLElement>('[data-vt-title]') ?? null;
  };
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}

const pageTitle = () => document.querySelector<HTMLElement>('[data-page-title]');

/**
 * Swap pages inside a View Transition. `update` must render the new page
 * synchronously (flushSync). Falls back to a plain update without support.
 */
export function transitionPage(update: () => void, { toHome }: { toHome: boolean }) {
  if (!('startViewTransition' in document) || reducedMotion()) {
    update();
    return;
  }
  const previous = pageTitle();
  // The hero headline stays with the hero; inner titles morph between pages.
  const source = clickedTitle ?? (previous && !previous.closest('.hero') ? previous : null);
  clickedTitle = null;
  if (source && !toHome) source.style.viewTransitionName = 'page-title';

  const transition = document.startViewTransition(() => {
    if (source) source.style.viewTransitionName = '';
    update();
    const next = pageTitle();
    if (next && !toHome && source) next.style.viewTransitionName = 'page-title';
  });
  transition.finished.finally(() => {
    const next = pageTitle();
    if (next) next.style.viewTransitionName = '';
  });
}

/** Animate rows into their new order when a list is filtered. */
export function transitionRows(update: () => void) {
  if (!('startViewTransition' in document) || reducedMotion()) {
    update();
    return;
  }
  const name = () =>
    document.querySelectorAll<HTMLElement>('[data-row-id]').forEach((el) => {
      el.style.viewTransitionName = `row-${el.dataset.rowId}`;
      el.style.setProperty('view-transition-class', 'row-move');
    });
  const clear = () =>
    document.querySelectorAll<HTMLElement>('[data-row-id]').forEach((el) => {
      el.style.viewTransitionName = '';
    });
  document.documentElement.classList.add('vt-rows');
  name();
  const transition = document.startViewTransition(() => {
    clear();
    update();
    name();
  });
  transition.finished.finally(() => {
    clear();
    document.documentElement.classList.remove('vt-rows');
  });
}
