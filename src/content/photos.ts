import heroAutumn from '../assets/hero-autumn.webp';
import heroWinter from '../assets/hero-winter.webp';
import hallOfLanguages from '../assets/found/hall-of-languages.webp';
import newhouseStudios from '../assets/found/newhouse-2-studios.webp';
import birdLibrary from '../assets/found/bird-library.webp';
import shawQuad from '../assets/found/shaw-quad.webp';
import newhouseSchool from '../assets/found/newhouse-school.webp';
import crouseCollege from '../assets/found/crouse-college.webp';
import wallCurlyHair from '../assets/wall/curly-hair.webp';
import wallGlasses from '../assets/wall/glasses.webp';
import wallGroupFlags from '../assets/wall/group-flags.webp';
import wallGuitar from '../assets/wall/guitar.webp';
import wallLeiSmile from '../assets/wall/lei-smile.webp';
import wallMaroonHoodie from '../assets/wall/maroon-hoodie.webp';
import wallPlaid from '../assets/wall/plaid.webp';
import wallRedEnvelope from '../assets/wall/red-envelope.webp';
import wallThreeFriends from '../assets/wall/three-friends.webp';
import wallTracksuit from '../assets/wall/tracksuit.webp';
import wallTropicalBooth from '../assets/wall/tropical-booth.webp';
import wallTwoFriends from '../assets/wall/two-friends.webp';
import wallTwoPlates from '../assets/wall/two-plates.webp';
import wallTwoSmiles from '../assets/wall/two-smiles.webp';
import wallWithChild from '../assets/wall/with-child.webp';
import wallYellowJersey from '../assets/wall/yellow-jersey.webp';

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

/** A polaroid's window: 4:5 portraits, 4:3 landscapes, 16:9 wide group shots. */
export type WallShape = 'portrait' | 'landscape' | 'wide';
export type WallPhoto = { id: string; src: string; alt: string; shape: WallShape };

export const WALL_CAPTION = 'International Food Festival, April 2025';

/**
 * The pinned photo wall behind "Find your people." on the homepage, from NHISA's
 * International Food Festival album. The wall fills its rows in this order, so
 * shapes alternate.
 */
export const WALL_PHOTOS: WallPhoto[] = [
  { id: 'lei-smile', src: wallLeiSmile, shape: 'portrait', alt: 'A student in a pink flower lei smiling at the festival' },
  { id: 'group-flags', src: wallGroupFlags, shape: 'wide', alt: 'Seven students holding small flags at their festival table' },
  { id: 'plaid', src: wallPlaid, shape: 'portrait', alt: 'A student in a plaid shirt smiling in front of carved masks' },
  { id: 'two-friends', src: wallTwoFriends, shape: 'landscape', alt: 'Two friends in front of a curtain of fairy lights' },
  { id: 'tracksuit', src: wallTracksuit, shape: 'portrait', alt: 'A student in a black and white track jacket laughing' },
  { id: 'guitar', src: wallGuitar, shape: 'landscape', alt: 'A guest playing acoustic guitar on stage' },
  { id: 'maroon-hoodie', src: wallMaroonHoodie, shape: 'portrait', alt: 'A student in a maroon hoodie smiling' },
  { id: 'three-friends', src: wallThreeFriends, shape: 'landscape', alt: 'Three friends standing together at the festival' },
  { id: 'red-envelope', src: wallRedEnvelope, shape: 'portrait', alt: 'A student holding a red envelope at a festival table' },
  { id: 'two-plates', src: wallTwoPlates, shape: 'wide', alt: 'Two students holding plates of festival food' },
  { id: 'curly-hair', src: wallCurlyHair, shape: 'portrait', alt: 'A student with curly hair tasting food' },
  { id: 'two-smiles', src: wallTwoSmiles, shape: 'landscape', alt: 'Two friends smiling side by side' },
  { id: 'yellow-jersey', src: wallYellowJersey, shape: 'portrait', alt: 'A student in a yellow football jersey holding a plate' },
  { id: 'with-child', src: wallWithChild, shape: 'landscape', alt: 'A guest carrying a small child through the crowd' },
  { id: 'tropical-booth', src: wallTropicalBooth, shape: 'portrait', alt: 'A student smiling at a booth decorated with palm leaves' },
  { id: 'glasses', src: wallGlasses, shape: 'portrait', alt: 'A student in glasses holding a snack' },
];
