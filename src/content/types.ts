/** One button of a resource: an external site (url) or a page on this site (path). */
export type Link = { label: string; url?: string; path?: string };

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
  /** A page on this site, e.g. '/career-hub/linkedin', or one of its sections, e.g. '/career-hub/linkedin?section=profile'. */
  path?: string;
  /** Several destinations for one resource, e.g. CAGE policies, training, reserve. */
  links?: Link[];
  note?: string;
  /** Left out of the Career Access library when another resource there already covers it. */
  hideInLibrary?: boolean;
};

export type ResourceGroup = {
  title?: string;
  ids: string[];
  /** A different line for some rows in this group only, by resource id; elsewhere they keep their own. */
  intros?: Record<string, string>;
  /** Numbers the rows, for resources meant to be used in this order. */
  ordered?: boolean;
};

/** A short block of advice under a section's resources. */
export type Tip = { title: string; points: string[] };

/** A titled block of resources on Campus Resources or Career Hub. */
export type Section = {
  id: string;
  title: string;
  intro: string;
  /** A resource id shown beside the introduction, e.g. the official rules to check first. */
  aside?: string;
  groups: ResourceGroup[];
  tips?: Tip[];
};
