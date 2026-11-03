import { cloneElement, createElement, Fragment, useSyncExternalStore, type ReactElement, type ReactNode } from 'react';

/**
 * The site in other languages. Everything is written in English; each other
 * language is a dictionary in src/locales/ from that English text to its
 * translation, downloaded only when a visitor picks it. Text a dictionary
 * lacks shows in English, so new text never breaks a page; `npm run i18n`
 * lists what each dictionary is missing.
 *
 * Text goes through t() where it is shown, not where it is defined, so a page
 * follows the visitor's language the moment they change it.
 */

/** Each language named in itself. */
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh-Hans', name: '简体中文' },
  { code: 'zh-Hant', name: '繁體中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'es', name: 'Español' },
] as const;

export type Language = (typeof LANGUAGES)[number]['code'];

/** A translation; for a count, one per plural category of the language (Intl.PluralRules). */
type Message = string | Partial<Record<Intl.LDMLPluralRule, string>>;
type Dictionary = Record<string, Message>;
type Vars = Record<string, string | number>;

const DICTIONARIES = import.meta.glob<Dictionary>('../locales/*.json', { import: 'default' });
const KEY = 'nhisa.language';

let language: Language = 'en';
let dictionary: Dictionary = {};
let rules = new Intl.PluralRules('en');
const listeners = new Set<() => void>();

const isLanguage = (code: unknown): code is Language => LANGUAGES.some((l) => l.code === code);

/** The address's ?lang=, else the language this browser picked last, else English. */
function chosen(): Language {
  const asked = new URLSearchParams(window.location.search).get('lang');
  if (isLanguage(asked)) return asked;
  try {
    const stored = localStorage.getItem(KEY);
    return isLanguage(stored) ? stored : 'en';
  } catch {
    return 'en';
  }
}

/** Show the site in `code`, once its dictionary has loaded, and remember the choice. */
export async function setLanguage(code: Language) {
  const next = code === 'en' ? {} : await DICTIONARIES[`../locales/${code}.json`]();
  language = code;
  dictionary = next;
  rules = new Intl.PluralRules(code);
  document.documentElement.lang = code;
  try {
    if (code === 'en') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, code);
  } catch {
    // Private windows may refuse; the address below still carries the choice.
  }
  // The address says the language too, so a copied link opens in it.
  const url = new URL(window.location.href);
  if (code === 'en') url.searchParams.delete('lang');
  else url.searchParams.set('lang', code);
  window.history.replaceState(window.history.state, '', url);
  listeners.forEach((listener) => listener());
}

/** Before the first render: the visitor's language, or English if its dictionary can't be fetched. */
export const startLanguage = () => setLanguage(chosen()).catch(() => setLanguage('en'));

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** The current language. Components that keep translated text in memos or effects list it as a dependency. */
export const useLanguage = () => useSyncExternalStore(subscribe, () => language);

/** The current language as a locale for Intl and toLocaleString. */
export const locale = () => language;

const fill = (text: string, vars?: Vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match)) : text;

// While developing, say once which texts the current language lacks.
const reported = new Set<string>();
const report = (text: string) => {
  if (!import.meta.env.DEV || language === 'en' || reported.has(`${language}:${text}`)) return;
  reported.add(`${language}:${text}`);
  console.warn(`[i18n] No ${language} translation for: ${text}`);
};

const lookup = (text: string) => {
  const found = dictionary[text];
  if (found === undefined) report(text);
  return typeof found === 'string' ? found : text;
};

/** `text` in the visitor's language, its {name} placeholders filled from `vars`. */
export const t = (text: string, vars?: Vars) => fill(lookup(text), vars);

/** A count, `n`, in a sentence. `forms` are the English singular and plural; the plural is the dictionary key. */
export function plural(n: number, forms: { one: string; other: string }, vars?: Vars) {
  const found = dictionary[forms.other];
  if (found === undefined) report(forms.other);
  const text =
    found === undefined
      ? n === 1
        ? forms.one
        : forms.other
      : typeof found === 'string'
        ? found
        : (found[rules.select(n)] ?? found.other ?? forms.other);
  return fill(text, { n, ...vars });
}

/**
 * Text with elements in it, such as a link mid-sentence. <0>…</0> wraps the
 * words that become parts[0]'s content; <0/> places parts[0] as it is.
 */
export function rich(text: string, parts: ReactElement[], vars?: Vars): ReactNode {
  const source = lookup(text);
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of source.matchAll(/<(\d+)>(.*?)<\/\1>|<(\d+)\/>/g)) {
    nodes.push(fill(source.slice(last, match.index), vars));
    const part = parts[Number(match[1] ?? match[3])];
    const words = match[1] === undefined ? undefined : fill(match[2], vars);
    nodes.push(part ? (words === undefined ? part : cloneElement(part, undefined, words)) : words);
    last = match.index! + match[0].length;
  }
  nodes.push(fill(source.slice(last), vars));
  return createElement(Fragment, null, ...nodes);
}
