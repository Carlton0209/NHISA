/**
 * Site-wide interaction plumbing: pointer light on glass buttons and rows, and
 * page transitions in which the page title travels to its new position.
 */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Track the pointer over the glass button or row it is on, as --px/--py. */
export function installPointerLight() {
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const el = (event.target as Element | null)?.closest?.<HTMLElement>('.glass-button, .row') ?? null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--px', `${event.clientX - rect.left}px`);
    el.style.setProperty('--py', `${event.clientY - rect.top}px`);
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  return () => window.removeEventListener('pointermove', onMove);
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
