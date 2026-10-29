import type { Section } from './types';

/** The job search in order, from first plan to follow-up. */
export const CAREER_STEPS: Section[] = [
  {
    id: 'explore',
    title: 'Explore & Plan',
    intro: 'Decide where you want to go before you start applying. Talk to a career advisor and work through the Job Search Playbook to find your focus.',
    groups: [{ ids: ['cdc', 'cdc-resources', 'playbook', 'su-career-services', 'gemini'] }],
  },
  {
    id: 'profile',
    title: 'Build Your Profile',
    intro: 'Recruiters look you up before they reply. Make your LinkedIn, headshot and email signature tell the same professional story.',
    groups: [{ ids: ['guide-linkedin', 'iris-photo', 'guide-email-signature'] }],
  },
  {
    id: 'opportunities',
    title: 'Find Opportunities',
    intro: 'Search where employers actively recruit students, and filter for roles that fit your work authorization.',
    groups: [{ ids: ['guide-handshake', 'handshake', 'interstride', 'careershift', 'cuseworks', 'glassdoor'] }],
  },
  {
    id: 'applications',
    title: 'Applications',
    intro: 'Tailor every résumé and cover letter to the job description. Recruiters can tell when you have read it closely.',
    groups: [{ ids: ['resume-toolkit', 'su-resume', 'word-cloud', 'ai-prompts'] }],
  },
  {
    id: 'interviews',
    title: 'Interviews',
    intro: 'Structure your answers with the STAR method, practice out loud, and send a thank-you email within a day.',
    groups: [{ ids: ['interview-toolkit', 'yoodli', 'cdc-interview-guide', 'su-interview'] }],
  },
  {
    id: 'networking',
    title: 'Networking & Outreach',
    intro: 'Most opportunities come through people. Reach out to alumni, ask to learn before you ask for a referral, and keep in touch.',
    groups: [{ ids: ['guide-networking', 'interview-toolkit', 'su-network', 'otter'] }],
  },
];
