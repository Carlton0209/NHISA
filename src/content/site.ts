/**
 * Who NHISA is for and how to reach it. Fill in CONTACT before announcing the
 * site: empty values hide their buttons and show "coming soon" instead.
 */
export const CONTACT = {
  email: '',
  instagram: '',
  linkedin: '',
  /** A sign-up form for new members, e.g. a Google Form. */
  joinForm: '',
};

export const MISSION =
  'The Newhouse International Student Association is a career community for Newhouse international students and alumni. We make resources easier to find, and people easier to reach.';

export const AUDIENCES = [
  {
    title: 'Newhouse international students',
    body: 'Find internships and jobs, learn the U.S. job search, and meet people who have done it.',
  },
  {
    title: 'Alumni & industry professionals',
    body: 'Share your experience and open doors for the next class.',
  },
];

/** The problems NHISA exists to solve. */
export const PROBLEMS = [
  'Students don’t know where to find internships and jobs that fit.',
  'International students have few ways to meet alumni and professionals.',
  'The U.S. job search works differently from what many of us know.',
  'Useful resources are scattered across many sites and platforms.',
  'A new organization needs a professional home to build trust.',
];

export type ModuleTone = 'blue' | 'indigo' | 'violet' | 'slate' | 'gray';

export const MODULES: { id: string; title: string; short: string; path: string; tone: ModuleTone; summary: string }[] = [
  {
    id: 'campus',
    title: 'Campus Resources',
    short: 'Campus',
    path: '/campus',
    tone: 'blue',
    summary: 'Advising, visas, student life and study away, in one place.',
  },
  {
    id: 'career-hub',
    title: 'Career Hub',
    short: 'Careers',
    path: '/career-hub',
    tone: 'indigo',
    summary: 'The job search step by step, from LinkedIn to the thank-you email.',
  },
  {
    id: 'career-access',
    title: 'Career Access',
    short: 'Library',
    path: '/career-access',
    tone: 'violet',
    summary: 'Every resource on NHISA, searchable.',
  },
  {
    id: 'alumni',
    title: 'Alumni Connections',
    short: 'Alumni',
    path: '/alumni',
    tone: 'slate',
    summary: 'Coffee chats and stories from Newhouse alumni and professionals.',
  },
  {
    id: 'about',
    title: 'About Us',
    short: 'About',
    path: '/about',
    tone: 'gray',
    summary: 'Our mission, team and how to get involved.',
  },
];

/**
 * Each module is a colour chapter: the same field on the homepage, at the top
 * of its own pages, and in the footer's block wordmark.
 */
export const CHAPTERS: Record<string, { field: string; light: boolean }> = {
  campus: { field: 'field-campus', light: true },
  'career-hub': { field: 'field-careers', light: false },
  'career-access': { field: 'field-library', light: true },
  alumni: { field: 'field-alumni', light: false },
  about: { field: 'field-about', light: true },
};

export const chapterFor = (path: string) => {
  const module = MODULES.find((m) => path === m.path || path.startsWith(`${m.path}/`));
  return module ? { id: module.id, ...CHAPTERS[module.id] } : null;
};
