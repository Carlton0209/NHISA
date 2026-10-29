/**
 * Outline glyphs that open each section, after the reference's division
 * marks: plain geometry in one stroke weight, never filled.
 */
export type GlyphName = 'stack' | 'rings' | 'grid' | 'horizon' | 'steps' | 'nodes' | 'pages' | 'orbit';

const SHAPES: Record<GlyphName, JSX.Element> = {
  // Four right triangles stepping down and to the right.
  stack: (
    <>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${6 + i * 7} ${30 + i * 4} L${30 + i * 7} ${6 + i * 4} V${30 + i * 4} Z`} />
      ))}
    </>
  ),
  // Three overlapping circles: people in common.
  rings: (
    <>
      <circle cx="19" cy="20" r="11" />
      <circle cx="33" cy="20" r="11" />
      <circle cx="26" cy="32" r="11" />
    </>
  ),
  // A three-by-three grid of squares.
  grid: (
    <>
      {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={7 + c * 13} y={7 + r * 13} width="9" height="9" />))}
    </>
  ),
  // A sun setting on a horizon: somewhere else.
  horizon: (
    <>
      <path d="M4 32 H48" />
      <path d="M12 32 A14 14 0 0 1 40 32" />
      <path d="M18 40 H34 M23 46 H29" />
    </>
  ),
  // A staircase, one step at a time.
  steps: <path d="M5 45 H15 V35 H25 V25 H35 V15 H47 V45 Z" />,
  // Three connected points.
  nodes: (
    <>
      <path d="M13 37 L26 13 L40 35 Z" />
      <circle cx="13" cy="37" r="5" style={{ fill: "var(--bg)" }} />
      <circle cx="26" cy="13" r="5" style={{ fill: "var(--bg)" }} />
      <circle cx="40" cy="35" r="5" style={{ fill: "var(--bg)" }} />
    </>
  ),
  // Stacked pages, offset.
  pages: (
    <>
      <rect x="16" y="6" width="26" height="32" />
      <rect x="11" y="11" width="26" height="32" style={{ fill: "var(--bg)" }} />
      <path d="M17 20 H31 M17 26 H31 M17 32 H26" />
    </>
  ),
  // A globe-like orbit around a centre.
  orbit: (
    <>
      <circle cx="26" cy="26" r="17" />
      <ellipse cx="26" cy="26" rx="7" ry="17" />
      <path d="M9 26 H43" />
    </>
  ),
};

export default function Glyph({ name, className = '' }: { name: GlyphName; className?: string }) {
  return (
    <svg viewBox="0 0 52 52" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" className={className} aria-hidden="true">
      {SHAPES[name]}
    </svg>
  );
}

/** Which glyph opens which section, by section id. */
export const SECTION_GLYPHS: Record<string, GlyphName> = {
  // Campus Resources
  academics: 'pages',
  international: 'orbit',
  'student-life': 'rings',
  'study-away': 'horizon',
  // Career Hub
  explore: 'orbit',
  profile: 'grid',
  opportunities: 'stack',
  applications: 'pages',
  interviews: 'rings',
  networking: 'nodes',
  // About
  mission: 'horizon',
  team: 'rings',
  'get-involved': 'steps',
  contact: 'nodes',
  // Alumni
  meet: 'grid',
  stories: 'pages',
  events: 'rings',
  // Guides
  start: 'steps',
  why: 'orbit',
  'first-steps': 'steps',
  'next-steps': 'stack',
  links: 'nodes',
  prompts: 'stack',
};
