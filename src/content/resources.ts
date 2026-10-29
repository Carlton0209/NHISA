import type { Resource } from './types';

/**
 * Every resource on the site, keyed by id. Campus Resources and Career Hub
 * pick from it by id, and Career Access lists all of it.
 */
export const RESOURCES = {
  // ---------- Career services ----------
  cdc: {
    name: 'Newhouse Career Development Center',
    intro: 'Career advising, résumé and interview help, internships and events.',
    category: 'Career services',
    url: 'https://newhouse.syracuse.edu/students/career-development-center/',
  },
  'cdc-resources': {
    name: 'Newhouse CDC Resources',
    intro: 'Job listings, résumé guides, interview prep and one-on-one advising.',
    category: 'Career services',
    url: 'https://resources.newhouse.syr.edu/cdc/',
  },
  'su-career-services': {
    name: 'Syracuse University Career Services',
    intro: 'University-wide coaching, workshops and employer events.',
    category: 'Career services',
    url: 'https://careerservices.syr.edu/',
  },
  'su-resume': {
    name: 'Create a Résumé & Cover Letter',
    intro: 'Guides and templates from Career Services.',
    category: 'Career services',
    url: 'https://careerservices.syr.edu/channels/create-a-resume-cover-letter/',
  },
  'su-interview': {
    name: 'Prepare for an Interview',
    intro: 'Research the employer, answer common questions, follow up.',
    category: 'Career services',
    url: 'https://careerservices.syr.edu/channels/prepare-for-an-interview/',
  },
  'su-network': {
    name: 'Network',
    intro: 'Informational interviews, LinkedIn and building relationships.',
    category: 'Career services',
    url: 'https://careerservices.syr.edu/channels/network/',
  },
  'cdc-interview-guide': {
    name: 'The Interview (CDC guide)',
    intro: 'The CDC’s PDF on preparing, interviewing and following up.',
    category: 'Career services',
    url: 'https://resources.newhouse.syr.edu/cdc/wp-content/uploads/sites/5/2020/06/The-Interview-8.17-A.pdf',
  },
  weiss: {
    name: 'Weiss Center',
    intro: 'Workshops on AI, influencer marketing and analytics.',
    category: 'Career services',
    url: 'https://newhouse.syracuse.edu/centers/weiss-center/',
  },

  // ---------- Job & internship search ----------
  handshake: {
    name: 'Handshake',
    intro: 'Internships, full-time roles, campus jobs, career fairs and recruiters.',
    category: 'Job & internship search',
    url: 'https://app.joinhandshake.com/home',
  },
  interstride: {
    name: 'Interstride',
    intro: 'Search jobs by work authorization and check employers’ H-1B history.',
    category: 'Job & internship search',
    url: 'https://www.interstride.com/syracuse/',
  },
  careershift: {
    name: 'CareerShift',
    intro: 'Find jobs, and the people at your target companies with their work emails.',
    category: 'Job & internship search',
    url: 'https://www.careershift.com/Account/Login?ReturnUrl=%2fApp%2fContacts%2fSearch',
    note: 'Sign in with your SU email.',
  },
  cuseworks: {
    name: 'CuseWorks',
    intro: 'On-campus jobs, pay rates and internship funding.',
    category: 'Job & internship search',
    url: 'https://experience.syracuse.edu/cuseworks/',
  },
  glassdoor: {
    name: 'Glassdoor Recruiter',
    intro: 'A free tool (beta) that matches you to roles. You decide if recruiters can reach you.',
    category: 'Job & internship search',
    url: 'https://www.glassdoor.com/recruiter',
  },

  // ---------- Guides & toolkits ----------
  'guide-linkedin': {
    name: 'LinkedIn guide',
    intro: 'Setup, profile tips, networking and two AI prompts.',
    category: 'Guides & toolkits',
    path: '/career-hub/linkedin',
  },
  'guide-handshake': {
    name: 'Handshake guide',
    intro: 'Why it matters, setup, and how to make jobs come to you.',
    category: 'Guides & toolkits',
    path: '/career-hub/handshake',
  },
  'guide-email-signature': {
    name: 'Email signature guide',
    intro: 'Four steps in Outlook, plus a sample to copy.',
    category: 'Guides & toolkits',
    path: '/career-hub/email-signature',
  },
  'ai-prompts': {
    name: 'AI prompts for your profile and job descriptions',
    intro: 'One for your LinkedIn profile, one for reading a job description.',
    category: 'Guides & toolkits',
    path: '/career-hub/linkedin',
  },
  'guide-networking': {
    name: 'Networking & outreach tips',
    intro: 'Start close, personalize, ask to learn, stay in touch.',
    category: 'Guides & toolkits',
    path: '/career-hub/linkedin',
  },
  playbook: {
    name: 'The Job Search Playbook',
    intro: 'NHISA’s six-part workbook, from career focus to an action plan.',
    category: 'Guides & toolkits',
    url: 'https://docs.google.com/document/d/1yoLkWUvhvyt1e5BOxqGNfis9jbZ2F3rVPjnRH14qQh8/edit',
  },
  'resume-toolkit': {
    name: 'Résumé & Cover Letter Toolkit',
    intro: 'Résumé structure, action verbs and cover letters, with examples.',
    category: 'Guides & toolkits',
    url: 'https://docs.google.com/document/d/16hNXj4SUa4O6NvoiicBevIeECtKgbQAnS0oEtlcFhQE/edit',
  },
  'interview-toolkit': {
    name: 'Interview & Professional Outreach Toolkit',
    intro: 'The STAR method, common questions, outreach and thank-you emails.',
    category: 'Guides & toolkits',
    url: 'https://docs.google.com/document/d/1IQ1jwa-Nu8zZEHobZ5wt5b672_elTzLRhySQK3UIb9M/edit',
  },

  // ---------- AI & practice tools ----------
  gemini: {
    name: 'Gemini for Students',
    intro: 'Google’s AI for résumés, interview practice and career ideas. Eligible students get a free year of AI Pro.',
    category: 'AI & practice tools',
    url: 'https://gemini.google/students/',
  },
  yoodli: {
    name: 'Yoodli',
    intro: 'Rehearse interviews and presentations with an AI speaking coach.',
    category: 'AI & practice tools',
    url: 'https://yoodli.ai/',
  },
  otter: {
    name: 'Otter.ai',
    intro: 'Live transcripts and summaries of coffee chats and interviews.',
    category: 'AI & practice tools',
    url: 'https://otter.ai/',
    note: 'Ask before you record.',
  },
  'word-cloud': {
    name: 'Free Word Cloud Generator',
    intro: 'Paste a job description to see which skills come up most.',
    category: 'AI & practice tools',
    url: 'https://www.freewordcloudgenerator.com/generatewordcloud',
  },
  'iris-photo': {
    name: 'Iris Photo Booth',
    intro: 'A free, self-service headshot for your profiles.',
    category: 'Career services',
    url: 'https://www.syracuse.edu/campus-life/student-services/career-services/',
  },

  // ---------- International students ----------
  cis: {
    name: 'Center for International Services',
    intro: 'The official office for F-1 and J-1 students: advising, travel signatures, work authorization.',
    category: 'International students',
    url: 'https://experience.syracuse.edu/intercultural-collective/center-for-international-services/',
  },
  'cis-status': {
    name: 'Maintaining Your Status',
    intro: 'What to do each semester to keep your F-1 or J-1 status.',
    category: 'International students',
    url: 'https://experience.syracuse.edu/intercultural-collective/center-for-international-services/maintaining-status/',
  },
  'cis-cpt': {
    name: 'Curricular Practical Training (CPT)',
    intro: 'Work authorization for internships in your curriculum.',
    category: 'International students',
    url: 'https://experience.syracuse.edu/intercultural-collective/center-for-international-services/employment/curricular-practical-training/',
  },
  'cis-opt': {
    name: 'Optional Practical Training (OPT)',
    intro: 'Up to 12 months of work in your field, and when to apply.',
    category: 'International students',
    url: 'https://experience.syracuse.edu/intercultural-collective/center-for-international-services/employment/optional-practical-training/',
  },
  'cis-stem': {
    name: 'STEM OPT Extension',
    intro: 'A 24-month OPT extension for eligible STEM degrees.',
    category: 'International students',
    url: 'https://experience.syracuse.edu/intercultural-collective/center-for-international-services/employment/stem-extension/',
  },
  'intl-job-seeking': {
    name: 'Job Seeking for International Students',
    intro: 'Timelines, sponsorship questions and where to look.',
    category: 'International students',
    url: 'https://artsandsciences.syracuse.edu/student-success/international-student-success/job-seeking-for-international-students/',
  },

  // ---------- Academics ----------
  'ug-advising': {
    name: 'Undergraduate Advising',
    intro: 'Plan courses and stay on track to graduate.',
    category: 'Academics',
    url: 'https://newhouse.syracuse.edu/students/academic-advising/',
  },
  'grad-advising': {
    name: 'Graduate Advising',
    intro: 'Plan your graduate courses and get academic support.',
    category: 'Academics',
    url: 'https://newhouse.syracuse.edu/students/graduate-advising/',
  },
  guidebook: {
    name: 'Undergraduate Guidebook',
    intro: 'Check exactly what your major requires.',
    category: 'Academics',
    url: 'https://guidebooks.newhouse.syr.edu/',
    note: 'Use the edition for the year you started.',
  },
  'advising-directory': {
    name: 'Advising Directory',
    intro: 'Find the right advisor and book an appointment.',
    category: 'Academics',
    url: 'https://guidebooks.newhouse.syr.edu/guidebook/undergraduate-guidebook/advising-directory/',
  },
  myslice: {
    name: 'MySlice and Degree Works',
    intro: 'Register for classes, check grades and see how close you are to graduating.',
    category: 'Academics',
    url: 'https://myslice.syr.edu/',
  },
  'academic-calendar': {
    name: 'Academic Calendar',
    intro: 'Check deadlines for registration, add or drop, exams and graduation.',
    category: 'Academics',
    url: 'https://www.syracuse.edu/academics/calendars/academic-year/',
  },

  // ---------- Research ----------
  'library-guides': {
    name: 'Library Research Guides',
    intro: 'Find the best databases for your subject.',
    category: 'Research',
    url: 'https://researchguides.library.syr.edu/',
  },
  sage: {
    name: 'Sage Research Methods',
    intro: 'Design surveys, interviews and focus groups.',
    category: 'Research',
    url: 'https://researchguides.library.syr.edu/comsyracuse/srmo',
  },
  mri: {
    name: 'MRI Simmons',
    intro: 'Understand your target audience’s habits, brands and media use.',
    category: 'Research',
    url: 'https://researchguides.library.syr.edu/advertising',
  },
  statista: {
    name: 'Statista',
    intro: 'Grab quick industry and market statistics for your report.',
    category: 'Research',
    url: 'https://library.syracuse.edu/databases/',
  },
  mintel: {
    name: 'Mintel Reports',
    intro: 'Spot consumer and market trends for your strategy.',
    category: 'Research',
    url: 'https://library.syracuse.edu/databases/',
  },
  warc: {
    name: 'WARC',
    intro: 'Study winning ad campaigns for inspiration.',
    category: 'Research',
    url: 'https://library.syracuse.edu/databases/',
  },

  // ---------- Production & tech ----------
  facilities: {
    name: 'Newhouse Facilities',
    intro: 'Photo, film, broadcast and editing spaces you can use.',
    category: 'Production & tech',
    url: 'https://newhouse.syracuse.edu/about/facilities/',
  },
  'creator-venues': {
    name: 'Creator Economy Venues and Resources',
    intro: 'Record a podcast or create content in the Center’s spaces.',
    category: 'Production & tech',
    url: 'https://creatoreconomy.syracuse.edu/student-experience/venues-and-resources-on-campus/',
    note: 'Some spaces are for Center students only.',
  },
  cage: {
    name: 'CAGE',
    intro: 'Borrow cameras, lights and audio gear.',
    category: 'Production & tech',
    links: [
      { label: 'Policies', url: 'https://newhouse.syr.edu/about/facilities/the-cage/newhouse-cage-equipment-loan-policy/' },
      { label: 'Training', url: 'https://video.syr.edu/channel/Newhouse+CAGE+-+Equipment+Training+Videos/176088541' },
      { label: 'Reserve', url: 'https://newhouse.getconnect2.com/' },
    ],
    note: 'Read the loan policy before your first reservation.',
  },
  nics: {
    name: 'NICS IT Support',
    intro: 'Fix common tech problems yourself, or email newhelp@syr.edu for help.',
    category: 'Production & tech',
    url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/161644628/Computing+and+Technology+Resources',
  },
  adobe: {
    name: 'Adobe Creative Cloud',
    intro: 'Get or renew your student Adobe license for your own computer.',
    category: 'Production & tech',
    url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/379617706/Adobe+Creative+Cloud+License+Activation',
  },
  windows365: {
    name: 'Windows 365',
    intro: 'A cloud Windows PC on your own device.',
    category: 'Production & tech',
    url: 'https://windows.cloud.microsoft/#/devices',
  },
  'classroom-tech': {
    name: 'Classroom Technology',
    intro: 'Connect your laptop to classroom screens.',
    category: 'Production & tech',
    url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/161644664/Classroom+Technology',
  },
  'nh-training': {
    name: 'Newhouse Training',
    intro: 'Build software and IT skills in short training sessions.',
    category: 'Production & tech',
    url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/161644696/Newhouse+Training',
  },
  printing: {
    name: 'Printing Portal',
    intro: 'Find and release your print jobs.',
    category: 'Production & tech',
    url: 'https://printing.syr.edu/',
  },
  'email-print': {
    name: 'Email to Print',
    intro: 'Print a PDF by emailing it to print@syr.edu, no setup needed.',
    category: 'Production & tech',
    url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/222888961/Newhouse+Email+to+Print',
  },

  // ---------- Campus life ----------
  extracurricular: {
    name: 'Extracurricular',
    intro: 'Find a club and people who share your interests.',
    category: 'Campus life',
    url: 'https://newhouse.syracuse.edu/students/extracurricular/',
  },
  events: {
    name: 'Newhouse Events',
    intro: 'Catch a talk with professionals from the industry.',
    category: 'Campus life',
    url: 'https://newhouse.syracuse.edu/events/',
  },
  'event-promotion': {
    name: 'Event Promotion Guide',
    intro: 'Get your event on school calendars, screens and social media.',
    category: 'Campus life',
    url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/161644795/Event+Promotion',
    note: 'Official events usually need approval first.',
  },
  'style-guide': {
    name: 'Style Guide and Templates',
    intro: 'Templates for on-brand Newhouse posters.',
    category: 'Campus life',
    url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/161644765/Style+Guide',
  },
  'creator-crew': {
    name: 'Creator Crew',
    intro: 'Work on real social media and content projects with a student-run studio.',
    category: 'Campus life',
    url: 'https://creatoreconomy.syracuse.edu/student-experience/creator-crew/',
  },
  centers: {
    name: 'Centers and Special Programs',
    intro: 'Go deeper into your field.',
    category: 'Campus life',
    url: 'https://newhouse.syracuse.edu/about/centers-and-special-programs/',
  },

  // ---------- Study away ----------
  'study-away': {
    name: 'Study Abroad and Study Away',
    intro: 'Spend a semester away and still earn credit.',
    category: 'Study away',
    url: 'https://www.syracuse.edu/academics/study-abroad-away/study-away/',
  },
  'nh-nyc': {
    name: 'Newhouse NYC',
    intro: 'Intern at media companies and build your network in New York.',
    category: 'Study away',
    url: 'https://www.syracuse.edu/academics/study-abroad-away/study-away/new-york-city/',
  },
  'nh-la': {
    name: 'Newhouse LA',
    intro: 'Kick-start a media career with a semester in Los Angeles.',
    category: 'Study away',
    url: 'https://newhouse.syracuse.edu/academics/study-abroad-away/newhouse-la',
  },
  'su-abroad-apply': {
    name: 'SU Abroad: How to Apply',
    intro: 'Deadlines, eligibility and how to apply through OrangeAbroad.',
    category: 'Study away',
    url: 'https://suabroad.syr.edu/apply/',
  },
} satisfies Record<string, Resource>;

export type ResourceId = keyof typeof RESOURCES;

export const resource = (id: string): Resource => {
  const found = (RESOURCES as Record<string, Resource>)[id];
  if (!found) throw new Error(`Unknown resource: ${id}`);
  return found;
};
