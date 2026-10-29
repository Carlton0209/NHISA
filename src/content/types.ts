export type Link = { label: string; url: string };

export type Category =
  | 'Career services'
  | 'Job & internship search'
  | 'Guides & toolkits'
  | 'AI & practice tools'
  | 'International students'
  | 'Academics'
  | 'Research'
  | 'Production & tech'
  | 'Campus life'
  | 'Study away';

/** One resource, with the one-line reason a student would open it. */
export type Resource = {
  name: string;
  intro: string;
  category: Category;
  /** External site. */
  url?: string;
  /** A page on this site, e.g. '/career-hub/linkedin'. */
  path?: string;
  /** Several destinations for one resource, e.g. CAGE policies, training, reserve. */
  links?: Link[];
  note?: string;
};

export type ResourceGroup = { title?: string; ids: string[] };

/** A titled block of resources on Campus Resources or Career Hub. */
export type Section = {
  id: string;
  title: string;
  intro: string;
  groups: ResourceGroup[];
};
