# NHISA website

The website of the Newhouse International Student Association (NHISA): career resources and community for Newhouse international students and alumni.

- **Website:** https://Carlton0209.github.io/NHISA/
- **Deployment history:** https://github.com/Carlton0209/NHISA/actions/workflows/deploy-pages.yml

## Run locally

Requires Node.js 22 or later.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks and writes the static site to dist/
```

Pushing to `main` builds the site and publishes `dist/` to GitHub Pages.

## Pages

The structure follows the NHISA site brief: three modules (international student support, alumni connections, career access) plus campus resources and about pages.

| Route | Content |
| --- | --- |
| `#/` | The campus photo turning from autumn to winter as you scroll, a short statement of what NHISA is, the five sections as a poster list, one chapter per module, who runs NHISA, and a closing call to the Career Hub |
| `#/campus` | Campus Resources: Academic & Advising, International Student Resources, Student Life & Support, Study Abroad & Study Away |
| `#/career-hub` | Career Hub: the job search in six steps, from Explore & Plan to Networking & Outreach |
| `#/career-hub/linkedin`, `/handshake`, `/email-signature` | Long-form guides; Email Signature has `/laptop`, `/phone` and `/sample` |
| `#/career-access` | The resource library: three common starting points, then every resource, searchable and filterable by category |
| `#/alumni` | Alumni Connections: photo wall with an industry filter, stories and advice, events and coffee chats; each person has `#/alumni/<id>` |
| `#/about` | Mission, team, get involved, contact |

Routes are URL fragments, so deep links work under the GitHub Pages project path without rewrites. `?section=<id>` jumps to a section, e.g. `#/career-hub?section=interviews`. Addresses from the earlier site (`#/job/…`, `#/school/…`, `#/visa`, `#/photo-wall`, `#/community`) redirect to their new homes.

The navigation is a transparent glass bar at the top right, which hides while you scroll down and switches to dark text over light sections. The footer builds the NHISA wordmark from five blocks, one per section colour, and keeps the small line drawing on a ground line (Common App).

## Edit content

All copy and links live in `src/content/`:

- `resources.ts`: every resource, once, with its category. Pages pick resources by id.
- `campus.ts` and `careerHub.ts`: which resources appear in each section or step, with each section's introduction
- `guides.ts`: the LinkedIn and Handshake guide text
- `email.ts`: Email Signature steps for laptop and phone, and the screenshots they open
- `alumni.ts`: alumni profiles and upcoming events. Both start empty; the file explains how to add someone.
- `site.ts`: mission, audiences and **contact details**. Fill in `CONTACT` (email, Instagram, LinkedIn, join form) before announcing the site; until then the Get involved and Contact sections say "coming soon".

The sample signature itself is in `src/pages/guides/EmailSignature.tsx`. The Outlook screenshots in `src/assets/email/` have the original account name and address replaced with placeholders.

## Hero and interactions

`src/assets/hero-autumn.webp` and `hero-winter.webp` must keep the same size and framing. The hero pins while you scroll and a soft snowline descends from the sky, turning autumn into winter (`src/components/RevealLayer.tsx`); with a mouse, a winter lens also follows the cursor. Visitors who prefer reduced motion get a still hero.

Other interactions live in `src/lib/interactions.ts`: pages change inside a View Transition (a section name clicked on the homepage travels into the next page's heading, the navigation stays put), glass buttons and list rows catch a highlight under the pointer, and the library re-flows its rows when filtered. Browsers without View Transitions simply switch pages.

Headings, rows and photographs rise into place as they enter the screen (`src/lib/reveal.ts`); with reduced motion they are simply there.

## Brand and type

The logo pairs Syracuse University's Block S (`src/components/Brand.tsx`, traced from the university's artwork and kept in its official orange, #F76900) with the NHISA wordmark; the browser tab icon (`public/favicon.svg`) redraws the Newhouse School’s own: the Block S over “Newhouse School” on Syracuse navy. University marks belong to Syracuse University and are not covered by this repository's code.

Text is set in General Sans (Fontshare). Each section has its own colour, used for its homepage chapter and its page header (`CHAPTERS` in `src/content/site.ts`): Campus Resources pale blue, Career Hub deep indigo, Career Access periwinkle, Alumni Connections slate, About Us grey. Everything else sits on the dark night ground, with glass reserved for the navigation and buttons.

## Photographs

`src/content/photos.ts` lists every photograph and where it is used: one at the top of each section's pages, and one beside most long sections. The two hero photographs are NHISA's own. The campus photographs in `src/assets/found/` come from Wikimedia Commons under CC BY-SA 4.0; `credits.json` records each title, photographer and source page, and the footer credits them. Keep that file in step when you add or replace a photograph.
