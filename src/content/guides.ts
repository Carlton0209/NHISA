/** Long-form guide pages linked from Career Hub. */
export const GUIDES = [
  {
    slug: 'linkedin',
    title: 'LinkedIn',
    intro: 'LinkedIn is a professional networking platform where you can showcase your experience, connect with professionals, and explore internships and job opportunities.',
  },
  {
    slug: 'handshake',
    title: 'Handshake',
    intro: 'Handshake works a lot like LinkedIn, but it is built for students: employers there are looking specifically for university students and recent graduates.',
  },
  {
    slug: 'email-signature',
    title: 'Email Signature',
    intro: 'An email signature makes your emails look professional and helps recipients quickly find your name, role, and contact information.',
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
