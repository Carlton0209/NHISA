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
  'NHISA is a professional community and career resource hub for Newhouse international students and alumni. We make useful resources easier to find, and valuable people and opportunities easier to reach.';

export const AUDIENCES = [
  {
    title: 'Newhouse international students',
    body: 'Find internships and entry-level jobs, learn how the U.S. job search works, and meet people who have done it before you.',
  },
  {
    title: 'Alumni & industry professionals',
    body: 'Share your experience, offer career guidance, and open doors for the next class of Newhouse international students.',
  },
];

/** The problems NHISA exists to solve. */
export const PROBLEMS = [
  'Students don’t know where to look for internships and entry-level jobs that fit them.',
  'International students have few ways to connect with alumni and industry professionals.',
  'The U.S. job search—résumés, interviews, networking—works differently from what many of us know.',
  'Useful resources and real experience are scattered across different websites and social platforms.',
  'A new organization needs a professional home to show its value, attract members and build trust.',
];

export type ModuleTone = 'blue' | 'indigo' | 'violet' | 'slate' | 'gray';

export const MODULES: { id: string; title: string; short: string; path: string; tone: ModuleTone; summary: string }[] = [
  {
    id: 'campus',
    title: 'Campus Resources',
    short: 'Campus',
    path: '/campus',
    tone: 'blue',
    summary: 'Advising, international student services, student life and study away, gathered in one place.',
  },
  {
    id: 'career-hub',
    title: 'Career Hub',
    short: 'Careers',
    path: '/career-hub',
    tone: 'indigo',
    summary: 'Every step of the job search, from your first LinkedIn profile to the thank-you email after an interview.',
  },
  {
    id: 'career-access',
    title: 'Career Access',
    short: 'Library',
    path: '/career-access',
    tone: 'violet',
    summary: 'A searchable library of every resource on NHISA. Filter by what you need right now.',
  },
  {
    id: 'alumni',
    title: 'Alumni Connections',
    short: 'Alumni',
    path: '/alumni',
    tone: 'slate',
    summary: 'Meet Newhouse alumni and professionals through our coffee chats, and learn from their stories.',
  },
  {
    id: 'about',
    title: 'About Us',
    short: 'About',
    path: '/about',
    tone: 'gray',
    summary: 'Our mission, our team, and how to get involved.',
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
