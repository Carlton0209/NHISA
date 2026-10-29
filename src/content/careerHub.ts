import type { Section } from './types';

/** The job search in order, from first plan to follow-up. */
export const CAREER_STEPS: Section[] = [
  {
    id: 'explore',
    title: 'Explore & Plan',
    intro: 'Know where you want to go before you apply. Start with a career advisor and the Job Search Playbook.',
    groups: [{ ids: ['cdc', 'cdc-resources', 'playbook', 'su-career-services', 'gemini'] }],
  },
  {
    id: 'profile',
    title: 'Build Your Profile',
    intro: 'Recruiters look you up first. Make your LinkedIn, headshot and signature tell one story.',
    groups: [{ ids: ['guide-linkedin', 'iris-photo', 'guide-email-signature'] }],
  },
  {
    id: 'opportunities',
    title: 'Find Opportunities',
    intro: 'Search where employers recruit students, and filter by work authorization.',
    groups: [{ ids: ['guide-handshake', 'handshake', 'interstride', 'careershift', 'cuseworks', 'glassdoor'] }],
  },
  {
    id: 'applications',
    title: 'Applications',
    intro: 'Tailor every résumé and cover letter to the job description.',
    groups: [{ ids: ['resume-toolkit', 'su-resume', 'word-cloud', 'ai-prompts'] }],
  },
  {
    id: 'interviews',
    title: 'Interviews',
    intro: 'Use the STAR method, practice out loud, and send a thank-you within a day.',
    groups: [{ ids: ['interview-toolkit', 'yoodli', 'cdc-interview-guide', 'su-interview'] }],
  },
  {
    id: 'networking',
    title: 'Networking & Outreach',
    intro: 'Most opportunities come through people. Ask to learn before you ask for a referral.',
    groups: [{ ids: ['guide-networking', 'interview-toolkit', 'su-network', 'otter'] }],
  },
];
