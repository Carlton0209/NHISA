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

| Route | Content |
| --- | --- |
| `#/` | Hero: the autumn campus photo; the cursor reveals the winter version |
| `#/school` | School Experience: Community, Experience, Academics, IT Support |
| `#/job` | Job Knowledge: LinkedIn, Handshake, Email Signature, Job Search, Career Planning, and the NHISA toolkits |
| `#/job/email-signature/laptop`, `/phone`, `/sample` | Step-by-step Outlook guides and a copyable sample signature |
| `#/visa`, `#/photo-wall`, `#/community` | Placeholders until their content is ready |

Routes are URL fragments, so deep links work under the GitHub Pages project path without rewrites.

## Edit content

All copy and links live in `src/content/`:

- `school.ts`: School Experience resources, grouped by topic
- `job.ts`: Job Knowledge topics, toolkits, LinkedIn and Handshake guides, job search and career planning resources
- `email.ts`: Email Signature steps for laptop and phone, and the screenshots they open

The sample signature itself is in `src/pages/job/EmailSignature.tsx`. The Outlook screenshots in `src/assets/email/` have the original account name and address replaced with placeholders.

## Hero photos

`src/assets/hero-autumn.jpg` is shown by default and `hero-winter.jpg` is revealed under the cursor. The two must keep the same size and framing so the reveal lines up. Inner pages sit on a dark backdrop of faint, static lines drawn by `src/components/FlowLines.tsx`.
