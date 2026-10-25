# NHISA community website

A responsive English website for Newhouse international students and alumni, built from the supplied SU Slate Design System and the requirements in About website.docx.

## Preview

Run `npm run dev`, then visit http://localhost:5173. There are no production dependencies and no installation or compilation step. The distributable website is in `dist/`; it also works when served by any static hosting service.

## Pages and interactions

- Home: original editorial composition, real supplied campus photography, three program pathways.
- Student support: five career preparation steps, resource links, and a checklist saved on this browser.
- Alumni connections: a photographic wall with six fictional TEST profiles, working field filters, full interview pages, quotes, class/role/location facts, four questions per profile, and related profiles. The user explicitly requested filled test interviews to demonstrate the framework. All fictional entries and detail pages are clearly labeled TEST. Campus photos are illustrative and do not identify the fictional people. Replace these with permission-cleared profiles in `dist/data.js`; set `test: false` and `published: true` for actual published interviews.
- Career access: eight external resources with live local search, category filters, bookmarks, saved-resource view, and empty states. These are resource links rather than unverified job advertisements.
- About: community purpose and three priorities.
- Get involved: validated form that prepares an introduction locally. Copy and text-file download are implemented. There is no submission backend or membership database; nothing is transmitted by the form.
- Privacy and accessibility: storage explanation and an action to clear local data.

Routes use `#/support`, `#/alumni`, `#/careers`, etc., so all pages work on static hosting without rewrite rules. Profile routes use `#/alumni/profile/<id>`.

## Brand and design

- Navy `#000E54`, orange `#F76900`, accessible orange `#CD3E00`, white, and gray `#F7F7F8`.
- Local Sherman Sans and Sherman Serif fonts from the supplied archive.
- Official supplied outline icons and local campus photography, resized and encoded as WebP for web performance.
- Mostly square corners, fine borders, spacious grids, restrained motion, keyboard focus, reduced-motion support, and mobile navigation.
- The latest user instruction to follow the supplied color specification takes precedence over the early blue/purple/gray suggestion in the document.
- The Newhouse website inspired the academic character. Layout, community framing, content organization, and interactions are original.

## Content maintenance

Edit resources, interviews, and roadmap content in `dist/data.js`. Keep fictional material labeled TEST. Do not present fictitious people, interviews, testimonials, jobs, sponsors, statistics, or career outcomes as factual. Campus photography is contextual and is not represented as depicting the fictional interviewees or actual NHISA members.

The name NHISA is inferred from the selected project folder and the intended audience; the expanded organization name is provisional until confirmed by the organization. Contact and social account links were not invented.

## Validation

`npm run check` validates JavaScript syntax. `npm run build` checks data relationships, external URL formats, local asset references, and basic accessibility foundations. Visual browser verification is recorded separately when available.

## Deployment

The Sites project identity and static output directory are recorded in `.openai/hosting.json`. A new private Site is used so the preview does not change public sharing.
