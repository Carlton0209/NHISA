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
| `#/` | Hero: the campus photo over an animated night sky; the cursor reveals the winter version |
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

## Hero cutouts

`src/assets/hero-autumn-cutout.webp` and `hero-winter-cutout.webp` are the original photos (`hero-autumn.jpg`, `hero-winter.jpg`) with the sky removed, so the animated backdrop shows through. They are made offline with the scripts in `tools/matte/`:

1. `segment.py` finds the sky with SegFormer-B5 (ADE20K), averaged over three scales and mirrored passes.
2. `matte.py` refines it: the roof edge is detected column by column for a crisp line, tree edges are unmixed between the local sky and foliage colours (so holes between branches become transparent and thin twigs stay), and edge pixels are cleaned of the old sky colour.
3. `preview.py` composites the result over a dark backdrop with close-up crops for checking.

```sh
pip install torch transformers opencv-python numpy pymatting
python tools/matte/segment.py src/assets/hero-autumn.jpg sky-autumn.npy
python tools/matte/matte.py src/assets/hero-autumn.jpg sky-autumn.npy autumn.png
python -c "from PIL import Image; Image.open('autumn.png').save('src/assets/hero-autumn-cutout.webp', quality=90, method=6)"
```

Repeat with `winter` for the second photo. The file name selects the colour thresholds for each season.
