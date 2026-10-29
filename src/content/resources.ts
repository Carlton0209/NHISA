import type { Resource } from './types';

/**
 * Every resource on the site, keyed by id. Campus Resources and Career Hub
 * pick from it by id, and Career Access lists all of it.
 */
export const RESOURCES = {
  // ---------- Career services ----------
  cdc: {
    name: 'Newhouse Career Development Center',
    intro: 'Book career advising, get résumé and interview support, and find internships and career events.',
    category: 'Career services',
    url: 'https://newhouse.syracuse.edu/students/career-development-center/',
  },
  'cdc-resources': {
    name: 'Newhouse CDC Resources',
    intro: 'Internships and jobs, résumé and cover letter guides, interview prep, networking events, and one-on-one appointments with a career advisor.',
    category: 'Career services',
    url: 'https://resources.newhouse.syr.edu/cdc/',
  },
  'su-career-services': {
    name: 'Syracuse University Career Services',
    intro: 'University-wide career coaching, workshops and employer events, open to students in every school.',
    category: 'Career services',
    url: 'https://careerservices.syr.edu/',
  },
  'su-resume': {
    name: 'Create a Résumé & Cover Letter',
    intro: 'Career Services’ guides and templates for writing a résumé and cover letter.',
    category: 'Career services',
    url: 'https://careerservices.syr.edu/channels/create-a-resume-cover-letter/',
  },
  'su-interview': {
    name: 'Prepare for an Interview',
    intro: 'Career Services’ advice on researching employers, answering common questions and following up.',
    category: 'Career services',
    url: 'https://careerservices.syr.edu/channels/prepare-for-an-interview/',
  },
  'su-network': {
    name: 'Network',
    intro: 'Career Services’ guides to informational interviews, LinkedIn and building professional relationships.',
    category: 'Career services',
    url: 'https://careerservices.syr.edu/channels/network/',
  },
  'cdc-interview-guide': {
    name: 'The Interview (CDC guide)',
    intro: 'Newhouse CDC’s PDF on preparing for, handling and following up on an interview.',
    category: 'Career services',
    url: 'https://resources.newhouse.syr.edu/cdc/wp-content/uploads/sites/5/2020/06/The-Interview-8.17-A.pdf',
  },
  weiss: {
    name: 'Weiss Center',
    intro: 'Learn AI, influencer marketing and analytics from industry experts and workshops.',
    category: 'Career services',
    url: 'https://newhouse.syracuse.edu/centers/weiss-center/',
  },

  // ---------- Job & internship search ----------
  handshake: {
    name: 'Handshake',
    intro: 'Search internships and full-time roles, apply for campus jobs, sign up for career fairs and networking events, and connect with recruiters.',
    category: 'Job & internship search',
    url: 'https://app.joinhandshake.com/home',
  },
  interstride: {
    name: 'Interstride',
    intro: 'Search U.S. internships and jobs by visa and work authorization type, check employers’ H-1B sponsorship history and find international career resources.',
    category: 'Job & internship search',
    url: 'https://www.interstride.com/syracuse/',
  },
  careershift: {
    name: 'CareerShift',
    intro: 'Search job listings and find people at your target companies, including recruiters’ work emails, for networking and referrals.',
    category: 'Job & internship search',
    url: 'https://www.careershift.com/Account/Login?ReturnUrl=%2fApp%2fContacts%2fSearch',
    note: 'Sign in with your SU email.',
  },
  cuseworks: {
    name: 'CuseWorks',
    intro: 'Find part-time jobs on campus through Handshake, and check student employment policies, pay rates and internship funding.',
    category: 'Job & internship search',
    url: 'https://experience.syracuse.edu/cuseworks/',
  },
  glassdoor: {
    name: 'Glassdoor Recruiter',
    intro: 'A free matching tool (beta) that recommends roles from your experience, preferences and salary goals. You choose whether recruiters can contact you.',
    category: 'Job & internship search',
    url: 'https://www.glassdoor.com/recruiter',
  },

  // ---------- Guides & toolkits ----------
  'guide-linkedin': {
    name: 'LinkedIn guide',
    intro: 'Set up your account, optimize your profile and personal brand, network with intent, and use two AI prompts.',
    category: 'Guides & toolkits',
    path: '/career-hub/linkedin',
  },
  'guide-handshake': {
    name: 'Handshake guide',
    intro: 'Why Handshake matters, how to set up your account, and how to make the platform bring jobs to you.',
    category: 'Guides & toolkits',
    path: '/career-hub/handshake',
  },
  'guide-email-signature': {
    name: 'Email signature guide',
    intro: 'Four steps in Outlook on a laptop or phone, plus a sample signature to copy.',
    category: 'Guides & toolkits',
    path: '/career-hub/email-signature',
  },
  'ai-prompts': {
    name: 'AI prompts for your profile and job descriptions',
    intro: 'Two ready-to-use prompts: one improves your LinkedIn headline and About section, one breaks down a job description.',
    category: 'Guides & toolkits',
    path: '/career-hub/linkedin',
  },
  'guide-networking': {
    name: 'Networking & outreach tips',
    intro: 'Start with your own community, personalize every message, ask to learn before asking for a referral, and stay in touch.',
    category: 'Guides & toolkits',
    path: '/career-hub/linkedin',
  },
  playbook: {
    name: 'The Job Search Playbook',
    intro: 'NHISA’s six-part workbook: career focus, target companies, employer research, networking, AI-assisted searching and an action plan, with quizzes and templates.',
    category: 'Guides & toolkits',
    url: 'https://docs.google.com/document/d/1yoLkWUvhvyt1e5BOxqGNfis9jbZ2F3rVPjnRH14qQh8/edit',
  },
  'resume-toolkit': {
    name: 'Résumé & Cover Letter Toolkit',
    intro: 'NHISA’s guide to résumé structure, the Action Verb Formula, analyzing a job description and writing a cover letter, with examples.',
    category: 'Guides & toolkits',
    url: 'https://docs.google.com/document/d/16hNXj4SUa4O6NvoiicBevIeECtKgbQAnS0oEtlcFhQE/edit',
  },
  'interview-toolkit': {
    name: 'Interview & Professional Outreach Toolkit',
    intro: 'NHISA’s guide to the STAR method, common interview questions, networking emails and thank-you emails after an interview.',
    category: 'Guides & toolkits',
    url: 'https://docs.google.com/document/d/1IQ1jwa-Nu8zZEHobZ5wt5b672_elTzLRhySQK3UIb9M/edit',
  },

  // ---------- AI & practice tools ----------
  gemini: {
    name: 'Gemini for Students',
    intro: 'Google’s AI tools for students to improve a résumé, practice interviews and explore careers. Eligible students get a free year of Google AI Pro.',
    category: 'AI & practice tools',
    url: 'https://gemini.google/students/',
  },
  yoodli: {
    name: 'Yoodli',
    intro: 'Rehearse mock interviews, workplace conversations and presentations with an AI coach, and get personal feedback on how you speak.',
    category: 'AI & practice tools',
    url: 'https://yoodli.ai/',
  },
  otter: {
    name: 'Otter.ai',
    intro: 'An AI meeting assistant with live transcription, summaries and action items, handy for notes from coffee chats and informational interviews.',
    category: 'AI & practice tools',
    url: 'https://otter.ai/',
    note: 'Always ask before you record a conversation.',
  },
  'word-cloud': {
    name: 'Free Word Cloud Generator',
    intro: 'Paste in a job description to see which skills and requirements come up most, then tailor your résumé and cover letter to them.',
    category: 'AI & practice tools',
    url: 'https://www.freewordcloudgenerator.com/generatewordcloud',
  },
  'iris-photo': {
    name: 'Iris Photo Booth',
    intro: 'Take a free, self-service professional headshot for LinkedIn, Handshake and other professional profiles.',
    category: 'Career services',
    url: 'https://www.syracuse.edu/campus-life/student-services/career-services/',
  },

  // ---------- International students ----------
  cis: {
    name: 'Center for International Services',
    intro: 'Syracuse’s official office for F-1 and J-1 students: immigration advising, travel signatures and work authorization.',
    category: 'International students',
    url: 'https://experience.syracuse.edu/intercultural-collective/center-for-international-services/',
  },
  'cis-status': {
    name: 'Maintaining Your Status',
    intro: 'What you must do each semester to keep your F-1 or J-1 status, from enrollment to address updates.',
    category: 'International students',
    url: 'https://experience.syracuse.edu/intercultural-collective/center-for-international-services/maintaining-status/',
  },
  'cis-cpt': {
    name: 'Curricular Practical Training (CPT)',
    intro: 'Work authorization for internships that are part of your curriculum, and how to apply through CIS.',
    category: 'International students',
    url: 'https://experience.syracuse.edu/intercultural-collective/center-for-international-services/employment/curricular-practical-training/',
  },
  'cis-opt': {
    name: 'Optional Practical Training (OPT)',
    intro: 'Up to 12 months of work authorization in your field, before or after you graduate, and when to apply.',
    category: 'International students',
    url: 'https://experience.syracuse.edu/intercultural-collective/center-for-international-services/employment/optional-practical-training/',
  },
  'cis-stem': {
    name: 'STEM OPT Extension',
    intro: 'A 24-month extension of OPT for eligible STEM degrees, and the employer requirements that come with it.',
    category: 'International students',
    url: 'https://experience.syracuse.edu/intercultural-collective/center-for-international-services/employment/stem-extension/',
  },
  'intl-job-seeking': {
    name: 'Job Seeking for International Students',
    intro: 'A Syracuse guide to the U.S. job search when you need work authorization: timelines, sponsorship questions and where to look.',
    category: 'International students',
    url: 'https://artsandsciences.syracuse.edu/student-success/international-student-success/job-seeking-for-international-students/',
  },

  // ---------- Academics ----------
  'ug-advising': {
    name: 'Undergraduate Advising',
    intro: 'Get help planning courses and staying on track to graduate.',
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
    intro: 'Browse subject guides to find the best databases and sources for your project.',
    category: 'Research',
    url: 'https://researchguides.library.syr.edu/',
  },
  sage: {
    name: 'Sage Research Methods',
    intro: 'Learn how to design surveys, interviews and focus groups for your project.',
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
    intro: 'Discover the photo, film, broadcast and editing spaces you can use.',
    category: 'Production & tech',
    url: 'https://newhouse.syracuse.edu/about/facilities/',
  },
  'creator-venues': {
    name: 'Creator Economy Venues and Resources',
    intro: 'Record a podcast or create content in the Center’s spaces.',
    category: 'Production & tech',
    url: 'https://creatoreconomy.syracuse.edu/student-experience/venues-and-resources-on-campus/',
    note: 'Some spaces are open only to students affiliated with the Center.',
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
    intro: 'Use a cloud Windows PC from your own device when your laptop falls short.',
    category: 'Production & tech',
    url: 'https://windows.cloud.microsoft/#/devices',
  },
  'classroom-tech': {
    name: 'Classroom Technology',
    intro: 'Connect your laptop to classroom screens and present with confidence.',
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
    intro: 'Find a club that fits you and meet people who share your interests.',
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
    note: 'Official school events usually need coordination or approval before they are published.',
  },
  'style-guide': {
    name: 'Style Guide and Templates',
    intro: 'Make posters that match the Newhouse brand using ready templates.',
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
    intro: 'Explore centers and programs to go deeper into the field you love.',
    category: 'Campus life',
    url: 'https://newhouse.syracuse.edu/about/centers-and-special-programs/',
  },

  // ---------- Study away ----------
  'study-away': {
    name: 'Study Abroad and Study Away',
    intro: 'Spend a semester or short term in another U.S. city and still earn credit.',
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
    intro: 'Check deadlines, eligibility and application steps for semester, summer and short-term programs, and apply through OrangeAbroad.',
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
