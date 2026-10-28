import type { ResourceGroup, Topic } from './types';

export const JOB_TOPICS: Topic[] = [
  {
    slug: 'linkedin',
    title: 'LinkedIn',
    summary: 'Build a profile that shows who you are, then grow your network.',
    intro: 'LinkedIn is a professional networking platform where you can showcase your experience, connect with professionals, and explore internships and job opportunities.',
  },
  {
    slug: 'handshake',
    title: 'Handshake',
    summary: 'Set up the platform where employers recruit students directly.',
    intro: 'Handshake works a lot like LinkedIn, but it is built for students: employers there are looking specifically for university students and recent graduates.',
  },
  {
    slug: 'email-signature',
    title: 'Email Signature',
    summary: 'Make every email look professional in four short steps.',
    intro: 'An email signature makes your emails look professional and helps recipients quickly find your name, role, and contact information.',
  },
  {
    slug: 'job-search',
    title: 'Job Search',
    summary: 'Find openings, tailor applications and practice interviews.',
    intro: 'Where to look for internships and jobs, how to read what employers want, and how to prepare for the interview.',
  },
  {
    slug: 'career-planning',
    title: 'Career Planning',
    summary: 'Explore study away, AI career tools and personal branding.',
    intro: 'Explore where your career could go and present yourself well while you get there.',
  },
];

/** NHISA's long-form guides, kept as Google Docs. */
export const TOOLKITS = [
  {
    number: '01',
    name: 'The Job Search Playbook',
    intro: 'A six-part workbook covering career focus, target companies, employer research, networking, AI-assisted searching and an action plan, with quizzes and fill-in templates.',
    url: 'https://docs.google.com/document/d/1yoLkWUvhvyt1e5BOxqGNfis9jbZ2F3rVPjnRH14qQh8/edit',
  },
  {
    number: '02',
    name: 'Résumé & Cover Letter Toolkit',
    intro: 'Résumé structure, the Action Verb Formula, how to analyze a job description and how to write a cover letter, with examples you can follow.',
    url: 'https://docs.google.com/document/d/16hNXj4SUa4O6NvoiicBevIeECtKgbQAnS0oEtlcFhQE/edit',
  },
  {
    number: '03',
    name: 'Interview & Professional Outreach Toolkit',
    intro: 'The STAR method, common interview questions, networking emails and the mistakes to avoid, and how to write a thank-you email after an interview.',
    url: 'https://docs.google.com/document/d/1IQ1jwa-Nu8zZEHobZ5wt5b672_elTzLRhySQK3UIb9M/edit',
  },
];

export const LINKEDIN = {
  why: 'LinkedIn helps you build a professional presence, grow your network, and connect with career opportunities early.',
  setup: [
    'Open LinkedIn on your phone or computer.',
    'Sign up with your personal email.',
    'Follow the prompts to set up your profile.',
    'Share your profile link in GroupMe.',
    'Connect with your peers—you’re ready to go!',
  ],
  profile: [
    {
      title: 'Profile Photo & Banner',
      points: [
        'Choose a clear, well-lit photo with a simple background.',
        'Look professional and approachable while showing your personality.',
        'Use a banner that reflects your interests, work, or professional identity.',
      ],
    },
    {
      title: 'About',
      points: [
        'Introduce your major, current role, and professional interests.',
        'Highlight the skills or experiences that make you stand out.',
        'Explain the opportunities or career direction you’re pursuing.',
        'Keep it focused—avoid repeating your résumé.',
      ],
    },
    {
      title: 'Experience',
      points: [
        'Briefly explain each role and your main responsibilities.',
        'Use Action + Context + Result to describe your contributions.',
        'Connect relevant skills to each experience.',
        'Include work samples or project links when appropriate.',
      ],
    },
    {
      title: 'Education',
      points: [
        'Add your university, degree, major, and expected graduation date.',
        'Include relevant activities, student organizations, and academic projects.',
      ],
    },
    {
      title: 'Skills',
      points: [
        'List specific skills relevant to your career interests.',
        'Use clear terms, such as copywriting, video editing, or data analysis.',
        'Highlight skills you can demonstrate through your experiences.',
      ],
    },
  ],
  networking: [
    {
      title: 'Start with Your Community',
      points: [
        'Connect with classmates, student organization members, and people you meet at events.',
        'Reach out to alumni and professionals whose careers interest you.',
      ],
    },
    {
      title: 'Personalize Your Outreach',
      points: [
        'Briefly introduce yourself and explain why you’re reaching out.',
        'Mention a shared connection, event, or specific interest in their work.',
        'Keep your message short, friendly, and professional.',
      ],
    },
    {
      title: 'Ask to Learn',
      points: [
        'Ask a focused question about their role, industry, or career path.',
        'When appropriate, request a brief informational conversation.',
        'Focus on learning and building a relationship before asking for a referral.',
      ],
    },
    {
      title: 'Stay Connected',
      points: [
        'Thank people for their time and advice.',
        'Engage with their posts through thoughtful comments.',
        'Share relevant projects, achievements, or updates.',
        'Give people time to respond and avoid repeated messages.',
      ],
    },
  ],
  prompts: [
    {
      title: 'Improve Your LinkedIn Profile',
      body: 'Act as an experienced recruiter in [industry]. Help me write a clear, professional LinkedIn headline and About section based on my résumé, current profile, and career goals. Before drafting, ask questions to understand my interests, strengths, and future direction. Keep the language natural and accurate, and do not invent qualifications.',
      fields: ['Résumé: [paste here]', 'Current LinkedIn profile: [paste here]', 'Career goals: [add here]'],
    },
    {
      title: 'Understand a Job Description',
      body: 'Act as an experienced recruiter. Analyze the job description below and identify the most important skills, qualifications, and experiences. Separate required qualifications from preferred ones, and highlight relevant keywords. Based on my résumé, suggest what I should emphasize in my application and identify any gaps without inventing experience.',
      fields: ['Job description: [paste here]', 'Résumé: [paste here]'],
    },
  ],
};

export const HANDSHAKE = {
  why: [
    {
      title: 'A closed network',
      body: 'Employers on Handshake are specifically looking to hire university students and recent graduates.',
    },
    {
      title: 'Recruiters message you',
      body: 'If your profile is built right, recruiters reach out to you for coffee chats and info sessions.',
    },
    {
      title: 'Events posted here first',
      body: 'Campus recruiting events, virtual company tours and portfolio reviews often appear on Handshake before anywhere else.',
    },
  ],
  firstSteps: [
    { title: 'Log in', body: 'Sign in to Handshake with your Syracuse University account.' },
    { title: 'Upload your résumé', body: 'Handshake auto-fills your profile from it, which saves you about 20 minutes.' },
    { title: 'Lock in the basics', body: 'Add your graduation year, major, and GPA if it is strong. Recruiters filter by these exact fields.' },
  ],
  nextSteps: [
    { title: 'Follow employers', body: 'Follow the companies and agencies you want to work for, so their jobs and events reach you.' },
    { title: 'Set your intentions', body: 'Tell Handshake your job interests, the roles you want and where you want to work.' },
    {
      title: 'Turn on alerts',
      body: 'Save a search such as “Advertising Intern” in your target cities (NYC, Chicago, LA) so new jobs come straight to your inbox.',
    },
  ],
};

export const JOB_SEARCH: ResourceGroup[] = [
  {
    title: 'Where to look',
    intro: 'Start with Newhouse’s own career services, then widen the search.',
    items: [
      {
        name: 'Newhouse Career Development Center',
        intro: 'Get career advising, résumé and interview support, internship resources and news of career events.',
        url: 'https://newhouse.syracuse.edu/students/career-development-center/',
      },
      {
        name: 'Newhouse CDC Resources',
        intro: 'Internships and jobs, résumé and cover letter guides, interview prep, networking events, and one-on-one appointments with a career advisor.',
        url: 'https://resources.newhouse.syr.edu/cdc/',
      },
      {
        name: 'Interstride',
        intro: 'Search U.S. internships and jobs by visa and work authorization type, check employers’ H-1B sponsorship history and find international career resources.',
        url: 'https://www.interstride.com/syracuse/',
      },
      {
        name: 'Handshake',
        intro: 'Search internships and full-time roles, apply for campus jobs, sign up for career fairs and networking events, and connect with recruiters.',
        url: 'https://app.joinhandshake.com/home',
      },
      {
        name: 'CuseWorks',
        intro: 'Find part-time jobs on campus through Handshake, and check student employment policies, pay rates and internship funding.',
        url: 'https://experience.syracuse.edu/cuseworks/',
      },
      {
        name: 'Glassdoor Recruiter',
        intro: 'A free matching tool (beta) that recommends roles from your experience, preferences and salary goals. You choose whether recruiters can contact you.',
        url: 'https://www.glassdoor.com/recruiter',
      },
      {
        name: 'CareerShift',
        intro: 'Search job listings and find people at your target companies, including recruiters’ work emails, for networking and referrals.',
        url: 'https://www.careershift.com/Account/Login?ReturnUrl=%2fApp%2fContacts%2fSearch',
        note: 'Sign in with your SU email.',
      },
      {
        name: 'Weiss Center',
        intro: 'Newhouse’s center for industry practice and innovation, with projects and industry exchanges on AI, digital communication, influencer marketing and analytics.',
        url: 'https://newhouse.syracuse.edu/centers/weiss-center/',
      },
    ],
  },
  {
    title: 'Application strategy',
    intro: 'Read the job description the way a recruiter does, then tailor your materials to it.',
    items: [
      {
        name: 'Free Word Cloud Generator',
        intro: 'Paste in a job description to see which skills and requirements come up most, then tailor your résumé and cover letter to them.',
        url: 'https://www.freewordcloudgenerator.com/generatewordcloud',
      },
    ],
  },
  {
    title: 'Interview preparation',
    intro: 'Practice out loud before the real thing.',
    items: [
      {
        name: 'Yoodli',
        intro: 'Rehearse mock interviews, workplace conversations and presentations with an AI coach, and get personal feedback on how you speak.',
        url: 'https://yoodli.ai/',
      },
    ],
  },
];

export const CAREER_PLANNING: ResourceGroup[] = [
  {
    title: 'Career exploration',
    intro: 'Try a new city, a new tool or a new field before you commit to one.',
    items: [
      {
        name: 'SU Abroad: How to Apply',
        intro: 'Check deadlines, eligibility and application steps for semester, summer and short-term programs, and apply through OrangeAbroad.',
        url: 'https://suabroad.syr.edu/apply/',
      },
      {
        name: 'Otter.ai',
        intro: 'An AI meeting assistant with live transcription, meeting summaries and action items, handy for notes from informational interviews.',
        url: 'https://otter.ai/',
        note: 'Always ask before you record a conversation.',
      },
      {
        name: 'Gemini for Students',
        intro: 'Google’s AI tools for students to improve a résumé, practice interviews and explore careers. Eligible students get a free year of Google AI Pro.',
        url: 'https://gemini.google/students/',
      },
    ],
  },
  {
    title: 'Personal branding',
    intro: 'A consistent, professional image across every profile.',
    items: [
      {
        name: 'Iris Photo Booth',
        intro: 'Take a free, self-service professional headshot for LinkedIn, job platforms and other professional profiles.',
        url: 'https://www.syracuse.edu/campus-life/student-services/career-services/',
      },
    ],
  },
];
