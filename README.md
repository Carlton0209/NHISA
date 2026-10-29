# NHISA website

Community and career resources for Newhouse international students and alumni.

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
| `#/` | Hero headline and mission over the campus photo (the cursor reveals the winter version), a flip-through module carousel, then each module with links into its sections |
| `#/campus` | Campus Resources: Academic & Advising, International Student Resources, Student Life & Support, Study Abroad & Study Away |
| `#/career-hub` | Career Hub: the job search in six steps, from Explore & Plan to Networking & Outreach |
| `#/career-hub/linkedin`, `/handshake`, `/email-signature` | Long-form guides; Email Signature has `/laptop`, `/phone` and `/sample` |
| `#/career-access` | The resource library: every resource, searchable and filterable by category |
| `#/alumni` | Alumni Connections: photo wall with an industry filter, stories and advice, events and coffee chats; each person has `#/alumni/<id>` |
| `#/about` | Mission, team, get involved, contact |

Routes are URL fragments, so deep links work under the GitHub Pages project path without rewrites. `?section=<id>` jumps to a section, e.g. `#/career-hub?section=interviews`. Addresses from the earlier site (`#/job/…`, `#/school/…`, `#/visa`, `#/photo-wall`, `#/community`) redirect to their new homes.

Navigation follows the brief's references: a slim top bar, the main sections in a floating bar at the bottom of the screen (Awwwards), and a footer with a line drawing on a ground line (Common App).

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

Other interactions live in `src/lib/interactions.ts`: pages change inside a View Transition (the clicked card's title travels into the next page's heading, the navigation bars stay put), glass buttons and list rows catch a highlight under the pointer, module cards tilt slightly, and the library re-flows its rows when filtered. Browsers without View Transitions simply switch pages.

Inner pages sit on a dark backdrop of faint, static lines drawn by `src/components/FlowLines.tsx`.
