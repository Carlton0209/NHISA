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
| `#/` | The campus photo turning from autumn to winter as you scroll, a pinboard of NHISA photos behind “Find your people.”, a short statement of what NHISA is, the five sections as a poster list, one chapter per module, who runs NHISA, and a closing call to the Career Hub |
| `#/campus` | Campus Resources: Academic & Advising, International Student Resources, Student Life & Support, Study Abroad & Study Away |
| `#/career-hub` | Career Hub: the job search in six steps, from Explore & Plan to Networking & Outreach |
| `#/career-hub/linkedin`, `/handshake`, `/email-signature` | Long-form guides; Email Signature has `/laptop`, `/phone` and `/sample` |
| `#/career-access` | The resource library: three common starting points, then every resource, searchable and filterable by category |
| `#/alumni` | Alumni Connections: photo wall with an industry filter, stories and advice, events and coffee chats; each person has `#/alumni/<id>` |
| `#/about` | Mission, team, get involved, contact |
| `#/wall/review` | Officers approve the photos visitors send to the homepage wall (not in the navigation; see Photo wall) |

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

## Photo wall

“Find your people.” on the homepage is a pinboard (`src/components/PhotoWall.tsx`): polaroids pinned at a tilt with Syracuse-orange pins, scattered around the heading and re-laid out for any screen size (a phone shows the nine that fit). Visitors can drag photos around (hold first on a touch screen), click one to see it larger, move a focused one with the arrow keys, and add their own with **Add your photo** or by dropping image files on the board. Added photos are cropped to a polaroid shape and shrunk before they are kept.

Where a visitor leaves things stays in their own browser, and the round-arrow button puts the photos back where they started.

### Visitors’ photos for everyone

Out of the box, photos a visitor adds stay in their own browser and nobody else sees them. Connect a Supabase project (the free tier is enough) and they go to NHISA’s officers instead:

- The visitor ticks a consent box (“Everyone in the photo is happy for it to be on the NHISA website”), passes an invisible Cloudflare Turnstile check, and sends the photo. It shows on their own wall with a **Waiting** tag; nobody else sees it yet.
- An officer approves it or turns it down at `#/wall/review`, which is not in the navigation. Officers sign in with a code emailed to them.
- Approved photos appear for everyone. The newest eight take the place of festival photos, alternating with them, so the wall keeps its sixteen and is at most half visitors’ photos; a phone shows the nine that fit.
- Visitors can take their own photo down from the same browser at any time, waiting or approved. Officers can take any photo down.
- If Supabase can’t be reached (for example, a free project paused after a week without visits), the wall shows the festival photos and says adding photos is paused.

The rules live in `supabase/schema.sql`. Waiting photos sit in a private bucket; a visitor can upload only into their own folder, only JPEGs of up to 1 MB, and have at most three waiting at once. Only officers listed in `wall_moderators` can see waiting photos, approve them, or put files in the public bucket. `src/lib/wall.ts` holds every Supabase call; the review page is `src/pages/WallReview.tsx`. The visitor’s browser shrinks each photo and drops its metadata (such as location) before sending.

**Setting it up**

1. Create a project at supabase.com, ideally under a shared NHISA account rather than one officer’s, so it outlives officer handovers. In **SQL Editor**, run `supabase/schema.sql`.
2. In **Authentication → Sign In / Providers**, turn on **anonymous sign-ins**. Leave email sign-in on.
3. In Cloudflare (free), add a **Turnstile** widget for `carlton0209.github.io` (and `localhost` for testing). In Supabase **Authentication → Attack Protection**, turn on captcha protection, choose Turnstile and paste the widget’s **secret key**.
4. In **Authentication → Emails**, edit the **Magic Link** template so it shows the code, for example `<p>Your NHISA sign-in code is <strong>{{ .Token }}</strong>.</p>`. The review page asks for the code; a sign-in link would clash with the site’s `#/` addresses.
5. For each officer, add a user in **Authentication → Users** with **Auto Confirm User** ticked (any password; they never use it), then run `insert into public.wall_moderators (email) values ('officer@syr.edu');` in SQL Editor, in lower case. Deleting the row takes review access away.
6. In the GitHub repository, under **Settings → Secrets and variables → Actions → Variables**, add `SUPABASE_URL` (the project URL), `SUPABASE_ANON_KEY` (the publishable or anon key) and `TURNSTILE_SITE_KEY`, then re-run the deploy (the `VITE_`-prefixed names work too). Each deploy's summary page shows a **Photo wall** note: “Shared wall on”, or a warning naming the variables it couldn’t find. These keys are public by design; the rules above protect the data. For `npm run dev`, put the same values in `.env.local` as `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_TURNSTILE_SITE_KEY`.

Supabase’s built-in email sender allows only a few emails an hour, which is enough for officer sign-ins; connect your own SMTP server in Supabase if it runs short. Fill in `CONTACT.email` in `src/content/site.ts` so the send dialog can give an address for takedown requests.

## Brand and type

The logo pairs Syracuse University's Block S (`src/components/Brand.tsx`, traced from the university's artwork and kept in its official orange, #F76900) with the NHISA wordmark; the browser tab icon (`public/favicon.svg`) redraws the Newhouse School’s own: the Block S over “Newhouse School” on Syracuse navy. University marks belong to Syracuse University and are not covered by this repository's code.

Text is set in General Sans (Fontshare). Each section has its own colour, used for its homepage chapter and its page header (`CHAPTERS` in `src/content/site.ts`): Campus Resources pale blue, Career Hub deep indigo, Career Access periwinkle, Alumni Connections slate, About Us grey. Everything else sits on the dark night ground, with glass reserved for the navigation and buttons.

## Photographs

`src/content/photos.ts` lists every photograph and where it is used: one at the top of each section's pages, and one beside most long sections. The two hero photographs are NHISA's own, and so are the sixteen on the photo wall (`src/assets/wall/`, listed in `WALL_PHOTOS`): frames from the International Food Festival album, April 2025, cropped to 4:5, 4:3 or 16:9 polaroid windows. Their order in the list is the order the wall fills its rows. The campus photographs in `src/assets/found/` come from Wikimedia Commons under CC BY-SA 4.0; `credits.json` records each title, photographer and source page, and the footer credits them. Keep that file in step when you add or replace a photograph.
