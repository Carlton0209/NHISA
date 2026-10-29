import type { Section } from './types';

export const CAMPUS_SECTIONS: Section[] = [
  {
    id: 'academics',
    title: 'Academic & Advising',
    intro: 'Plan courses, check degree requirements and find your advisor. Research databases and production gear are here too.',
    groups: [
      { title: 'Advising & planning', ids: ['ug-advising', 'grad-advising', 'guidebook', 'advising-directory', 'myslice', 'academic-calendar'] },
      { title: 'Research', ids: ['library-guides', 'sage', 'mri', 'statista', 'mintel', 'warc'] },
      { title: 'Production & equipment', ids: ['facilities', 'creator-venues', 'cage'] },
    ],
  },
  {
    id: 'international',
    title: 'International Student Resources',
    intro: 'Stay in status and learn your work options. The Center for International Services is the official source.',
    groups: [
      { ids: ['cis', 'cis-status', 'cis-cpt', 'cis-opt', 'cis-stem', 'intl-job-seeking'] },
    ],
  },
  {
    id: 'student-life',
    title: 'Student Life & Support',
    intro: 'Clubs, talks, student studios and tech help.',
    groups: [
      { title: 'Clubs & events', ids: ['extracurricular', 'events', 'event-promotion', 'style-guide'] },
      { title: 'Hands-on experience', ids: ['creator-crew', 'weiss', 'centers'] },
      { title: 'Tech support', ids: ['nics', 'adobe', 'windows365', 'classroom-tech', 'nh-training', 'printing', 'email-print'] },
    ],
  },
  {
    id: 'study-away',
    title: 'Study Abroad & Study Away',
    intro: 'Spend a semester in a media capital or abroad and still earn credit.',
    groups: [{ ids: ['study-away', 'nh-nyc', 'nh-la', 'su-abroad-apply'] }],
  },
];
