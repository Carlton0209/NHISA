# NHISA community website

A responsive community and career resource website for Newhouse international students and alumni.

- **Website:** https://Carlton0209.github.io/NHISA/
- **Repository:** https://github.com/Carlton0209/NHISA
- **Deployment history:** https://github.com/Carlton0209/NHISA/actions/workflows/deploy-pages.yml

## Run locally

Requires Node.js 22 or later. No dependencies need to be installed.

```sh
npm run dev
```

Open http://localhost:5173. The complete static website is in `dist/`.

## Pages and features

| Page | Features |
| --- | --- |
| Home | Editorial hero, visa and work authorization guide entry, three core pathways, community introduction, featured resources |
| Career roadmap (`#/support`) | Five career preparation stages, external resources, persistent checklist, visa and work authorization guide entry |
| Alumni connections | Published interviews with field filters, full interview pages, quotes, profile facts, related conversations. Until one is published, a call for alumni stories |
| Career access | Thirteen resources, live search, category filters, bookmarks, saved-resource view, empty states |
| Visa and work authorization | F-1, CPT, OPT, STEM OPT, and H-1B explainers, three-stage application overviews, comparison table, official sources, common questions |
| About | Community purpose and priorities |
| Get involved | Validated introduction form that hands off to the email address or sign-up form in the site settings, local draft, clipboard copy, text-file download |
| Privacy and accessibility | Storage information and an action to clear local data |

All routes use URL fragments, such as `#/support` and `#/alumni/profile/alex-lin`, so deep links work under the GitHub Pages project path without server rewrite rules.

The introduction form operates on the visitor's device. It does not register membership or submit information to a backend. When `contact.email` is set, the visitor's own email app opens with the introduction filled in; when only `contact.formUrl` is set, the visitor is pointed to that form. Saved resources, checklist progress, and introduction drafts use browser local storage.

## Edit content

**Before announcing the site, fill in the contact settings** at the end of `dist/data.js` (`window.NHISA.site.contact`). Add at least `email` or `formUrl`; otherwise the Get involved page can only offer copy and download. Instagram, LinkedIn, and WeChat appear in the footer when they have a value. `npm run build` prints a warning while both `email` and `formUrl` are empty.

Edit `dist/data.js` to update resources, roadmap steps, and interviews. Edit `dist/app.js` for page structure and behavior, and `dist/styles.css` for visual styling.

The visa and work authorization guide is at `#/immigration`. It can be reached from the main navigation, the homepage, Career roadmap, the footer, and Career access's International students category. Individual topics have links such as `#/immigration?topic=cpt`. Content and references are stored in `window.NHISA.immigration` in `dist/data.js`. Keep the review date accurate and check university and government guidance whenever updating immigration content. This is general education, not a determination of an individual's eligibility or legal advice; filing fees and deadlines are deferred to current official instructions.

The six existing alumni interviews are fictional **TEST** entries for demonstrating the complete website framework. They are hidden on the public site. To preview them locally, set `showTestInterviews: true` in `window.NHISA.site`; they are then labeled TEST on the collection and detail pages. `npm run build` warns while the setting is on. Campus photos are illustrative and do not identify the fictional interviewees.

To publish a real interview, replace its information and photography, then set `test: false` and `published: true`. Each entry includes a unique `id`, `name`, `field`, `role`, `classOf`, `location`, `photo`, `photoAlt`, `headline`, `intro`, `background`, `quote`, and a `questions` array with at least four `{ question, answer }` items.

Keep test material labeled TEST. Do not present fictional interviewees or outcomes as factual.

## Design and assets

The website uses the provided SU Slate Design System: navy `#000E54`, orange `#F76900`, accessible dark orange `#CD3E00`, white, and pale gray `#F7F7F8`. Sherman Sans and Sherman Serif fonts (WOFF), outline icons, and campus photography are included locally. Photographs are optimized as WebP, with 900-pixel versions served to smaller screens.

Type sizes come from a scale defined as `--fs-xs` (12px) to `--fs-6xl` (57px) in `dist/styles.css`, a 1.2 ratio from 16px with a 12px minimum. Spacing uses multiples of 4px. Icons are SVG masks, so their color follows `color` and the brand tokens. Links that stay on the site end in →; links that open another site in a new tab end in ↗.

The interface includes responsive layouts, mobile navigation, keyboard focus states, a skip link, form labels, descriptive alternative text, and reduced-motion support.

Provided university brand assets retain their original ownership. This repository does not assign an open-source license to those assets.

## Validate

```sh
npm run check
npm run build
```

These commands check JavaScript syntax, resource relationships, unique resource IDs, complete interview content, local assets, and accessibility foundations. No compilation or dependency installation is required.

The interface has also been checked at 320, 390, 768, 1024, and 1440 pixel widths across 13 routes, including resource filtering, bookmarks, checklist persistence, interview filtering and navigation, introduction downloads, and mobile navigation.

## Publish

GitHub Pages uses the Actions workflow in `.github/workflows/deploy-pages.yml`. Every push to `main`:

1. Checks JavaScript syntax and validates content and assets.
2. Uploads `dist/` as the website artifact.
3. Publishes the checked artifact to GitHub Pages.

The workflow can also be run manually from the Actions tab. The published site uses HTTPS. The existing private Sites preview configuration remains in `.openai/hosting.json`; GitHub Pages deploys only `dist/`.
