<h1 align="center">
  <img src="assets/images/nietbegin-logo-transparent.png" alt="NietBegin Stables" width="420">
</h1>

<p align="center">
  <strong>The official website for NietBegin Stables</strong><br>
  A horse-first stable yard near Heidelberg, Gauteng, offering riding lessons,<br>
  thoughtful stabling and honest horse sales.
</p>

<p align="center">
  <a href="https://nietbegin.co.za"><img src="https://img.shields.io/website?label=nietbegin.co.za&url=https%3A%2F%2Fnietbegin.co.za" alt="Website"></a>
  <a href="#project-structure"><img src="https://img.shields.io/badge/build-zero--dependencies-002A22" alt="Build: zero dependencies"></a>
  <img src="https://img.shields.io/badge/runtime-Node.js_%E2%89%A518-339933" alt="Node.js">
  <img src="https://img.shields.io/badge/platform-Netlify_%7C_Apache-00C7B7" alt="Platform">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version 1.0.0">
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#technology-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#project-architecture">Architecture</a> ·
  <a href="#development-guide">Development</a> ·
  <a href="#deployment">Deployment</a>
</p>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
  - [Configuration](#configuration)
- [Project Architecture](#project-architecture)
  - [Directory Structure](#directory-structure)
  - [How the Build Works](#how-the-build-works)
  - [Architectural Decisions](#architectural-decisions)
- [Content Management](#content-management)
- [Image Pipeline](#image-pipeline)
- [Development Guide](#development-guide)
  - [Quality Checks](#quality-checks)
  - [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [SEO, Accessibility and Security](#seo-accessibility-and-security)
- [Contact Form Backend](#contact-form-backend)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [Credits](#credits)
- [License](#license)

---

## About the Project

NietBegin Stables needed a website that reflects how the yard actually operates: small,
personal and focused on the horses. The previous site was a dated PHP installation with
unclear navigation and no mobile experience. This project replaces it with a fully static,
hand-built website that loads fast on rural connections, ranks well in local search, and
can be maintained by editing a single source file rather than a CMS.

Every page on the site is generated from `build.mjs`. There is no framework, no bundler
and no `node_modules` folder to install. The entire public experience ships as semantic
HTML, one CSS file, two small JavaScript modules and optimized images.

The site covers everything the yard offers:

| Page | Purpose |
| --- | --- |
| `/` | Landing page with yard overview and service highlights |
| `/about/` | The yard, its people and its philosophy |
| `/services/` | Overview of lessons, stabling and sales |
| `/riding-lessons/` | Lesson programmes and what to expect |
| `/stabling/` | Facilities, care routine and pricing |
| `/horses-for-sale/` | Current sales listing with per-horse profiles |
| `/horses/mateo/`, `/horses/jovani/`, `/horses/coco/` | Individual horse detail pages |
| `/gallery/`, `/gallery/our-riders/`, `/gallery/stable-yard/` | Photo galleries with a keyboard-accessible lightbox |
| `/social/` | Embedded Facebook page timeline |
| `/faq/` | Frequently asked questions |
| `/contact/` | Enquiry form, phone, WhatsApp and map |
| `/privacy/` | Privacy notice |
| `/404.html` | Custom not-found page |

---

## Features

### Static site generation

- **Single-source build.** All 16 indexable pages, the 404 page, `sitemap.xml`,
  `robots.txt`, `site.webmanifest`, `_redirects`, `_headers` and `.htaccess` are emitted
  by one script, so navigation, footer and shared markup can never drift between pages.
- **Shared header and footer.** Every generated page receives an identical header and
  footer, with only the `aria-current="page"` marker differing per page.
- **Structured content model.** Horses are defined as data objects (breed, age, colour,
  training, status, image set) and rendered into both listing cards and detail pages.

### Performance

- **Modern image formats.** Every photo is served through a `<picture>` element with
  AVIF and WebP sources and a progressive JPEG fallback.
- **Responsive image variants.** Wide images ship at two widths (960w and up to 1600w)
  with `srcset` and `sizes`, so mobile devices never download desktop-sized files.
- **Zero layout shift.** All images carry explicit `width` and `height` attributes.
- **Immutable asset caching.** `/assets/*` is cached for one year; HTML is always revalidated.

### Accessibility

- **Accessible mobile menu.** Focus trap, Escape-to-close, scroll-position preservation
  and correct `aria-expanded` state, tuned against mobile browser scroll-reset quirks.
- **Native lightbox.** The gallery lightbox is a `<dialog>` element with keyboard
  navigation (previous/next/close) and proper captions.
- **Landmark discipline.** Each page has exactly one `<h1>` and one `<main>` element,
  verified automatically by the site checker.

### SEO

- **Complete metadata on every page.** Titles (30-65 characters), descriptions
  (90-170 characters), canonical URLs, Open Graph and Twitter card tags.
- **JSON-LD structured data.** Organization, WebPage, BreadcrumbList and per-page schema,
  all validated as parseable JSON on every build check.
- **Hreflang and sitemap parity.** `en-ZA` hreflang on every page; every indexable
  canonical must appear in `sitemap.xml` and vice versa, enforced by the checker.
- **Legacy redirect map.** All old PHP URLs (`/wcontact.php`, `/cp/39992/*`, ...) are
  301-redirected to their new equivalents; retired paths return 410.

### Contact

- **Enquiry form with backend delivery.** Client-side validation, honeypot spam
  protection, typed enquiry categories (lessons, stabling, horse sales, yard visits) and
  graceful fallback messaging with WhatsApp and phone alternatives.
- **Pre-filled enquiry types.** Links such as `/contact/?type=stabling` preselect the
  enquiry category automatically.

---

## Screenshots

Photography lives in `assets/images/source/` (originals) and `assets/images/optimized/`
(AVIF/WebP/JPEG variants). Candidate banner images for this section:

| Suggested screenshot | Source asset |
| --- | --- |
| Homepage hero | `assets/images/source/yard-banner-1.jpg` |
| Stable yard gallery view | `assets/images/source/stable-yard-1.jpeg` |
| Horse profile page | `assets/images/source/mateo-1.jpeg` |
| Our riders gallery | `assets/images/source/our-riders.jpg` |

> **Note**
> Rendering screenshots of the deployed site is a pending task. Add full-page captures
> (desktop and mobile) of the pages listed above here once taken, e.g.
> `docs/screenshots/home-desktop.png`.

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| Language | JavaScript (ES Modules), Node.js |
| Site generator | Custom build script (`build.mjs`), no framework |
| Styling | Hand-written CSS (`assets/css/site.css`), custom properties, responsive layout |
| Behaviour | Vanilla JavaScript (`site.js`, `contact-form.js`), no libraries |
| Fonts | Self-hosted: Anybody, Lora (variable), Source Sans 3 |
| Images | AVIF / WebP / JPEG via Pillow (`tools/optimize_images.py`) |
| Preview server | `node:http` static server (`tools/server.mjs`) |
| QA tooling | `tools/check-site.mjs` link/metadata/a11y validator |
| Hosting | Netlify-compatible (`_headers`, `_redirects`) with Apache `.htaccess` fallback |
| Embeds | Facebook page plugin, Google Maps (CSP-allowlisted frames) |

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES2022-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Node.js-%E2%89%A518-%23339933.svg?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-Pillow-%233776AB.svg?style=flat&logo=python&logoColor=white" alt="Python Pillow">
</p>

---

## Getting Started

### Prerequisites

- **Node.js 18 or newer** (uses `fetch`, `URL`, `fs/promises`, top-level await)
- Optional, for regenerating optimized images only: **Python 3** with **Pillow**

There are no npm dependencies. `npm install` is not required.

### Installation

```bash
git clone <repository-url>
cd nietbegin-website
npm run build
npm run serve
```

The preview server prints its address, by default:

```
NietBegin preview: http://127.0.0.1:4173
```

### Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `build` | `node build.mjs` | Regenerates all HTML pages, sitemap, robots, manifest and server config files |
| `serve` | `node tools/server.mjs` | Serves the built site locally with clean URLs and a custom 404 |
| `check` | `node tools/check-site.mjs` | Runs the full metadata, link, asset, heading and schema audit |

### Configuration

The site is configured through constants at the top of `build.mjs`:

```js
const domain = "https://nietbegin.co.za";
const phoneDisplay = "082 782 8761";
const phoneInternational = "+27827828761";
const whatsapp = "https://wa.me/27827828761";
const email = "info@nietbegin.co.za";
const facebookPageUrl = "https://www.facebook.com/NietBeginStables";
```

The contact form endpoint is configured in `assets/js/contact-form.js`:

```js
var FORM_ENDPOINT = "https://report.goodstuffdesigns.co.za/v1/forms/nietbegin-stables";
```

The preview server port can be overridden with an environment variable:

```bash
PORT=8080 npm run serve
```

---

## Project Architecture

### Directory Structure

```text
.
├── build.mjs                  # Site generator: content model, templates, output
├── package.json               # Scripts only; zero dependencies
├── _headers                   # Netlify security headers + caching rules
├── _redirects                 # Netlify redirects from the legacy PHP site
├── .htaccess                  # Apache equivalent (headers, caching, rewrites)
├── robots.txt / sitemap.xml / site.webmanifest   # Generated metadata
├── 404.html                   # Custom not-found page
├── index.html                 # Generated homepage
├── about/  services/  contact/  faq/  privacy/  social/
├── riding-lessons/  stabling/  horses-for-sale/
├── horses/                    # mateo/, jovani/, coco/ detail pages
├── gallery/                   # index, our-riders/, stable-yard/
├── assets/
│   ├── css/site.css           # Full stylesheet (~50 KB)
│   ├── js/
│   │   ├── site.js            # Menu, header, lightbox, scroll behaviour
│   │   ├── contact-form.js    # Form validation + backend delivery
│   │   └── vendor/            # Third-party scripts, if any
│   ├── fonts/                 # Self-hosted woff2/ttf fonts
│   └── images/
│       ├── source/            # Original photography
│       └── optimized/         # AVIF / WebP / JPEG variants (960w + wide)
├── tools/
│   ├── server.mjs             # Local static preview server
│   ├── check-site.mjs         # Site-wide QA validator
│   └── optimize_images.py     # Pillow image pipeline
└── Nietbegin/                 # Reserved workspace folder (currently empty)
```

### How the Build Works

`build.mjs` follows a simple pipeline:

1. **Content model.** Horses, breadcrumb chains, navigation items and page constants
   are declared as plain JavaScript data at the top of the file.
2. **Template functions.** `header()`, `footer()`, `pageHero()`, `ctaBand()`,
   `breadcrumbs()`, `picture()` and `horseCard()` compose reusable markup fragments.
3. **Page assembly.** Each page is a function that combines the templates with
   page-specific content, metadata, Open Graph tags and JSON-LD schema.
4. **Output.** `output()` writes each page to its `directory/index.html` path, then
   writes `sitemap.xml`, `robots.txt`, `site.webmanifest`, `_redirects`, `_headers`
   and `.htaccess`.

```bash
node build.mjs
# Built 16 indexable pages plus a custom 404 page.
```

### Architectural Decisions

- **No framework by design.** The site has roughly a dozen pages that change rarely;
  a 1,200-line generator is easier to audit and faster to build than any framework.
- **Clean URLs.** Every route is a physical `folder/index.html`, so the same build
  works unchanged on Netlify, Apache or any static host.
- **Strict CSP.** `script-src 'self'` and `style-src 'self'` mean no inline styles or
  scripts are permitted anywhere; the checker actively rejects inline `style=""`.
- **Dual hosting config.** Netlify files (`_headers`/`_redirects`) and `.htaccess`
  carry the same security and caching policy so the site is portable between hosts.

---

## Content Management

To change horses, prices, contact details or any page text:

1. Edit the relevant data or page function in `build.mjs`.
2. Run `npm run build`.
3. Review the diff; generated HTML files are committed to the repository, so the
   deployed site always matches what was reviewed.

To add a photo: place the original in `assets/images/source/`, run the image pipeline
(see below), then reference its stem in `build.mjs` and add its dimensions to the
`dimensions` map if it is used directly.

---

## Image Pipeline

`tools/optimize_images.py` converts everything in `assets/images/source/` into:

| Output | Format | Quality |
| --- | --- | --- |
| Base variant (max 960px) | JPEG / WebP / AVIF | 84 / 80 / 62 |
| Wide variant (max 1600px, only if source is wider than 960px) | JPEG / WebP / AVIF | 84 / 80 / 62 |

```bash
pip install Pillow
python tools/optimize_images.py
```

Images are EXIF-rotated, converted to RGB and resized with Lanczos resampling.

---

## Development Guide

### Quality Checks

The checker validates every generated HTML file:

- Title and description presence and length ranges
- Canonical URL, hreflang and robots directives
- Complete Open Graph and Twitter card tag sets
- Exactly one `<h1>` and one `<main>` per page
- Valid JSON-LD (every block parses; WebPage schema on indexable pages)
- No broken internal links, missing assets or images without `alt`
- Explicit `width`/`height` on non-lightbox images
- `rel="noopener noreferrer"` on all `target="_blank"` links
- No inline styles (CSP compliance) and no legacy "equicourse" content
- Sitemap/canonical parity and sitemap image availability
- Unique titles and descriptions across the whole site

```bash
npm run check
```

The command exits non-zero and prints one line per failure, so it can gate commits or
CI directly. A clean run prints a single confirmation line summarising how many HTML
files and JSON-LD blocks were checked.

> **Note**
> The JPEG fallback variants referenced by the current build are not yet present in
> `assets/images/optimized/` (only the WebP variants exist there). Run the image
> pipeline below to regenerate all variants before shipping.

### Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Edited files not visible in preview | Run `npm run build` first; preview serves built output |
| Checker fails on inline style | Move the rule into `assets/css/site.css` and reference a class |
| Checker fails on missing asset | Confirm the file exists under `assets/` at the exact href used |
| New image renders blurry on wide screens | Add its true dimensions to the `dimensions` map and regenerate variants |
| Form submissions fail locally | The form endpoint is a live production service; local fallback messaging is expected |

---

## Deployment

The repository root is the deployable artifact. The committed HTML is final output; no
build step is required on the host.

**Netlify (or compatible):**

1. Connect the repository; set the build command to `npm run build` (or deploy the
   root directly, since output is committed).
2. `_redirects` and `_headers` are picked up automatically.
3. Add the domain `nietbegin.co.za`; HTTPS is enforced by both the host and
   `upgrade-insecure-requests` in the CSP.

**Apache:** upload the repository root; `.htaccess` provides the same headers,
caching and redirect behaviour.

---

## SEO, Accessibility and Security

- **Security headers** applied on all routes: `Content-Security-Policy`,
  `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy`.
- **CSP posture:** self-only scripts and styles; frames allowlisted for Google Maps
  and the Facebook plugin; a single reporting endpoint for the contact form.
- **Accessibility:** semantic landmarks, single H1s, labelled images, keyboard-trapped
  mobile menu and dialog-based lightbox.
- **Spam protection:** honeypot field on the contact form; the backend applies rate
  limiting (HTTP 429 responses are surfaced with a friendly message).
- **Privacy:** the form submits only the fields shown to the user plus the page URL,
  with explicit privacy consent required; the privacy notice is at `/privacy/`.

---

## Contact Form Backend

The enquiry form POSTs JSON to a Node.js forms service hosted under DirectAdmin:

```text
POST https://report.goodstuffdesigns.co.za/v1/forms/nietbegin-stables
Content-Type: application/json

{
  "fields": {
    "name": "...", "email": "...", "phone": "...",
    "enquiry_type": "lessons|stabling|horse-sales|yard-visit|other",
    "message": "...", "page_url": "...", "privacy_consent": "..."
  },
  "honeypot": ""
}
```

Status codes handled by the client: `202` (accepted), `400` (validation), `429`
(rate limited). Any network failure shows a fallback message with WhatsApp and phone
contact details.

---

## Known Limitations

- The horse listing currently contains only placed (sold) horses; the build's data
  model supports a `placed` status label but there is no "available" filter UI yet.
- Gallery captions and horse data must be edited in `build.mjs`; there is no CMS.
- The Facebook timeline on `/social/` depends on the third-party plugin iframe.
- `.htaccess` caching relies on `mod_headers`/`mod_expires` being enabled on the host.
- The `Nietbegin/` folder is an empty reserved workspace.

---

## Roadmap

- [ ] Add full-page screenshots and a demonstration GIF to this README
- [ ] Reopen horse sales listings with an "available" status and enquiry CTA
- [ ] Collect form submissions into a reviewable archive on the backend
- [ ] Consider automated Lighthouse checks in CI alongside `npm run check`

---

## FAQ

**Why is the generated HTML committed to the repository?**
So deployments never require a build step and every change is reviewable as a diff.

**Do I need to install npm packages?**
No. `package.json` contains scripts only and the project has zero dependencies.

**Where do I change the phone number or email?**
In the constants at the top of `build.mjs`, then rebuild. The footer, contact page
and schema all read from those constants.

**Which images should the site use?**
Only files under `assets/images/optimized/`, referenced through the `picture()`
helper so AVIF/WebP negotiation and fallbacks stay consistent.

---

## Credits

- Yard photography and content: **NietBegin Stables**, Heidelberg, Gauteng
- Design, build and tooling: [Goodstuff-Designs](https://www.goodstuffdesigns.co.za/)
- Fonts: Anybody, Lora and Source Sans 3 (self-hosted)
- Image processing: [Pillow](https://python-pillow.org/)

**Live site:** [https://nietbegin.co.za](https://nietbegin.co.za) ·
**Facebook:** [NietBegin Stables](https://www.facebook.com/NietBeginStables) ·
**Contact:** [info@nietbegin.co.za](mailto:info@nietbegin.co.za) · 082 782 8761

---

## License

This project is proprietary. See [LICENSE](LICENSE) for the full terms. In short: all
rights are reserved by NietBegin Stables. Copying, redistribution, modification or reuse
of the code, design, photography or content is not permitted. Authorised contributors
working on the yard's behalf should run `npm run build` and `npm run check` before
submitting changes.

---

<p align="center">
  <sub>Built with plain HTML, CSS and JavaScript. No frameworks were harmed.</sub>
</p>
