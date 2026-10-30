# Next Step Guyana website

A plain HTML/CSS/JavaScript site. There's no build step and no database. Open `index.html` in a browser to see it.

## What to edit

| To change… | Edit this file |
|---|---|
| Mentors (add, remove, update, contact details) | `data/mentors.js` |
| Q&A events (announce, add join or register links, add recordings) | `data/sessions.js` |
| News articles on the About page | `data/news.js` |
| Community counter on the home page | `community` at the top of `js/site.js` |
| Videos, handbooks (PDFs go in `/handbooks`) and links | `data/resources.js` |
| Event brochure page (images and PDF in `/brochure`) | `brochure.html` |
| Navi careers | `data/careers-guide.md`, then rebuild (see below) |
| Navi stream subject lists | `STREAM_SUBJECTS` near the top of `js/navi.js` |
| Email, WhatsApp, Instagram, TikTok links | top of `js/site.js` |
| About / FAQ wording | `about.html`, `faq.html` |
| Colours and fonts | top of `css/style.css` |

Each data file has instructions at the top. Copy an existing `{ ... }` block, paste it below, and change the details. Watch the commas: every block ends with `},` except it's fine on the last one too.

**Events sort themselves.** Anything dated today or later shows as Upcoming, and past events move down to "Past events" automatically. Add a `recording` link after an event and it gets a "Watch recording" button.

## Navi (career navigator)

`navi.html` lets students search a career or pick a CSEC stream and see the subjects and steps to get there. Its careers come from the Career Pathways Guide, kept in this repo at `data/careers-guide.md`. To fix or add a career:

1. Edit `data/careers-guide.md` (and update its **Last verified** date if you rechecked sources).
2. Rebuild Navi's data:

```
python3 tools/build-navi.py
```

This rewrites `data/navi.js`. Commit both files and the site updates. Don't edit `data/navi.js` by hand; the next rebuild would overwrite it. Which careers fit each stream is worked out from the CSEC subjects the guide recommends for each career.

## Photos

- **Mentor photos** go in `/photos`, named as listed in `data/mentors.js` (e.g. `photos/joshua-gulab.jpg`). Square-ish JPGs, at least 400px wide. If a photo is missing, the card shows the mentor's initials instead.
- **The hero image** (the starry-night students artwork) goes at `assets/hero.jpg`. Until it's added, the hero shows a navy night-sky gradient.

## Putting it online

This site is hosted on **Cloudflare Pages**, connected to this GitHub repository. Any change saved here (edit a file on github.com and click **Commit changes**) goes live automatically within a minute or two.

Cloudflare setup (one time): **Workers & Pages → Create application → Pages → Connect to Git**, choose this repository, leave the build command and output directory empty, then **Save and Deploy**.

## Old links keep working

The `_redirects` file sends your old Google Sites addresses (like `/home`, `/view-our-mentors/...` and `/about-us`) to the matching new pages, so links people already shared still work. Cloudflare Pages reads this file automatically.

## Using nextstepgy.org

In Cloudflare, add `nextstepgy.org` as a domain and switch its nameservers (at the company where the domain was bought) to the two Cloudflare gives you. Once it is active, open the Pages project, go to **Custom domains**, and add both `nextstepgy.org` and `www.nextstepgy.org`.
