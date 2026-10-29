import { useRef } from 'react';
import { X } from 'lucide-react';

type ImageDialogProps = { label: string; src: string; alt: string; caption: string };

/** A text link that opens a screenshot in a modal (Esc or the backdrop closes it). */
export default function ImageDialog({ label, src, alt, caption }: ImageDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
      >
        {label}
      </button>
      <dialog
        ref={dialogRef}
        className="image-dialog"
        aria-label={caption}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <figure className="relative">
          <img src={src} alt={alt} className="block w-full rounded-xl bg-white" />
          <figcaption className="mt-3 text-sm text-white/70">{caption}</figcaption>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            autoFocus
            className="glass-button absolute -top-3 -right-3 h-9 w-9"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </figure>
      </dialog>
    </>
  );
}
