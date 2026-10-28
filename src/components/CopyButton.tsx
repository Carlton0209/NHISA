import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

type CopyButtonProps = {
  text: string;
  /** Rich version for apps that keep formatting on paste, such as Outlook. */
  html?: string;
  label?: string;
};

async function copy(text: string, html?: string) {
  if (html && 'ClipboardItem' in window) {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' }),
      }),
    ]);
    return;
  }
  await navigator.clipboard.writeText(text);
}

export default function CopyButton({ text, html, label = 'Copy' }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const timer = window.setTimeout(() => setState('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <button
      type="button"
      onClick={() => copy(text, html).then(() => setState('copied'), () => setState('failed'))}
      className="glass-button px-4 py-2"
    >
      {state === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Couldn’t copy, select the text instead' : label}</span>
    </button>
  );
}
