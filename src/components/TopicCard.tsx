import { ArrowRight } from 'lucide-react';
import { href } from '../lib/router';

type TopicCardProps = { path: string; index: number; title: string; summary: string; meta?: string };

export default function TopicCard({ path, index, title, summary, meta }: TopicCardProps) {
  return (
    <a href={href(path)} className="card card-link group flex min-h-[13rem] flex-col">
      <span className="font-mono text-xs text-white/40">{String(index + 1).padStart(2, '0')}</span>
      <h3 className="mt-6 font-playfair italic text-3xl text-white">{title}</h3>
      <p className="mt-3 leading-relaxed text-white/65">{summary}</p>
      <span className="mt-auto flex items-center justify-between pt-6 text-sm text-white/45">
        <span>{meta}</span>
        <ArrowRight
          size={18}
          aria-hidden="true"
          className="text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-ember"
        />
      </span>
    </a>
  );
}
