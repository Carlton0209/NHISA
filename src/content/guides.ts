/** Long-form guide pages linked from Career Hub. */
export const GUIDES = [
  {
    slug: 'linkedin',
    title: 'LinkedIn',
    intro: 'Set up your account, polish your profile and start networking.',
  },
  {
    slug: 'handshake',
    title: 'Handshake',
    intro: 'Like LinkedIn, but built for students and recent graduates.',
  },
  {
    slug: 'email-signature',
    title: 'Email Signature',
    intro: 'Set one up in Outlook in four steps.',
  },
];

export const LINKEDIN = {
  why: 'It builds your professional presence and puts you in front of opportunities early.',
  setup: [
    'Open LinkedIn on your phone or computer.',
    'Sign up with your personal email.',
    'Follow the prompts to set up your profile.',
    'Share your profile link in GroupMe.',
    'Connect with your peers.',
  ],
  profile: [
    {
      title: 'Profile Photo & Banner',
      points: [
        'Use a clear, well-lit photo on a simple background.',
        'Look professional and approachable.',
        'Pick a banner that reflects your work or interests.',
      ],
    },
    {
      title: 'About',
      points: [
        'Introduce your major, role and interests.',
        'Highlight what makes you stand out.',
        'Say what you’re looking for next.',
        'Keep it focused; don’t repeat your résumé.',
      ],
    },
    {
      title: 'Experience',
      points: [
        'Sum up each role and what you did.',
        'Use Action + Context + Result.',
        'Tie relevant skills to each role.',
        'Link work samples where you can.',
      ],
    },
    {
      title: 'Education',
      points: [
        'Add your university, degree, major and graduation date.',
        'Include activities, organizations and projects.',
      ],
    },
    {
      title: 'Skills',
      points: [
        'List specific skills for your field, such as copywriting, video editing or data analysis.',
        'Favor skills your experience can prove.',
      ],
    },
  ],
  networking: [
    {
      title: 'Start with Your Community',
      points: [
        'Connect with classmates, club members and people you meet at events.',
        'Reach out to alumni and professionals whose careers interest you.',
      ],
    },
    {
      title: 'Personalize Your Outreach',
      points: [
        'Say who you are and why you’re writing.',
        'Mention a shared connection, event or interest in their work.',
        'Keep it short, friendly and professional.',
      ],
    },
    {
      title: 'Ask to Learn',
      points: [
        'Ask one focused question about their role or path.',
        'When it fits, ask for a short informational chat.',
        'Build the relationship before asking for a referral.',
      ],
    },
    {
      title: 'Stay Connected',
      points: [
        'Thank people for their time.',
        'Comment thoughtfully on their posts.',
        'Share your projects and updates.',
        'Give people time to reply; don’t keep following up.',
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
      body: 'Employers here are hiring students and recent graduates.',
    },
    {
      title: 'Recruiters message you',
      body: 'With a strong profile, recruiters invite you to chats and info sessions.',
    },
    {
      title: 'Events posted here first',
      body: 'Recruiting events, virtual tours and portfolio reviews often appear here first.',
    },
  ],
  firstSteps: [
    { title: 'Log in', body: 'Use your Syracuse University account.' },
    { title: 'Upload your résumé', body: 'Handshake fills in your profile from it, saving about 20 minutes.' },
    { title: 'Lock in the basics', body: 'Add your graduation year, major, and GPA if it’s strong. Recruiters filter by these.' },
  ],
  nextSteps: [
    { title: 'Follow employers', body: 'Follow the companies you want to work for to get their jobs and events.' },
    { title: 'Set your intentions', body: 'Tell Handshake the roles and places you want.' },
    {
      title: 'Turn on alerts',
      body: 'Save a search like “Advertising Intern” in NYC, Chicago or LA to get new jobs by email.',
    },
  ],
};
