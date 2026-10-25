# Design review changes

## Needs your input before launch
- **Contact settings.** Fill in `window.NHISA.site.contact` at the end of `dist/data.js` (at least `email` or `formUrl`). Until then, the Get involved page can only offer copy and download, and the build prints a warning.
- **Brand assets.** Sherman fonts, the Block S favicon, and campus photography belong to Syracuse University. Confirm with the university that they may be used on this site and stored in a public repository.

## Join flow
- Get involved now says where the introduction goes. With an email set, “Send by email” opens the visitor’s email app with the message filled in. With only a form link, it points to the form.
- The copy button no longer uses an envelope icon. Contact channels appear in the footer when they are set.

## Navigation and page structure
- Main navigation: Visa and work authorization, Career roadmap, Career access, Alumni connections, Join the community. “Home” is the logo.
- “Student support” is renamed Career roadmap everywhere, since the page is a career roadmap. The `#/support` link still works.
- Each page’s H1 is the page name. The two-line slogans on inner pages are removed; the orange italic line is used once, on the homepage.
- Homepage: the row of three links that repeated the pathway cards is replaced by the visa guide entry, with its source review date. The utility bar states the audience instead of a slogan.
- On tablets (≤960px), the navigation collapses into the menu.

## Content
- Fictional TEST interviews are hidden on the public site and replaced by a call for alumni stories. `showTestInterviews: true` brings them back for local previews.
- Pathway card illustrations now use real content: the five roadmap steps from `data.js` and the featured resource names. The alumni card uses a landscape photo where the people are visible.
- Corrected alternative text: the About photo shows the Barnes Center at The Arch; the community photo shows Hinds Hall.

## Readability and touch
- No text below 12px at any width. Inputs are 16px, so iOS no longer zooms in on focus.
- Filter chips, topic tabs, roadmap links, resource chips, the bookmark button, the menu button, and mobile footer links are at least 44px tall.
- External links announce “(opens in a new tab)” to screen readers.
- In-page anchors such as `#main` no longer re-render a page.

## Design system
- 34 font sizes reduced to a 10-step scale (`--fs-xs` to `--fs-6xl`) plus the large-screen hero size.
- 59 spacing values reduced to a 4px grid.
- Icons are SVG masks colored by tokens instead of CSS filter approximations.
- → for links within the site, ↗ for links to other sites, applied consistently.

## Performance
- Fonts converted from TTF to WOFF (664KB to 269KB). Running `woff2_compress` locally would shrink them further.
- 900px image versions with `srcset` for smaller screens.
- Removed unused `panorama.webp` and `syracuse-university.png`.

## Checks
- `npm run build` also checks icon files, image references, and the contact settings.
- Checked at 320, 390, 768, 1024, 1280, and 1440px across 9 routes: no horizontal overflow, no text under 12px, no console errors.
