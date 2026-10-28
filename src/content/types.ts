export type Link = { label: string; url: string };

/** One external site, with the one-line reason a student would open it. */
export type Resource = {
  name: string;
  intro: string;
  url?: string;
  /** Several destinations for one resource, e.g. CAGE policies, training, reserve. */
  links?: Link[];
  note?: string;
};

export type ResourceGroup = { title?: string; intro?: string; items: Resource[] };

export type Topic = {
  slug: string;
  title: string;
  summary: string;
  intro: string;
};
