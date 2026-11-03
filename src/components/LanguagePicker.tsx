import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Check, Languages } from 'lucide-react';
import { LANGUAGES, setLanguage, t, useLanguage, type Language } from '../lib/i18n';

/** Each language's name in the language the site is in now, e.g. "Japanese" or "日语". */
function namesIn(language: Language) {
  try {
    const names = new Intl.DisplayNames([language], { type: 'language' });
    return (code: Language) => names.of(code) ?? '';
  } catch {
    return () => '';
  }
}

/** The language button in the top bar: every language listed in itself, the current one checked. */
export default function LanguagePicker() {
  const language = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = LANGUAGES.find((l) => l.code === language)!;
  const nameOf = namesIn(language);

  useEffect(() => {
    if (!open) return;
    rootRef.current?.querySelector<HTMLElement>('[aria-current="true"]')?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const choose = (code: Language) => {
    close();
    if (code !== language) setLanguage(code).catch(() => {});
  };

  // Up and down move through the list; Escape closes it.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) return close();
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const options = [...(rootRef.current?.querySelectorAll<HTMLElement>('#language-menu button') ?? [])];
    if (!options.length) return;
    event.preventDefault();
    const at = options.indexOf(document.activeElement as HTMLElement);
    const next = at < 0 ? 0 : (at + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
    options[next].focus();
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={onKeyDown}
      // Tabbing out closes the list. Safari doesn't focus a button it clicks, so a blur with nowhere
      // to go is a click, and the click itself decides: a language, or outside (onPointer above).
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (open && next && !event.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="language-menu"
        aria-label={`${t('Language')}: ${current.name}`}
        title={t('Language')}
        className="glass-button h-10 min-w-10 gap-2 px-2.5 sm:px-4"
      >
        <Languages size={18} aria-hidden="true" />
        <span lang={current.code} className="hidden text-[0.9375rem] sm:inline">
          {current.name}
        </span>
      </button>

      {open && (
        <div id="language-menu" className="glass-dark absolute right-0 top-full mt-2 w-[min(17rem,calc(100vw-2rem))] rounded-2xl bg-night-900/95 p-2 text-white">
          <ul className="flex flex-col gap-0.5">
            {LANGUAGES.map((option) => {
              const selected = option.code === language;
              const here = nameOf(option.code);
              return (
                <li key={option.code}>
                  <button
                    type="button"
                    onClick={() => choose(option.code)}
                    aria-current={selected ? 'true' : undefined}
                    className={`flex w-full items-baseline justify-between gap-4 rounded-xl px-4 py-2 text-left transition-colors ${
                      selected ? 'bg-white/[0.12]' : 'text-white/80 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    <span lang={option.code} className="shrink-0 whitespace-nowrap text-[0.9375rem] font-medium">
                      {option.name}
                    </span>
                    {/* The current one is checked; the others are named in the site's language too. */}
                    {selected ? (
                      <Check size={16} aria-hidden="true" className="shrink-0 self-center" />
                    ) : (
                      here && here !== option.name && <span className="min-w-0 truncate text-[var(--step-small)] text-white/50">{here}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
