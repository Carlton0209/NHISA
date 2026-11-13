import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react';
import { CONTACT, MISSION } from '../content/site';
import { href, newTab } from '../lib/router';
import { t } from '../lib/i18n';
import painting from '../assets/about/newhouse-painted.webp';
import blueprint from '../assets/about/newhouse-blueprint.webp';
import walkers from '../assets/about/between-classes.webp';
import './about.css';

const emailLink = `mailto:${CONTACT.email}`;
const ways = [
  { title: 'Join as a student', body: 'Hear first about coffee chats, workshops and new resources.', url: CONTACT.joinForm || emailLink + '?subject=Joining%20NHISA' },
  { title: 'Offer a coffee chat', body: 'Share your experience and open doors for the next class.', url: emailLink + '?subject=Coffee%20chat%20with%20NHISA' },
  { title: 'Suggest a resource', body: 'Found something useful? We’ll add it to the library.', url: emailLink + '?subject=Resource%20suggestion%20for%20NHISA' },
];

export default function About({ path }: { path: string }) {
  const cover = useRef<HTMLElement>(null);
  const crossing = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = cover.current!;
    const scene = crossing.current!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const clamp = (n: number) => Math.min(1, Math.max(0, n));

    const draw = () => {
      frame = 0;
      if (motion.matches) return;
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom > 0) {
        const progress = clamp(-bounds.top / (bounds.height * 0.7));
        hero.style.setProperty('--wipe', `${progress * 126 - 16}%`);
      }
      const photo = scene.getBoundingClientRect();
      const progress = clamp((window.innerHeight - photo.top) / (window.innerHeight * 0.5 + photo.height * 0.35));
      scene.style.setProperty('--path-offset', String(1 - progress));
    };
    const schedule = () => { if (!frame && !motion.matches) frame = requestAnimationFrame(draw); };
    const moveLens = (event: PointerEvent) => {
      if (motion.matches || event.pointerType !== 'mouse') return;
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty('--lens-x', `${event.clientX - bounds.left}px`);
      hero.style.setProperty('--lens-y', `${event.clientY - bounds.top}px`);
      hero.classList.add('about-lens-active');
    };
    const hideLens = () => hero.classList.remove('about-lens-active');
    draw();
    hero.addEventListener('pointermove', moveLens);
    hero.addEventListener('pointerleave', hideLens);
    window.addEventListener('blur', hideLens);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', moveLens);
      hero.removeEventListener('pointerleave', hideLens);
      window.removeEventListener('blur', hideLens);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
    };
  }, []);

  return (
    <main id="main" className="about-story relative z-10">
      <header ref={cover} id="mission" className="about-cover" data-ink="dark">
        <img className="about-painting" src={painting} alt="" fetchPriority="high" />
        <div className="about-blueprint" style={{ backgroundImage: `url("${blueprint}")` }} aria-hidden="true" />
        <div className="about-cover-shade" />
        <div className="about-cover-copy about-inner">
          <div className="about-caption">{t('About Us')} <span aria-hidden="true">/</span> {t('Our mission')}</div>
          <h1 tabIndex={-1} data-page-title className="about-title">{t('Built by students')}</h1>
          <p className="about-mission">{t(MISSION)}</p>
          <nav aria-label={t('About Us')} className="about-cover-links">
            <a href={href(path, 'team')}>{t('Our team')} <ArrowDown size={16} /></a>
            <a href={href(path, 'get-involved')}>{t('Get involved')} <ArrowDown size={16} /></a>
            <a href={emailLink}>{t('Contact us')} <Mail size={16} /></a>
          </nav>
        </div>
      </header>

      <section id="team" aria-labelledby="team-title" className="about-team" data-ink="light">
        <div className="about-inner about-team-grid">
          <div>
            <h2 id="team-title" className="about-heading" data-reveal>{t('Our team')}</h2>
            <p className="about-team-copy" data-reveal="2">{t('NHISA is run by Newhouse international students.')}</p>
          </div>
          <div ref={crossing} className="about-crossing" aria-hidden="true">
            <img src={walkers} width="1200" height="748" alt="" loading="lazy" />
            <svg viewBox="0 0 1200 748" fill="none" strokeWidth="4" strokeLinecap="round">
              <path stroke="#dfe5ff" pathLength="1" d="M302 468 C420 500 520 520 600 522 C690 524 820 490 1250 396" />
              <path stroke="#f6cd98" pathLength="1" d="M930 478 C830 528 710 548 604 547 C500 546 360 574 -50 632" />
            </svg>
          </div>
        </div>
      </section>

      <section id="get-involved" className="about-involvement" data-ink="dark" aria-labelledby="involve-title">
        <div className="about-inner about-involve-grid">
          <h2 id="involve-title" className="about-heading" data-reveal>{t('Get involved')}</h2>
          <ul>
            {ways.map((way, i) => (
              <li key={way.title} data-reveal={i + 1}>
                <a className="about-way" href={way.url} {...newTab(way.url)}>
                  <span><strong>{t(way.title)}</strong><span>{t(way.body)}</span></span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div id="contact" className="about-inner about-contact">
          <a href={emailLink}><Mail size={20} aria-hidden="true" />{t('Contact us')}</a>
          <a href={emailLink}>{CONTACT.email}</a>
        </div>
      </section>
    </main>
  );
}
