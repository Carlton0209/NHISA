/**
 * Alumni and professionals NHISA has met, one entry per coffee chat.
 *
 * To add someone, put their photo in src/assets/alumni/, import it here, and
 * add an entry. Only publish what they have agreed to share.
 *
 *   import mayaPhoto from '../assets/alumni/maya-chen.jpg';
 *   {
 *     id: 'maya-chen',            // becomes the page address: #/alumni/maya-chen
 *     name: 'Maya Chen',
 *     photo: mayaPhoto,
 *     photoAlt: 'Maya Chen smiling outside the Newhouse building',
 *     role: 'Brand Strategist',
 *     organization: 'Agency name',
 *     industry: 'Advertising',     // drives the filter on the photo wall
 *     location: 'New York, NY',
 *     program: 'M.S. Advertising',
 *     classOf: 2022,
 *     headline: 'A one-line quote from the chat.',
 *     intro: 'Two or three sentences introducing them.',
 *     questions: [{ question: 'How did you find your first job?', answer: '…' }],
 *     advice: 'Their advice for international students.',
 *     linkedin: 'https://www.linkedin.com/in/…',
 *     chatDate: '2026-11-04',
 *   }
 */
export const ALUMNI_SECTIONS = [
  { id: 'meet', label: 'Meet Alumni & Professionals' },
  { id: 'stories', label: 'Career Stories & Advice' },
  { id: 'events', label: 'Events & Coffee Chats' },
];

export type Alumnus = {
  id: string;
  name: string;
  photo: string;
  photoAlt: string;
  role: string;
  organization: string;
  industry: string;
  location: string;
  program: string;
  classOf: number;
  headline: string;
  intro: string;
  questions: { question: string; answer: string }[];
  advice?: string;
  linkedin?: string;
  chatDate?: string;
};

export const ALUMNI: Alumnus[] = [];

/** Upcoming coffee chats and events. Past dates are hidden automatically. */
export type ChatEvent = {
  id: string;
  title: string;
  /** ISO date, e.g. '2026-11-12'. */
  date: string;
  time?: string;
  location: string;
  description: string;
  signupUrl?: string;
};

export const EVENTS: ChatEvent[] = [];
