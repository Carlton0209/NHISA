import heroAutumn from '../assets/hero-autumn.webp';
import heroWinter from '../assets/hero-winter.webp';
import hallOfLanguages from '../assets/found/hall-of-languages.webp';
import newhouseStudios from '../assets/found/newhouse-2-studios.webp';
import birdLibrary from '../assets/found/bird-library.webp';
import shawQuad from '../assets/found/shaw-quad.webp';
import newhouseSchool from '../assets/found/newhouse-school.webp';
import crouseCollege from '../assets/found/crouse-college.webp';

export type Photo = { src: string; alt: string; position?: string };

/** Every photograph on the site, with what it shows. Credits live in assets/found/credits.json. */
export const PHOTOS = {
  autumn: { src: heroAutumn, alt: 'The Newhouse building’s curved glass front behind autumn trees', position: '60% 50%' },
  winter: { src: heroWinter, alt: 'The Newhouse building and snow-covered trees in winter', position: '60% 50%' },
  hall: { src: hallOfLanguages, alt: 'The Hall of Languages, Syracuse University’s first building', position: '50% 40%' },
  studios: { src: newhouseStudios, alt: 'The glass front of the Dick Clark Studios in Newhouse 2', position: '40% 50%' },
  bird: { src: birdLibrary, alt: 'Bird Library, Syracuse University’s main library', position: '50% 8%' },
  quad: { src: shawQuad, alt: 'Students and alumni gathered under a tent on the Shaw Quad', position: '45% 50%' },
  school: { src: newhouseSchool, alt: 'The S.I. Newhouse School of Public Communications on a summer day', position: '50% 50%' },
  crouse: { src: crouseCollege, alt: 'Crouse College’s red stone tower above the hillside', position: '50% 45%' },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

/** The photograph at the top of each module's pages. */
export const HEADER_PHOTOS: Record<string, PhotoKey> = {
  campus: 'winter',
  'career-hub': 'studios',
  'career-access': 'bird',
  alumni: 'quad',
  about: 'crouse',
};

/** One photograph per section on Campus Resources and Career Hub. */
export const SECTION_PHOTOS: Record<string, PhotoKey> = {
  academics: 'hall',
  international: 'school',
  'student-life': 'quad',
  'study-away': 'crouse',
  explore: 'hall',
  profile: 'school',
  opportunities: 'quad',
  applications: 'bird',
  interviews: 'crouse',
  networking: 'autumn',
};
