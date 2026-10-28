import type { ResourceGroup, Topic } from './types';

export const SCHOOL_TOPICS: (Topic & { groups: ResourceGroup[] })[] = [
  {
    slug: 'community',
    title: 'Community',
    summary: 'Clubs, talks and the tools to promote your own events.',
    intro: 'Find your people at Newhouse, catch talks from industry professionals and get the word out about your own events.',
    groups: [
      {
        items: [
          {
            name: 'Extracurricular',
            intro: 'Find a club that fits you and meet people who share your interests.',
            url: 'https://newhouse.syracuse.edu/students/extracurricular/',
          },
          {
            name: 'Events',
            intro: 'Catch a talk with professionals from the industry.',
            url: 'https://newhouse.syracuse.edu/events/',
          },
          {
            name: 'Event Promotion Guide',
            intro: 'Get your event on school calendars, screens and social media.',
            url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/161644795/Event+Promotion',
            note: 'Official school events usually need coordination or approval before they are published.',
          },
          {
            name: 'Style Guide and Templates',
            intro: 'Make posters that match the Newhouse brand using ready templates.',
            url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/161644765/Style+Guide',
          },
        ],
      },
    ],
  },
  {
    slug: 'experience',
    title: 'Experience',
    summary: 'Hands-on studios, industry centers and semesters away.',
    intro: 'Work on real projects, learn from industry experts and spend a semester in a media capital while still earning credit.',
    groups: [
      {
        title: 'Centers and studios',
        items: [
          {
            name: 'Creator Crew',
            intro: 'Work on real social media and content projects with a student-run studio.',
            url: 'https://creatoreconomy.syracuse.edu/student-experience/creator-crew/',
          },
          {
            name: 'Weiss Center',
            intro: 'Learn AI, influencer marketing and analytics from industry experts and workshops.',
            url: 'https://newhouse.syracuse.edu/centers/weiss-center/',
          },
          {
            name: 'Centers and Special Programs',
            intro: 'Explore centers and programs to go deeper into the field you love.',
            url: 'https://newhouse.syracuse.edu/about/centers-and-special-programs/',
          },
        ],
      },
      {
        title: 'Study away',
        items: [
          {
            name: 'Study Abroad and Study Away',
            intro: 'Spend a semester or short term in another U.S. city and still earn credit.',
            url: 'https://www.syracuse.edu/academics/study-abroad-away/study-away/',
          },
          {
            name: 'Newhouse NYC',
            intro: 'Intern at media companies and build your network in New York.',
            url: 'https://www.syracuse.edu/academics/study-abroad-away/study-away/new-york-city/',
          },
          {
            name: 'Newhouse LA',
            intro: 'Kick-start a media career with a semester in Los Angeles.',
            url: 'https://newhouse.syracuse.edu/academics/study-abroad-away/newhouse-la',
          },
        ],
      },
    ],
  },
  {
    slug: 'academics',
    title: 'Academics',
    summary: 'Plan your degree, research projects and borrow production gear.',
    intro: 'Stay on track to graduate, find the right sources for your projects and get access to studios and equipment.',
    groups: [
      {
        title: 'Academic planning',
        items: [
          {
            name: 'Undergraduate Advising',
            intro: 'Get help planning courses and staying on track to graduate.',
            url: 'https://newhouse.syracuse.edu/students/academic-advising/',
          },
          {
            name: 'Graduate Advising',
            intro: 'Plan your graduate courses and get academic support.',
            url: 'https://newhouse.syracuse.edu/students/graduate-advising/',
          },
          {
            name: 'Undergraduate Guidebook',
            intro: 'Check exactly what your major requires.',
            url: 'https://guidebooks.newhouse.syr.edu/',
            note: 'Use the edition for the year you started.',
          },
          {
            name: 'Advising Directory',
            intro: 'Find the right advisor and book an appointment.',
            url: 'https://guidebooks.newhouse.syr.edu/guidebook/undergraduate-guidebook/advising-directory/',
          },
          {
            name: 'MySlice and Degree Works',
            intro: 'Register for classes, check grades and see how close you are to graduating.',
            url: 'https://myslice.syr.edu/',
          },
          {
            name: 'Academic Calendar',
            intro: 'Check deadlines for registration, add or drop, exams and graduation.',
            url: 'https://www.syracuse.edu/academics/calendars/academic-year/',
          },
        ],
      },
      {
        title: 'Research',
        items: [
          {
            name: 'Library Research Guides',
            intro: 'Browse subject guides to find the best databases and sources for your project.',
            url: 'https://researchguides.library.syr.edu/',
          },
          {
            name: 'Sage Research Methods',
            intro: 'Learn how to design surveys, interviews and focus groups for your project.',
            url: 'https://researchguides.library.syr.edu/comsyracuse/srmo',
          },
          {
            name: 'MRI Simmons',
            intro: 'Understand your target audience’s habits, brands and media use.',
            url: 'https://researchguides.library.syr.edu/advertising',
          },
          {
            name: 'Statista',
            intro: 'Grab quick industry and market statistics for your report.',
            url: 'https://library.syracuse.edu/databases/',
          },
          {
            name: 'Mintel Reports',
            intro: 'Spot consumer and market trends for your strategy.',
            url: 'https://library.syracuse.edu/databases/',
          },
          {
            name: 'WARC',
            intro: 'Study winning ad campaigns for inspiration.',
            url: 'https://library.syracuse.edu/databases/',
          },
        ],
      },
      {
        title: 'Production',
        items: [
          {
            name: 'Newhouse Facilities',
            intro: 'Discover the photo, film, broadcast and editing spaces you can use.',
            url: 'https://newhouse.syracuse.edu/about/facilities/',
          },
          {
            name: 'Creator Economy Venues and Resources',
            intro: 'Record a podcast or create content in the Center’s spaces.',
            url: 'https://creatoreconomy.syracuse.edu/student-experience/venues-and-resources-on-campus/',
            note: 'Some spaces are open only to students affiliated with the Center.',
          },
          {
            name: 'CAGE',
            intro: 'Borrow cameras, lights and audio gear.',
            links: [
              { label: 'Policies', url: 'https://newhouse.syr.edu/about/facilities/the-cage/newhouse-cage-equipment-loan-policy/' },
              { label: 'Training', url: 'https://video.syr.edu/channel/Newhouse+CAGE+-+Equipment+Training+Videos/176088541' },
              { label: 'Reserve', url: 'https://newhouse.getconnect2.com/' },
            ],
            note: 'Read the loan policy before your first reservation.',
          },
        ],
      },
    ],
  },
  {
    slug: 'it-support',
    title: 'IT Support',
    summary: 'Software licenses, printing and help when tech breaks.',
    intro: 'Get the software you need, print from anywhere and fix common problems, or reach Newhouse IT for help.',
    groups: [
      {
        items: [
          {
            name: 'NICS IT Support',
            intro: 'Fix common tech problems yourself, or email newhelp@syr.edu for help.',
            url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/161644628/Computing+and+Technology+Resources',
          },
          {
            name: 'Adobe Creative Cloud',
            intro: 'Get or renew your student Adobe license for your own computer.',
            url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/379617706/Adobe+Creative+Cloud+License+Activation',
          },
          {
            name: 'Windows 365',
            intro: 'Use a cloud Windows PC from your own device when your laptop falls short.',
            url: 'https://windows.cloud.microsoft/#/devices',
          },
          {
            name: 'Classroom Technology',
            intro: 'Connect your laptop to classroom screens and present with confidence.',
            url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/161644664/Classroom+Technology',
          },
          {
            name: 'Newhouse Training',
            intro: 'Build software and IT skills in short training sessions.',
            url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/161644696/Newhouse+Training',
          },
          {
            name: 'Printing Portal',
            intro: 'Find and release your print jobs.',
            url: 'https://printing.syr.edu/',
          },
          {
            name: 'Email to Print',
            intro: 'Print a PDF by emailing it to print@syr.edu, no setup needed.',
            url: 'https://su-jsm.atlassian.net/wiki/spaces/newh/pages/222888961/Newhouse+Email+to+Print',
          },
        ],
      },
    ],
  },
];
