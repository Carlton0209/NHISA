import type { Section } from './types';

/** The job search in order, from first plan to follow-up. */
export const CAREER_STEPS: Section[] = [
  {
    id: 'explore',
    title: 'Explore & Plan',
    intro: 'Know where you want to go before you apply. Start with a career advisor and the Job Search Playbook.',
    groups: [
      {
        ids: ['playbook', 'cdc', 'su-career-services', 'semester-checklist', 'gemini'],
        ordered: true,
        intros: { playbook: 'Choose two roles to explore, identify the skills they ask for, and set one goal for this week.' },
      },
    ],
  },
  {
    id: 'profile',
    title: 'Build Your Profile',
    intro: 'Recruiters look you up first. Make your LinkedIn, headshot and signature tell one story.',
    groups: [{ ids: ['guide-linkedin', 'iris-photo', 'guide-email-signature', 'resume-basics'] }],
    tips: [
      {
        title: 'Portfolio & Work Samples',
        points: [
          'Pick 2–3 course or personal projects that show the work you want to do.',
          'For each one, write down the goal, your own contribution and the result.',
        ],
      },
    ],
  },
  {
    id: 'opportunities',
    title: 'Find Opportunities',
    intro: 'Find internships and jobs, and explore employer sponsorship resources.',
    aside: 'cis-employment',
    groups: [{ ids: ['handshake-start', 'linkedin-jobs', 'interstride', 'careershift', 'cuseworks'] }],
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
