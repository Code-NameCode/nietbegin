import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const domain = "https://nietbegin.co.za";
const phoneDisplay = "082 782 8761";
const phoneInternational = "+27827828761";
const whatsapp = "https://wa.me/27827828761";
const email = "info@nietbegin.co.za";
const lastModified = "2026-08-29";
const transparentLogoPath = "/assets/images/nietbegin-logo-transparent.png";
const facebookPageUrl = "https://www.facebook.com/NietBeginStables";
const facebookPluginUrl = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookPageUrl)}&tabs=timeline&width=500&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;
const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebookPageUrl)}`;

const wideImages = new Set([
  "coco-1",
  "coco-2",
  "mateo-1",
  "mateo-2",
  "mateo-3",
  "our-riders",
  "stable-yard-1",
  "stable-yard-2",
  "stable-yard-3",
  "yard-banner-1",
  "yard-banner-2",
  "yard-banner-3"
]);

const dimensions = {
  "coco-1": [1280, 959],
  "coco-2": [1170, 877],
  "coco-3": [591, 838],
  "coco-4": [960, 1280],
  "horse-detail-1": [367, 500],
  "horse-detail-2": [367, 500],
  "jovani-1": [591, 717],
  "jovani-2": [591, 860],
  "jovani-3": [591, 615],
  "jovani-4": [960, 1280],
  "mateo-1": [1280, 853],
  "mateo-2": [1280, 853],
  "mateo-3": [975, 650],
  "mateo-4": [814, 542],
  "our-riders": [1600, 834],
  "stable-yard-1": [1600, 737],
  "stable-yard-2": [1600, 737],
  "stable-yard-3": [1600, 737],
  "stephanie-jumping": [960, 960],
  "yard-banner-1": [1349, 400],
  "yard-banner-2": [1349, 400],
  "yard-banner-3": [1349, 400]
};

const horses = [
  {
    slug: "mateo",
    name: "Mateo",
    breed: "SA Sport Horse",
    age: "4 years",
    colour: "Black tobiano",
    training: "Show jumping and dressage",
    status: "placed",
    statusLabel: "Sold",
    images: ["mateo-1", "mateo-2", "mateo-3", "mateo-4"],
    summary: "A black tobiano SA Sport Horse with training in show jumping and dressage. Mateo has found his new home."
  },
  {
    slug: "jovani",
    name: "Jovani",
    breed: "SA Sport Horse",
    age: "6 years",
    colour: "Black tobiano",
    training: "Dressage",
    status: "placed",
    statusLabel: "Sold",
    images: ["jovani-4", "jovani-1", "jovani-2", "jovani-3"],
    summary: "A black tobiano SA Sport Horse with dressage training. Jovani has found his new home."
  },
  {
    slug: "coco",
    name: "Coco",
    breed: "Crossbreed",
    age: "Approximately 10 years",
    colour: "Palomino",
    training: "Show jumping",
    status: "placed",
    statusLabel: "Sold",
    images: ["coco-1", "coco-2", "coco-3", "coco-4"],
    summary: "A palomino crossbreed with show-jumping experience. Coco has found a new home."
  }
];

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value).replaceAll("<", "\\u003c")}</script>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function imagePath(name, extension, useWide = false) {
  return `/assets/images/optimized/${name}${useWide && wideImages.has(name) ? "-wide" : ""}.${extension}`;
}

function picture(name, alt, { className = "", eager = false, useWide = true } = {}) {
  const wide = useWide && wideImages.has(name);
  const [width, height] = dimensions[name];
  const avifSrcset = wide
    ? `${imagePath(name, "avif")} 960w, ${imagePath(name, "avif", true)} ${width}w`
    : imagePath(name, "avif");
  const webpSrcset = wide
    ? `${imagePath(name, "webp")} 960w, ${imagePath(name, "webp", true)} ${width}w`
    : imagePath(name, "webp");
  const fallback = imagePath(name, "jpg", wide);
  return `<picture${className ? ` class="${className}"` : ""}>
    <source type="image/avif" srcset="${avifSrcset}" sizes="(max-width: 960px) 100vw, 50vw">
    <source type="image/webp" srcset="${webpSrcset}" sizes="(max-width: 960px) 100vw, 50vw">
    <img src="${fallback}" alt="${alt}" width="${width}" height="${height}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
  </picture>`;
}

function brand() {
  return `<a class="brand" href="/" aria-label="NietBegin Stables home">
    <img class="brand-logo" src="${transparentLogoPath}" width="900" height="544" alt="">
  </a>`;
}

const navItems = [
  ["about", "/about/", "About"],
  ["services", "/services/", "Services"],
  ["horses", "/horses-for-sale/", "Horses for sale"],
  ["gallery", "/gallery/", "Gallery"],
  ["social", "/social/", "Social"],
  ["faq", "/faq/", "FAQ"]
];

function header(active = "") {
  const links = navItems
    .map(([key, href, label]) => `<li><a class="nav-link" href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a></li>`)
    .join("");

  return `<header class="site-header" data-site-header>
    <div class="container header-inner">
      ${brand()}
      <nav class="site-navigation" id="primary-navigation" aria-label="Primary navigation" data-site-navigation>
        <ul class="nav-list">
          ${links}
          <li class="nav-contact"><a class="nav-link" href="/contact/"${active === "contact" ? ' aria-current="page"' : ""}>Contact</a></li>
        </ul>
      </nav>
      <a class="button header-cta" href="/contact/">Send an enquiry</a>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open menu" data-menu-button>
        <span class="menu-icon" aria-hidden="true"></span>
      </button>
    </div>
  </header>`;
}

function paddockRail() {
  return `<div class="paddock-rail" aria-hidden="true">
    <span class="paddock-rail-line"></span>
    <i></i><i></i><i></i><i></i><i></i>
  </div>`;
}

function ranchStamp() {
  return `<div class="ranch-stamp">
    <svg viewBox="0 0 108 58" width="108" height="58" aria-hidden="true" focusable="false">
      <path d="M5 34h98M5 45h98M13 29v24M37 29v24M71 29v24M95 29v24"/>
      <path d="M37 31V16L54 5l17 11v15M47 31V20h14v11M54 5v-3"/>
    </svg>
    <span>Horse country <strong>Heidelberg</strong></span>
  </div>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        ${brand()}
        <p>A small, horse-first stable yard offering riding lessons, thoughtful stabling and honest horse sales near Heidelberg.</p>
        ${ranchStamp()}
      </div>
      <div>
        <h2 class="footer-heading">Services</h2>
        <ul class="footer-links">
          <li><a href="/riding-lessons/">Riding lessons</a></li>
          <li><a href="/stabling/">Stabling</a></li>
          <li><a href="/horses-for-sale/">Horses for sale</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer-heading">Explore</h2>
        <ul class="footer-links">
          <li><a href="/about/">About NietBegin</a></li>
          <li><a href="/gallery/">Gallery</a></li>
          <li><a href="/social/">Facebook updates</a></li>
          <li><a href="/faq/">Frequently asked questions</a></li>
          <li><a href="/contact/">Contact</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer-heading">Contact</h2>
        <ul class="footer-links">
          <li>Heidelberg, Gauteng</li>
          <li>Visits by appointment</li>
          <li><a href="tel:${phoneInternational}">${phoneDisplay}</a></li>
          <li><a href="mailto:${email}">${email}</a></li>
          <li><a href="${whatsapp}">Chat on WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span class="footer-copyright">© <span data-year></span> NietBegin Stables. All rights reserved.</span>
      <a class="footer-credit" href="https://www.goodstuffdesigns.co.za/" target="_blank" rel="noopener noreferrer">Powered by Goodstuff-Designs</a>
      <a class="footer-privacy" href="/privacy/">Privacy notice</a>
    </div>
  </footer>`;
}

function lightboxDialog() {
  return `<dialog class="lightbox" aria-label="Image viewer" data-lightbox-dialog>
    <img class="lightbox-image" alt="" data-lightbox-image>
    <div class="lightbox-footer">
      <p data-lightbox-caption></p>
      <div class="lightbox-actions">
        <button class="icon-button" type="button" aria-label="Previous image" data-lightbox-previous>←</button>
        <button class="icon-button" type="button" aria-label="Next image" data-lightbox-next>→</button>
        <button class="icon-button" type="button" aria-label="Close image viewer" data-lightbox-close>×</button>
      </div>
    </div>
  </dialog>`;
}

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": ["SportsActivityLocation", "Organization"],
  "@id": `${domain}/#organisation`,
  name: "NietBegin Stables",
  url: `${domain}/`,
  logo: {
    "@type": "ImageObject",
    "@id": `${domain}/#logo`,
    url: `${domain}${transparentLogoPath}`,
    contentUrl: `${domain}${transparentLogoPath}`,
    width: 900,
    height: 544,
    caption: "NietBegin Stables"
  },
  image: `${domain}/assets/images/optimized/stable-yard-1-wide.jpg`,
  description: "A horse-first stable yard offering riding lessons, stabling and horse sales near Heidelberg, Gauteng.",
  telephone: phoneInternational,
  email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Heidelberg",
    addressRegion: "Gauteng",
    addressCountry: "ZA"
  },
  areaServed: ["Heidelberg", "Gauteng"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: phoneInternational,
    email,
    contactType: "customer service",
    areaServed: "ZA",
    availableLanguage: "English"
  },
  knowsAbout: ["Horse riding lessons", "Horse stabling", "Horse care", "Horse sales"],
  sameAs: [facebookPageUrl],
  slogan: "For the love of the horse"
};

function breadcrumbSchema(items) {
  const currentPath = items.at(-1)?.path ?? "/";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${domain}${currentPath}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${domain}${item.path}`
    }))
  };
}

function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="container">
      ${items.map((item, index) => `<li>${index === items.length - 1 ? `<span aria-current="page">${item.name}</span>` : `<a href="${item.path}">${item.name}</a>`}</li>`).join("")}
    </ol>
  </nav>`;
}

function pageHero(eyebrow, title, description) {
  return `<section class="page-hero">
    <div class="container page-hero-inner">
      <div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1></div>
      <div class="page-hero-note"><p>${description}</p>${ranchStamp()}</div>
    </div>
  </section>`;
}

function ctaBand(title = "Tell us what you’re looking for.", type = "other") {
  return `<section class="section cta-band">
    <div class="container cta-inner">
      <div><span class="eyebrow">Start a conversation</span><h2>${title}</h2></div>
      <a class="button button-light button-arrow" href="/contact/?type=${type}">Send an enquiry</a>
    </div>
  </section>`;
}

function page({ title, description, path, active, body, schemas = [], contactScripts = false, robots = "index, follow, max-image-preview:large", socialImageName = "our-riders", socialImageAlt = "NietBegin riders overlooking the stable yard near Heidelberg" }) {
  const canonical = `${domain}${path}`;
  const socialImage = `${domain}${imagePath(socialImageName, "jpg", wideImages.has(socialImageName))}`;
  const [socialImageWidth, socialImageHeight] = dimensions[socialImageName];
  const htmlTitle = escapeHtml(title);
  const htmlDescription = escapeHtml(description);
  const htmlSocialImageAlt = escapeHtml(socialImageAlt);
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: "en-ZA",
    isPartOf: { "@id": `${domain}/#website` },
    about: { "@id": `${domain}/#organisation` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: socialImage,
      width: socialImageWidth,
      height: socialImageHeight,
      caption: socialImageAlt
    },
    dateModified: lastModified
  };
  return `<!doctype html>
<html lang="en-ZA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${htmlTitle}</title>
  <meta name="description" content="${htmlDescription}">
  <meta name="robots" content="${robots}">
  <meta name="theme-color" content="#002A22">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en-ZA" href="${canonical}">
  <link rel="icon" href="/assets/images/favicon.png" type="image/png" sizes="16x16 32x32 48x48 64x64 128x128 256x256">
  <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/lora-variable.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="/assets/fonts/source-sans-3-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/site.css?v=20260829-18">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_ZA">
  <meta property="og:site_name" content="NietBegin Stables">
  <meta property="og:title" content="${htmlTitle}">
  <meta property="og:description" content="${htmlDescription}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${socialImage}">
  <meta property="og:image:secure_url" content="${socialImage}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="${socialImageWidth}">
  <meta property="og:image:height" content="${socialImageHeight}">
  <meta property="og:image:alt" content="${htmlSocialImageAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${htmlTitle}">
  <meta name="twitter:description" content="${htmlDescription}">
  <meta name="twitter:image" content="${socialImage}">
  <meta name="twitter:image:alt" content="${htmlSocialImageAlt}">
  ${[pageSchema, ...schemas].map(jsonLd).join("\n  ")}
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  ${header(active)}
  ${paddockRail()}
  <main id="main-content">${body}</main>
  ${footer()}
  ${lightboxDialog()}
  ${contactScripts ? '<script src="/assets/js/contact-form.js?v=20260829-1" defer></script>' : ""}
  <script src="/assets/js/site.js?v=20260829-10" defer></script>
</body>
</html>`;
}

async function output(path, content) {
  const target = join(root, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${domain}/#website`,
  url: `${domain}/`,
  name: "NietBegin Stables",
  publisher: { "@id": `${domain}/#organisation` },
  inLanguage: "en-ZA"
};

const homeBody = `
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy" data-reveal>
        <span class="eyebrow">For the love of the horse</span>
        <h1>A horse-first stable yard near Heidelberg.</h1>
        <p class="hero-lead">A family-farm stable yard near Heidelberg where horses are loved as individuals and riders learn care, confidence and connection.</p>
        <div class="button-row">
          <a class="button button-arrow" href="/contact/">Send an enquiry</a>
          <a class="button button-secondary" href="/services/">Explore our services</a>
        </div>
        ${ranchStamp()}
      </div>
      <div class="hero-media" data-reveal>
        <div class="hero-frame">${picture("horse-detail-2", "A much-loved horse living at NietBegin Stables", { eager: true, useWide: false })}</div>
        <span class="hero-location">Heidelberg · Gauteng</span>
        <span class="hero-rail" aria-hidden="true"></span>
      </div>
    </div>
  </section>
  <div class="trust-strip" aria-label="NietBegin services">
    <ul class="container trust-list"><li>Riding lessons</li><li>Individual stabling care</li><li>Horse sales with heart</li></ul>
  </div>
  <section class="section">
    <div class="container">
      <div class="section-heading" data-reveal>
        <span class="eyebrow">What we do</span>
        <h2>Everything begins with a well-loved horse.</h2>
        <p>Lessons, stabling and horse sales all grow from the same promise: listen to the horse, care for the individual and build relationships that feel good on both sides.</p>
      </div>
      <div class="card-grid">
        <article class="service-card" data-reveal>
          ${picture("our-riders", "NietBegin riders together at the stable yard")}
          <div class="service-card-content"><span class="card-label">Learn alongside the horse</span><h3>Riding lessons</h3><p>Riders learn more than technique: they learn to listen, care, grow in confidence and enjoy the partnership.</p><a class="button button-light" href="/riding-lessons/">View lesson options</a></div>
        </article>
        <article class="service-card" data-reveal>
          ${picture("stable-yard-1", "The arena, shelters and stable yard at NietBegin")}
          <div class="service-card-content"><span class="card-label">A peaceful place</span><h3>Stabling</h3><p>Comfortable stabling with individual attention in a calm, horse-first environment near Heidelberg.</p><a class="button button-light" href="/stabling/">Ask about stabling</a></div>
        </article>
        <article class="service-card" data-reveal>
          ${picture("mateo-1", "Mateo, a black tobiano SA Sport Horse")}
          <div class="service-card-content"><span class="card-label">The right partnership</span><h3>Horse sales</h3><p>Horses are trained and presented with care, honesty and a commitment to finding the right new home.</p><a class="button button-light" href="/horses-for-sale/">Meet our horses</a></div>
        </article>
      </div>
    </div>
  </section>
  <section class="section section-blue">
    <div class="container split-layout">
      <div class="split-media" data-reveal>${picture("our-riders", "NietBegin riders wearing the stable colours beside the arena")}</div>
      <div class="split-copy" data-reveal>
        <span class="eyebrow">Small yard, real attention</span>
        <h2>A stable built around the horse.</h2>
        <p>NietBegin is tucked away on a dairy farm just outside Heidelberg. It is a home-like yard where horses are treated as individuals and riders have space to grow.</p>
        <p>Riders come here to spend meaningful time with horses: learning how they think, how to care for them and how trust grows through quiet, patient work.</p>
        <div class="stat-grid" aria-label="What matters at NietBegin">
          <div class="stat"><strong>Horse first</strong><span>Care, patience and understanding guide the day.</span></div>
          <div class="stat"><strong>Everyone belongs</strong><span>Riders learn at their own pace in a welcoming yard community.</span></div>
        </div>
        <div class="button-row button-row-spaced"><a class="button button-secondary button-arrow" href="/about/">Our story and approach</a></div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-heading" data-reveal><span class="eyebrow">Life at the yard</span><h2>Lessons that stay with you beyond the saddle.</h2></div>
      <div class="feature-grid">
        <article class="feature" data-reveal><span class="feature-icon" aria-hidden="true">01</span><h3>Horse wellbeing first</h3><p>Every decision begins with what helps the individual horse feel safe, understood and able to thrive.</p></article>
        <article class="feature" data-reveal><span class="feature-icon" aria-hidden="true">02</span><h3>Learn to listen</h3><p>Riders discover how horses communicate and why patience, kindness and consistency matter.</p></article>
        <article class="feature" data-reveal><span class="feature-icon" aria-hidden="true">03</span><h3>Grow together</h3><p>Confidence develops through real responsibility, shared progress and time spent building trust.</p></article>
      </div>
    </div>
  </section>
  ${ctaBand("Come and find your place in our horse-loving family.")}`;

await output("index.html", page({
  title: "Horse Riding, Stabling & Sales in Heidelberg | NietBegin",
  description: "A warm, horse-first family-farm stable yard near Heidelberg, Gauteng, offering riding lessons, thoughtful stabling and honest horse sales.",
  path: "/",
  active: "home",
  body: homeBody,
  schemas: [organisationSchema, homeSchema],
  socialImageName: "our-riders",
  socialImageAlt: "NietBegin riders together at the horse-first stable yard near Heidelberg"
}));

const aboutCrumbs = [{ name: "Home", path: "/" }, { name: "About", path: "/about/" }];
const aboutBody = `${pageHero("About NietBegin", "A horse-first family farm near Heidelberg.", "A small, welcoming yard where happy horses, patient people and everyday care bring a community together.")}
  ${breadcrumbs(aboutCrumbs)}
  <section class="section">
    <div class="container split-layout">
      <div class="split-media" data-reveal>${picture("our-riders", "The NietBegin riding community overlooking the stable yard")}</div>
      <div class="split-copy" data-reveal>
        <span class="eyebrow">Why we began</span>
        <h2>A place to be known, cared for and loved.</h2>
        <p>NietBegin grew from a deep love for horses and a desire to give them a peaceful place where they come first.</p>
        <p>Set on a dairy farm outside Heidelberg, the yard brings together horses and riders in a calm, home-like environment. Each horse has a story, and we are honoured to be part of the journey.</p>
      </div>
    </div>
  </section>
  <section class="section section-dark">
    <div class="container">
      <div class="section-heading" data-reveal><span class="eyebrow">How we live and learn</span><h2>Horses teach us when we take the time to listen.</h2><p>Stable manager and trainer Stephanie Soutar works closely with each horse, from backing and schooling to building confidence through patient, thoughtful handling.</p></div>
      <div class="feature-grid">
        <article class="feature" data-reveal><span class="feature-icon">01</span><h3>Observe the individual</h3><p>No two horses or riders learn in exactly the same way. We start with what is in front of us.</p></article>
        <article class="feature" data-reveal><span class="feature-icon">02</span><h3>Build confidence</h3><p>Progress is approached patiently so that understanding comes before pressure.</p></article>
        <article class="feature" data-reveal><span class="feature-icon">03</span><h3>Value the relationship</h3><p>The bond between horse and rider matters more than how quickly a new skill is learned.</p></article>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container split-layout">
      <div class="split-copy" data-reveal><span class="eyebrow">Meet the team</span><h2>The people behind the yard.</h2><h3>Sunette Van Tonder</h3><p>Owner</p><h3>Stephanie Soutar</h3><p>Stable Manager, Head Instructor and Trainer</p><p>Stephanie brings more than 10 years of experience in riding, schooling, jumping and backing horses.</p><a class="button button-arrow" href="/contact/?type=yard-visit">Arrange a yard visit</a></div>
      <div class="split-media" data-reveal>${picture("stephanie-jumping", "Stephanie Soutar riding over a jump", { useWide: false })}</div>
    </div>
  </section>
  ${ctaBand("Come and meet the yard by appointment.", "yard-visit")}`;

await output("about/index.html", page({
  title: "About Our Horse-First Stable Yard | NietBegin Stables",
  description: "Meet the people and philosophy behind NietBegin Stables, a small horse-first yard on a dairy farm near Heidelberg, Gauteng.",
  path: "/about/",
  active: "about",
  body: aboutBody,
  schemas: [organisationSchema, breadcrumbSchema(aboutCrumbs)],
  socialImageName: "our-riders",
  socialImageAlt: "The NietBegin riding community overlooking the stable yard near Heidelberg"
}));

const servicesCrumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services/" }];
const servicesBody = `${pageHero("Services", "Horse care, riding and a place to belong.", "Learn with our horses, ask about a caring home for your horse or begin the search for the right new companion.")}
  ${breadcrumbs(servicesCrumbs)}
  <section class="section">
    <div class="container card-grid">
      <article class="service-card" data-reveal>${picture("our-riders", "NietBegin riders together at the stable yard")}<div class="service-card-content"><span class="card-label">R120 or R200 weekly</span><h2>Riding lessons</h2><p>Learn riding, horse care, patience and confidence in small classes where every horse is treated as a partner.</p><a class="button button-light" href="/riding-lessons/">See lesson details</a></div></article>
      <article class="service-card" data-reveal>${picture("stable-yard-2", "A view across the NietBegin arena and stable yard")}<div class="service-card-content"><span class="card-label">Individual care</span><h2>Stabling</h2><p>A peaceful, safe setting where care is approached around the needs of the individual horse.</p><a class="button button-light" href="/stabling/">Discuss stabling</a></div></article>
      <article class="service-card" data-reveal>${picture("coco-1", "Coco and rider over a jump")}<div class="service-card-content"><span class="card-label">A considered match</span><h2>Horse sales</h2><p>Training and sales handled with honesty, care and the aim of a lasting horse-and-rider partnership.</p><a class="button button-light" href="/horses-for-sale/">View the sales yard</a></div></article>
    </div>
  </section>
  <section class="section section-blue">
    <div class="container">
      <div class="section-heading" data-reveal><span class="eyebrow">Not sure where to begin?</span><h2>Start with a conversation.</h2><p>Tell us whether you are looking for lessons, stabling, a horse or simply a yard visit. We will help you find the most useful next step.</p></div>
      <a class="button button-arrow" href="/contact/">Send a general enquiry</a>
    </div>
  </section>`;

await output("services/index.html", page({
  title: "Horse Care, Riding Lessons & Sales in Heidelberg | NietBegin",
  description: "Explore horse riding lessons, individual stabling care and honest horse sales at NietBegin Stables near Heidelberg, Gauteng.",
  path: "/services/",
  active: "services",
  body: servicesBody,
  schemas: [organisationSchema, breadcrumbSchema(servicesCrumbs)],
  socialImageName: "stable-yard-2",
  socialImageAlt: "The arena and horse-care setting at NietBegin Stables near Heidelberg"
}));

const lessonCrumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services/" }, { name: "Riding lessons", path: "/riding-lessons/" }];
const lessonSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${domain}/riding-lessons/#service`,
  name: "Horse Riding Lessons",
  url: `${domain}/riding-lessons/`,
  description: "Personal horse riding lessons near Heidelberg for beginners through advanced riders, with small classes and horse-care education.",
  serviceType: "Horse riding lessons",
  provider: { "@id": `${domain}/#organisation` },
  areaServed: { "@type": "City", name: "Heidelberg, Gauteng" },
  offers: [
    { "@type": "Offer", name: "Once weekly", url: `${domain}/riding-lessons/`, price: "120", priceCurrency: "ZAR", description: "One 30–40 minute riding lesson per week." },
    { "@type": "Offer", name: "Twice weekly", url: `${domain}/riding-lessons/`, price: "200", priceCurrency: "ZAR", description: "Two 30–40 minute riding lessons per week." }
  ]
};
const lessonBody = `${pageHero("Horse riding lessons", "Horse riding lessons that teach more.", "Personal lessons near Heidelberg for riders who want to understand horses, grow in confidence and enjoy being part of yard life.")}
  ${breadcrumbs(lessonCrumbs)}
  <section class="section">
    <div class="container split-layout">
      <div class="split-media" data-reveal>${picture("stephanie-jumping", "Head instructor Stephanie Soutar riding over a jump", { useWide: false })}</div>
      <div class="split-copy" data-reveal>
        <span class="eyebrow">A lesson that meets you where you are</span>
        <h2>Riding is only part of what horses teach us.</h2>
        <p>With more than 10 years of experience, head instructor Stephanie Soutar teaches complete beginners through to experienced riders, always beginning with the horse in front of them.</p>
        <p>Lessons include confidence, safety, horse care, responsibility and the quiet work of building a strong partnership.</p>
        <a class="button button-arrow" href="/contact/?type=lessons">Ask about a lesson</a>
      </div>
    </div>
  </section>
  <section class="section section-blue">
    <div class="container">
      <div class="section-heading" data-reveal><span class="eyebrow">Lesson options</span><h2>Choose the rhythm that suits your goals.</h2><p>Each lesson lasts approximately 30–40 minutes. Contact us to discuss rider experience, availability and the right lesson horse.</p></div>
      <div class="rate-grid">
        <article class="rate-card" data-reveal><span class="card-label">Once weekly</span><h3>Begin or build steadily</h3><p class="rate-price">R120 <small>per week</small></p><p>One lesson each week covering the skills suited to the rider’s current level, from safety and mounting to more advanced work.</p><a class="button button-secondary" href="/contact/?type=lessons">Enquire about weekly lessons</a></article>
        <article class="rate-card" data-reveal><span class="card-label">Twice weekly</span><h3>More time in the saddle</h3><p class="rate-price">R200 <small>per week</small></p><p>Two lessons each week for riders who want more regular practice and continued progress.</p><a class="button button-secondary" href="/contact/?type=lessons">Enquire about twice weekly</a></article>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container split-layout">
      <div class="split-copy" data-reveal><span class="eyebrow">What is included</span><h2>More than time in the saddle.</h2><ul class="check-list"><li>Personal guidance from your riding instructor</li><li>Learning to notice and understand the horse</li><li>Well-trained, gentle lesson horses</li><li>Helmets provided when needed</li><li>Small classes with a maximum of four riders</li><li>Horse care, responsibility and safety education</li><li>Progress feedback and flexible scheduling options</li></ul></div>
      <div class="split-copy" data-reveal><span class="eyebrow">Weekly schedule</span><h2>Plan ahead with clear communication.</h2><p>A detailed lesson plan for the upcoming week is emailed every Monday.</p><p>Lessons are not scheduled or booked on Mondays, allowing time for schedule preparation and communication.</p><div class="contact-panel"><h3>Before your first lesson</h3><p>Tell us the rider’s age, experience and what they hope to learn. If the rider is a child, please use a parent or guardian’s contact details.</p></div></div>
    </div>
  </section>
  ${ctaBand("Take the first step into the saddle.", "lessons")}`;

await output("riding-lessons/index.html", page({
  title: "Horse Riding Lessons in Heidelberg, Gauteng | NietBegin",
  description: "Personal horse riding lessons near Heidelberg for beginners through advanced riders. Small classes, gentle horses and weekly options from R120.",
  path: "/riding-lessons/",
  active: "services",
  body: lessonBody,
  schemas: [organisationSchema, lessonSchema, breadcrumbSchema(lessonCrumbs)],
  socialImageName: "our-riders",
  socialImageAlt: "Riders learning together at NietBegin Stables near Heidelberg"
}));

const stablingCrumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services/" }, { name: "Stabling", path: "/stabling/" }];
const stablingSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${domain}/stabling/#service`,
  name: "Horse Stabling",
  url: `${domain}/stabling/`,
  description: "Horse-first stabling enquiries at a small, peaceful stable yard near Heidelberg, Gauteng.",
  serviceType: "Horse stabling and livery enquiries",
  provider: { "@id": `${domain}/#organisation` },
  areaServed: { "@type": "City", name: "Heidelberg, Gauteng" }
};
const stablingBody = `${pageHero("Horse stabling", "Horse stabling near Heidelberg, with heart.", "Individual attention and a horse-first approach at our small stable yard near Heidelberg, Gauteng.")}
  ${breadcrumbs(stablingCrumbs)}
  <section class="section">
    <div class="container split-layout">
      <div class="split-media" data-reveal>${picture("stable-yard-1", "The arena and sheltered stable areas at NietBegin")}</div>
      <div class="split-copy" data-reveal><span class="eyebrow">Stabling near Heidelberg</span><h2>Care shaped around the individual horse.</h2><p>NietBegin offers a calm, home-like yard where horses can feel safe, settle into their routine and receive personal attention.</p><p>Because every horse has different needs, stabling begins with a direct conversation about your horse, the space available and whether the yard is the right fit.</p><a class="button button-arrow" href="/contact/?type=stabling">Ask about stabling space</a></div>
    </div>
  </section>
  <section class="section section-blue">
    <div class="container">
      <div class="section-heading" data-reveal><span class="eyebrow">Our priorities</span><h2>Simple principles, followed every day.</h2></div>
      <div class="feature-grid">
        <article class="feature" data-reveal><span class="feature-icon">01</span><h3>A calm environment</h3><p>A small-yard atmosphere where horses are known as individuals rather than numbers.</p></article>
        <article class="feature" data-reveal><span class="feature-icon">02</span><h3>Personal attention</h3><p>Care and communication are approached around the needs and wellbeing of each horse.</p></article>
        <article class="feature" data-reveal><span class="feature-icon">03</span><h3>An honest fit</h3><p>We discuss your horse’s needs and current availability before arranging a yard visit.</p></article>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-heading" data-reveal><span class="eyebrow">How to enquire</span><h2>Three practical steps.</h2></div>
      <div class="feature-grid">
        <article class="feature" data-reveal><span class="feature-icon">01</span><h3>Tell us about your horse</h3><p>Share the horse’s age, routine, current care and what you are looking for in a yard.</p></article>
        <article class="feature" data-reveal><span class="feature-icon">02</span><h3>Discuss availability</h3><p>We will talk through current space and whether NietBegin may suit the horse’s needs.</p></article>
        <article class="feature" data-reveal><span class="feature-icon">03</span><h3>Visit by appointment</h3><p>If it looks like a good fit, arrange a time to see the yard and continue the conversation.</p></article>
      </div>
    </div>
  </section>
  ${ctaBand("Looking for a stable near Heidelberg?", "stabling")}`;

await output("stabling/index.html", page({
  title: "Horse Stabling in Heidelberg, Gauteng | NietBegin",
  description: "Ask about thoughtful horse stabling at a small, peaceful stable yard near Heidelberg, Gauteng, with individual attention and horse-first care.",
  path: "/stabling/",
  active: "services",
  body: stablingBody,
  schemas: [organisationSchema, stablingSchema, breadcrumbSchema(stablingCrumbs)],
  socialImageName: "stable-yard-1",
  socialImageAlt: "The peaceful arena and stable yard at NietBegin near Heidelberg"
}));

function horseCard(horse) {
  return `<article class="horse-card" data-horse-status="${horse.status}" data-reveal>
    <div class="horse-card-media">${picture(horse.images[0], `${horse.name}, ${horse.colour} ${horse.breed}`)}<span class="status-badge">${horse.statusLabel}</span></div>
    <div class="horse-card-content"><h2>${horse.name}</h2><p>${horse.summary}</p><dl class="horse-meta"><div><dt>Breed</dt><dd>${horse.breed}</dd></div><div><dt>Training</dt><dd>${horse.training}</dd></div></dl><a class="button button-secondary button-arrow" href="/horses/${horse.slug}/">View ${horse.name}’s profile</a></div>
  </article>`;
}

const horseCrumbs = [{ name: "Home", path: "/" }, { name: "Horses for sale", path: "/horses-for-sale/" }];
const horseListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Previously placed horses from NietBegin Stables",
  itemListElement: horses.map((horse, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${domain}/horses/${horse.slug}/`,
    name: horse.name,
    image: `${domain}${imagePath(horse.images[0], "jpg", wideImages.has(horse.images[0]))}`
  }))
};
const horsesBody = `${pageHero("Sales yard", "Horses for sale, matched with honesty.", "Explore previously placed horses and tell us what you are looking for in your next equine partner.")}
  ${breadcrumbs(horseCrumbs)}
  <section class="section">
    <div class="container">
      <div class="section-heading" data-reveal><span class="eyebrow">Horses for sale in Gauteng</span><h2>The right horse. The right rider. The right home.</h2><p>Horses in the NietBegin sales yard are approached with patience and care. Profiles remain available after a horse is sold so buyers can see the type of partnerships we have helped create.</p></div>
      <div class="filters" aria-label="Filter horse listings"><button class="filter-button" type="button" aria-pressed="true" data-horse-filter="all">All horses</button><button class="filter-button" type="button" aria-pressed="false" data-horse-filter="available">Available</button><button class="filter-button" type="button" aria-pressed="false" data-horse-filter="placed">Previously placed</button></div>
      <div class="horse-grid">${horses.map(horseCard).join("")}</div>
      <div class="contact-panel horse-empty" data-horse-empty hidden><h2>No horses are currently listed as available.</h2><p>Tell us what you are looking for and we will let you know if a suitable horse becomes available.</p><a class="button button-light" href="/contact/?type=horse-sales">Send a horse enquiry</a></div>
    </div>
  </section>
  <section class="section section-blue"><div class="container split-layout"><div class="split-copy" data-reveal><span class="eyebrow">Looking for a horse?</span><h2>Tell us about the rider first.</h2><p>Share the rider’s experience, goals, preferred discipline and the kind of partnership you hope to build. A clear conversation gives everyone a better starting point.</p><a class="button button-arrow" href="/contact/?type=horse-sales">Describe the horse you need</a></div><div class="split-media" data-reveal>${picture("horse-detail-2", "Close view of a horse at NietBegin", { useWide: false })}</div></div></section>`;

await output("horses-for-sale/index.html", page({
  title: "Horses for Sale in Gauteng | NietBegin Stables",
  description: "Explore the NietBegin sales yard and previously placed horses. Enquire about honest, horse-first matching for riders in Gauteng.",
  path: "/horses-for-sale/",
  active: "horses",
  body: horsesBody,
  schemas: [organisationSchema, horseListSchema, breadcrumbSchema(horseCrumbs)],
  socialImageName: "mateo-1",
  socialImageAlt: "Mateo, a previously placed horse from NietBegin Stables in Gauteng"
}));

function galleryButton(name, alt, caption) {
  const src = imagePath(name, "jpg", wideImages.has(name));
  return `<button class="gallery-item" type="button" data-lightbox-src="${src}" data-lightbox-alt="${alt}" data-lightbox-caption="${caption}">${picture(name, alt)}</button>`;
}

for (const horse of horses) {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Horses for sale", path: "/horses-for-sale/" }, { name: horse.name, path: `/horses/${horse.slug}/` }];
  const horseBody = `${pageHero("Previously placed horse", horse.name, `${horse.summary} This archived profile preserves the horse’s original listing details and photographs.`)}
    ${breadcrumbs(crumbs)}
    <section class="section">
      <div class="container profile-grid">
        <div>
          <div class="profile-main-image" data-reveal>${picture(horse.images[0], `${horse.name}, ${horse.colour} ${horse.breed}`, { eager: true })}</div>
          <div class="gallery-grid profile-gallery">${horse.images.slice(1).map((image, index) => galleryButton(image, `${horse.name} archive photograph ${index + 2}`, `${horse.name} · archive photograph ${index + 2}`)).join("")}</div>
        </div>
        <aside class="profile-summary" data-reveal aria-label="${horse.name} listing details">
          <span class="status-badge status-badge-static">${horse.statusLabel}</span>
          <h2 class="profile-name">${horse.name}</h2>
          <p>${horse.summary}</p>
          <dl class="horse-meta">
            <div><dt>Breed</dt><dd>${horse.breed}</dd></div>
            <div><dt>Age on listing</dt><dd>${horse.age}</dd></div>
            <div><dt>Colour</dt><dd>${horse.colour}</dd></div>
            <div><dt>Training</dt><dd>${horse.training}</dd></div>
          </dl>
          <a class="button button-arrow" href="/contact/?type=horse-sales&horse=${horse.slug}">Enquire about a similar horse</a>
          <a class="button button-text button-spaced" href="/horses-for-sale/">Back to the sales yard</a>
        </aside>
      </div>
    </section>
    ${ctaBand("Tell us about your ideal equine partner.", "horse-sales")}`;

  await output(`horses/${horse.slug}/index.html`, page({
    title: `${horse.name} | Previously Placed Horse | NietBegin Stables`,
    description: `${horse.name} is a ${horse.colour} ${horse.breed.toLowerCase()} with ${horse.training.toLowerCase()} training. View this archived NietBegin horse profile.`,
    path: `/horses/${horse.slug}/`,
    active: "horses",
    body: horseBody,
    schemas: [organisationSchema, {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${horse.name} – previously placed horse`,
      url: `${domain}/horses/${horse.slug}/`,
      description: horse.summary,
      primaryImageOfPage: `${domain}${imagePath(horse.images[0], "jpg", wideImages.has(horse.images[0]))}`,
      isPartOf: { "@id": `${domain}/#website` }
    }, breadcrumbSchema(crumbs)],
    socialImageName: horse.images[0],
    socialImageAlt: `${horse.name}, a ${horse.colour.toLowerCase()} ${horse.breed} previously placed by NietBegin Stables`
  }));
}

const galleryCrumbs = [{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery/" }];
const galleryBody = `${pageHero("Gallery", "Life at our Heidelberg stable yard.", "Meet our riders, see the Heidelberg landscape and take a closer look at everyday life around NietBegin Stables.")}
  ${breadcrumbs(galleryCrumbs)}
  <section class="section">
    <div class="container">
      <div class="section-heading" data-reveal><span class="eyebrow">Choose an album</span><h2>Life at NietBegin, as it happens.</h2><p>These photographs capture the people, horses and quiet spaces that shape the yard.</p></div>
      <div class="rate-grid">
        <article class="rate-card" data-reveal>${picture("our-riders", "The NietBegin riders together at the yard")}<div class="gallery-card-body"><span class="card-label">Riders and community</span><h2>Our riders</h2><p>The people learning, laughing and growing together at NietBegin.</p><a class="button button-secondary button-arrow" href="/gallery/our-riders/">Open the riders album</a></div></article>
        <article class="rate-card" data-reveal>${picture("stable-yard-1", "Wide view of the arena and stable yard")}<div class="gallery-card-body"><span class="card-label">The place horses call home</span><h2>Stable yard</h2><p>A tour through the arena, shelters and open Heidelberg countryside.</p><a class="button button-secondary button-arrow" href="/gallery/stable-yard/">Open the yard album</a></div></article>
      </div>
    </div>
  </section>
  ${ctaBand("Want to see the yard in person?", "yard-visit")}`;

await output("gallery/index.html", page({
  title: "Stable Yard & Riders Gallery | NietBegin Stables",
  description: "Explore photographs of NietBegin riders, horses, lessons and our peaceful stable yard in the Heidelberg countryside of Gauteng.",
  path: "/gallery/",
  active: "gallery",
  body: galleryBody,
  schemas: [organisationSchema, breadcrumbSchema(galleryCrumbs)],
  socialImageName: "our-riders",
  socialImageAlt: "NietBegin riders together beside the stable yard near Heidelberg"
}));

const ridersCrumbs = [{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery/" }, { name: "Our riders", path: "/gallery/our-riders/" }];
const ridersBody = `${pageHero("Gallery album", "Meet the riders who call NietBegin home.", "A small community of riders brought together by the joy of learning and a shared love of horses.")}
  ${breadcrumbs(ridersCrumbs)}
  <section class="section"><div class="container"><div class="gallery-grid">
    ${galleryButton("our-riders", "Seven NietBegin riders sitting together beside the arena", "Our riders · NietBegin Stables")}
    ${galleryButton("stephanie-jumping", "Stephanie Soutar and horse clearing a jump", "Stephanie jumping · NietBegin Stables")}
    ${galleryButton("jovani-4", "Young rider seated on Jovani at the yard", "A confident moment in the saddle")}
    ${galleryButton("coco-1", "Coco and rider taking a jump", "Coco and rider over a jump")}
  </div></div></section>
  ${ctaBand("Would you like to join our riding community?", "lessons")}`;

await output("gallery/our-riders/index.html", page({
  title: "Our Riders Gallery | NietBegin Stables Heidelberg",
  description: "Meet the riders who bring learning, friendship and a shared love of horses to NietBegin Stables near Heidelberg, Gauteng.",
  path: "/gallery/our-riders/",
  active: "gallery",
  body: ridersBody,
  schemas: [organisationSchema, breadcrumbSchema(ridersCrumbs)],
  socialImageName: "our-riders",
  socialImageAlt: "The close-knit riding community at NietBegin Stables near Heidelberg"
}));

const yardCrumbs = [{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery/" }, { name: "Stable yard", path: "/gallery/stable-yard/" }];
const yardBody = `${pageHero("Gallery album", "Tour our stable yard near Heidelberg.", "A look across the arena, shelters and open countryside that give NietBegin its sense of calm.")}
  ${breadcrumbs(yardCrumbs)}
  <section class="section"><div class="container"><div class="gallery-grid">
    ${galleryButton("stable-yard-1", "Wide view across the NietBegin arena and shelters", "The arena and yard in the Heidelberg countryside")}
    ${galleryButton("stable-yard-2", "Stable yard view at NietBegin", "Around the NietBegin stable yard")}
    ${galleryButton("stable-yard-3", "Arena and stable structures at NietBegin", "A quiet view across the yard")}
    ${galleryButton("yard-banner-1", "Panoramic view of the NietBegin stable yard", "NietBegin Stables panorama")}
    ${galleryButton("yard-banner-2", "Horses and stable yard near Heidelberg", "Life around the stable yard")}
    ${galleryButton("yard-banner-3", "Countryside stable view at NietBegin", "The yard and surrounding countryside")}
  </div></div></section>
  ${ctaBand("Arrange a quiet tour of the yard.", "yard-visit")}`;

await output("gallery/stable-yard/index.html", page({
  title: "Stable Yard Gallery | NietBegin Stables Heidelberg",
  description: "Tour the NietBegin arena, shelters and peaceful stable yard through photographs from the Heidelberg countryside in Gauteng.",
  path: "/gallery/stable-yard/",
  active: "gallery",
  body: yardBody,
  schemas: [organisationSchema, breadcrumbSchema(yardCrumbs)],
  socialImageName: "stable-yard-1",
  socialImageAlt: "A wide view across the NietBegin arena and stable yard near Heidelberg"
}));

const socialCrumbs = [{ name: "Home", path: "/" }, { name: "Social", path: "/social/" }];
const socialBody = `${pageHero("From the paddock", "Keep up with life at NietBegin.", "See the latest posts from our Facebook page, follow the horses’ everyday moments and share NietBegin with a fellow horse lover.")}
  ${breadcrumbs(socialCrumbs)}
  <section class="section social-section">
    <div class="container social-layout">
      <div class="social-copy" data-reveal>
        <span class="eyebrow">Our Facebook page</span>
        <h2>Fresh from the yard.</h2>
        <p>Our Facebook timeline is where we share recent photographs, everyday yard moments and updates from the NietBegin family.</p>
        <p>You can browse the latest posts here. To follow the page, leave a like or join the conversation, Facebook may ask you to sign in.</p>
        <div class="social-actions">
          <a class="button button-arrow" href="${facebookPageUrl}" target="_blank" rel="noopener noreferrer">Follow our page</a>
          <a class="button button-secondary" href="${facebookShareUrl}" target="_blank" rel="noopener noreferrer">Share our page</a>
        </div>
        ${ranchStamp()}
      </div>
      <div class="facebook-feed-shell" data-reveal>
        <div class="facebook-feed-header">
          <span class="facebook-mark" aria-hidden="true">f</span>
          <div><strong>NietBegin Stables</strong><span>Latest Facebook posts</span></div>
        </div>
        <iframe class="facebook-feed" title="Latest posts from NietBegin Stables on Facebook" src="${facebookPluginUrl}" width="500" height="800" loading="lazy" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
        <p class="facebook-feed-note">This feed is provided by Facebook. If it does not appear, <a href="${facebookPageUrl}" target="_blank" rel="noopener noreferrer">open the NietBegin Stables Facebook page</a>.</p>
      </div>
    </div>
  </section>
  <section class="section section-blue social-invitation">
    <div class="container">
      <div class="section-heading" data-reveal><span class="eyebrow">Stay part of the herd</span><h2>Three easy ways to join in.</h2></div>
      <div class="feature-grid social-step-grid">
        <article class="feature" data-reveal><span class="feature-icon" aria-hidden="true">01</span><h3>Follow</h3><p>Open our Facebook page and follow it to see new yard updates in your own feed.</p><a href="${facebookPageUrl}" target="_blank" rel="noopener noreferrer">Follow NietBegin</a></article>
        <article class="feature" data-reveal><span class="feature-icon" aria-hidden="true">02</span><h3>Like</h3><p>Like the moments that make you smile, from quiet horse time to days spent learning together.</p><a href="${facebookPageUrl}" target="_blank" rel="noopener noreferrer">Visit the latest posts</a></article>
        <article class="feature" data-reveal><span class="feature-icon" aria-hidden="true">03</span><h3>Share</h3><p>Know somebody who would feel at home here? Share the NietBegin page with them.</p><a href="${facebookShareUrl}" target="_blank" rel="noopener noreferrer">Share on Facebook</a></article>
      </div>
    </div>
  </section>
  ${ctaBand("Want to meet the horses in person?", "yard-visit")}`;

await output("social/index.html", page({
  title: "Facebook Updates | NietBegin Stables Heidelberg",
  description: "See the latest Facebook posts from NietBegin Stables near Heidelberg, then follow or share our horse-loving family-farm page.",
  path: "/social/",
  active: "social",
  body: socialBody,
  schemas: [organisationSchema, breadcrumbSchema(socialCrumbs)],
  socialImageName: "our-riders",
  socialImageAlt: "NietBegin riders and horses featured in updates from the Heidelberg stable yard"
}));

const faqs = [
  ["Do I need riding experience to take lessons?", "No. Lessons are available for complete beginners through advanced riders. Tell us about the rider’s experience so we can discuss the most suitable starting point."],
  ["Do I need my own horse?", "No. NietBegin has well-trained, gentle lesson horses. Horse availability is discussed when you enquire."],
  ["How long is a riding lesson?", "Lessons are approximately 30–40 minutes."],
  ["How much do lessons cost?", "One lesson per week is R120 per week. Two lessons per week are R200 per week."],
  ["Are riding helmets provided?", "Yes, helmets can be provided when needed."],
  ["How large are lesson groups?", "Classes are kept small, with a maximum of four riders."],
  ["Why are lessons not booked on Mondays?", "The upcoming week’s detailed lesson plan is prepared and emailed every Monday. Lessons are not scheduled that day."],
  ["How do I enquire about stabling?", "Use the contact form and choose Stabling. Tell us about your horse, current routine and what you need from a yard. We will discuss availability before arranging a visit."],
  ["Are any horses currently for sale?", "The website shows current availability and keeps sold horses in a previously placed archive. If no horse is listed as available, you can still tell us what you are looking for."],
  ["Can I visit the yard?", "Yes, but all visits are by appointment. The yard is near Heidelberg, Gauteng; precise directions are shared after a visit is arranged."],
  ["Who should I contact?", `General enquiries can be sent to ${email}, by WhatsApp to ${phoneDisplay}, or through the website contact form.`]
];
const faqCrumbs = [{ name: "Home", path: "/" }, { name: "Frequently asked questions", path: "/faq/" }];
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } }))
};
const faqBody = `${pageHero("Frequently asked questions", "Answers about lessons, stabling and yard visits.", "Find practical information about riding lessons, stabling, horse sales and visiting NietBegin Stables near Heidelberg.")}
  ${breadcrumbs(faqCrumbs)}
  <section class="section"><div class="narrow"><div class="faq-list">${faqs.map(([question, answer]) => `<details class="faq-item" data-reveal><summary>${question}</summary><div class="faq-answer"><p>${answer}</p></div></details>`).join("")}</div></div></section>
  ${ctaBand("Still have a question?")}`;

await output("faq/index.html", page({
  title: "Riding Lessons & Stabling FAQ | NietBegin Stables",
  description: "Find answers about riding lessons, prices, helmets, lesson horses, stabling enquiries, horse sales and visiting NietBegin Stables by appointment.",
  path: "/faq/",
  active: "faq",
  body: faqBody,
  schemas: [organisationSchema, faqSchema, breadcrumbSchema(faqCrumbs)],
  socialImageName: "stable-yard-1",
  socialImageAlt: "The NietBegin stable yard near Heidelberg, home to lessons, stabling and horse care"
}));

const contactCrumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }];
const contactBody = `${pageHero("Contact NietBegin", "Contact our Heidelberg stable yard.", "Ask about lessons, stabling, horse sales or a visit to the yard. We will respond using the details you provide.")}
  ${breadcrumbs(contactCrumbs)}
  <section class="section">
    <div class="container contact-grid">
      <aside class="contact-panel" data-reveal>
        <span class="eyebrow">Direct contact</span><h2>Prefer to call or message?</h2>
        <div class="contact-method"><span>Owner · Sunette Van Tonder</span><a href="tel:+27827828761">082 782 8761</a></div>
        <div class="contact-method"><span>Stable Manager · Stephanie Soutar</span><a href="tel:+27793545930">079 354 5930</a></div>
        <div class="contact-method"><span>Email</span><a href="mailto:${email}">${email}</a></div>
        <div class="button-row contact-whatsapp"><a class="button button-light" href="${whatsapp}">Chat on WhatsApp</a></div>
      </aside>
      <div data-reveal>
        <span class="eyebrow">Enquiry form</span><h2>Send your details.</h2>
        <form data-contact-form novalidate>
          <div class="form-grid">
            <div class="field"><label for="from-name">Your name</label><input id="from-name" name="from_name" autocomplete="name" required></div>
            <div class="field"><label for="reply-to">Email address</label><input id="reply-to" type="email" name="reply_to" autocomplete="email" required></div>
            <div class="field"><label for="phone">Mobile number</label><input id="phone" type="tel" name="phone" autocomplete="tel" inputmode="tel" required></div>
            <div class="field"><label for="enquiry-type">What can we help with?</label><select id="enquiry-type" name="enquiry_type" required><option value="">Choose an enquiry</option><option value="lessons">Riding lessons</option><option value="stabling">Stabling</option><option value="horse-sales">Horse sales</option><option value="yard-visit">Yard visit</option><option value="other">Something else</option></select></div>
            <div class="field field-full"><label for="message">Your message</label><textarea id="message" name="message" required minlength="10" placeholder="Share enough detail for us to give you a useful reply."></textarea></div>
            <input type="hidden" name="page_url" value="">
            <div class="honeypot" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
            <label class="consent field-full"><input type="checkbox" name="privacy_consent" value="yes" required><span>I agree that NietBegin Stables may use these details to respond to my enquiry. I have read the <a href="/privacy/">privacy notice</a>.</span></label>
            <div class="field-full"><button class="button button-arrow" type="submit"><span data-submit-label>Send my enquiry</span></button><p class="form-status" tabindex="-1" role="status" aria-live="polite" data-form-status></p></div>
          </div>
        </form>
      </div>
    </div>
  </section>
  <section class="section section-blue">
    <div class="container map-card" data-reveal>
      <iframe title="General map of Heidelberg, Gauteng" src="https://www.google.com/maps?q=Heidelberg%2C%20Gauteng%2C%20South%20Africa&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div class="map-content"><span class="appointment-note">Visits by appointment</span><h2>Near Heidelberg, Gauteng.</h2><p>For the safety and privacy of the yard, precise directions are shared after your visit has been arranged.</p><a class="button button-secondary" href="/contact/?type=yard-visit">Arrange a yard visit</a></div>
    </div>
  </section>`;

await output("contact/index.html", page({
  title: "Contact NietBegin Stables | Heidelberg, Gauteng",
  description: "Contact NietBegin Stables about riding lessons, horse stabling, the sales yard or a visit by appointment near Heidelberg, Gauteng.",
  path: "/contact/",
  active: "contact",
  body: contactBody,
  schemas: [organisationSchema, breadcrumbSchema(contactCrumbs)],
  socialImageName: "stable-yard-3",
  socialImageAlt: "NietBegin Stables in the countryside near Heidelberg, Gauteng",
  contactScripts: true
}));

const privacyCrumbs = [{ name: "Home", path: "/" }, { name: "Privacy notice", path: "/privacy/" }];
const privacyBody = `${pageHero("Privacy notice", "How enquiry information is handled.", "A plain-language explanation of the personal information collected through this website and why it is needed.")}
  ${breadcrumbs(privacyCrumbs)}
  <article class="section"><div class="narrow prose">
    <p><strong>Effective date:</strong> 29 August 2026</p>
    <p>NietBegin Stables respects your privacy. This notice applies to information submitted through the website enquiry form or provided when you contact us directly.</p>
    <h2>Information we collect</h2><p>The enquiry form may collect your name, email address, mobile number, enquiry type, the horse you are interested in, and the message you choose to send.</p>
    <h2>Why we use it</h2><p>We use this information only to understand and respond to your enquiry, arrange a visit, or discuss a requested service. The website does not use enquiry details for a newsletter or unrelated marketing.</p>
    <h2>Email delivery</h2><p>Form submissions are sent through our own secure form service, which delivers the enquiry to ${email}. The service processes the details only to deliver your message, and its handling of information is governed by its own service and privacy terms.</p>
    <h2>Children’s information</h2><p>If you are enquiring about lessons for a child, please provide a parent or guardian’s contact details. Do not include unnecessary sensitive information about a child in the message.</p>
    <h2>How long information is kept</h2><p>Enquiry information is kept only for as long as reasonably needed to respond, provide the requested service and maintain appropriate business records.</p>
    <h2>Sharing and security</h2><p>We do not sell personal information. Information may be processed by the communication services needed to deliver and respond to an enquiry. Reasonable steps are taken to limit access and protect the information under our control.</p>
    <h2>Your choices</h2><p>You may ask what enquiry information we hold about you, request a correction, or ask that information no longer needed be deleted. Contact <a href="mailto:${email}">${email}</a> or call <a href="tel:${phoneInternational}">${phoneDisplay}</a>.</p>
    <h2>Questions or concerns</h2><p>Contact us first so we can address your concern. You may also learn more about South Africa’s privacy framework from the <a href="https://inforegulator.org.za/">Information Regulator</a>.</p>
  </div></article>`;

await output("privacy/index.html", page({
  title: "Website Privacy Notice | NietBegin Stables",
  description: "Read how NietBegin Stables collects, uses and protects personal information submitted through the website enquiry form.",
  path: "/privacy/",
  active: "",
  body: privacyBody,
  schemas: [organisationSchema, breadcrumbSchema(privacyCrumbs)],
  socialImageName: "stable-yard-1",
  socialImageAlt: "The peaceful NietBegin stable yard near Heidelberg, Gauteng"
}));

const errorBody = `<section class="error-page"><div class="narrow"><p class="error-code" aria-hidden="true">404</p><span class="eyebrow">That trail ends here</span><h1>Page not found.</h1><p>The page may have moved, or the link may no longer be available.</p><div class="button-row button-row-centered"><a class="button" href="/">Return home</a><a class="button button-secondary" href="/contact/">Contact us</a></div></div></section>`;

await output("404.html", page({
  title: "Page Not Found | NietBegin Stables",
  description: "The requested page could not be found on the NietBegin Stables website.",
  path: "/404.html",
  active: "",
  body: errorBody,
  robots: "noindex, follow",
  socialImageName: "stable-yard-1",
  socialImageAlt: "The NietBegin stable yard near Heidelberg"
}));

const sitemapPaths = [
  "/",
  "/about/",
  "/services/",
  "/riding-lessons/",
  "/stabling/",
  "/horses-for-sale/",
  ...horses.map((horse) => `/horses/${horse.slug}/`),
  "/gallery/",
  "/gallery/our-riders/",
  "/gallery/stable-yard/",
  "/social/",
  "/faq/",
  "/contact/",
  "/privacy/"
];

const sitemapImages = {
  "/": ["horse-detail-2", "our-riders", "stable-yard-1", "mateo-1"],
  "/about/": ["our-riders", "stephanie-jumping"],
  "/services/": ["our-riders", "stable-yard-2", "coco-1"],
  "/riding-lessons/": ["stephanie-jumping", "our-riders"],
  "/stabling/": ["stable-yard-1", "stable-yard-2"],
  "/horses-for-sale/": horses.map((horse) => horse.images[0]),
  ...Object.fromEntries(horses.map((horse) => [`/horses/${horse.slug}/`, horse.images])),
  "/gallery/": ["our-riders", "stable-yard-1"],
  "/gallery/our-riders/": ["our-riders", "stephanie-jumping", "jovani-4", "coco-1"],
  "/gallery/stable-yard/": ["stable-yard-1", "stable-yard-2", "stable-yard-3", "yard-banner-1", "yard-banner-2", "yard-banner-3"],
  "/social/": ["our-riders"],
  "/faq/": ["stable-yard-1"],
  "/contact/": ["stable-yard-3"],
  "/privacy/": ["stable-yard-1"]
};

await output("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapPaths.map((path) => `  <url><loc>${domain}${path}</loc><lastmod>${lastModified}</lastmod>${(sitemapImages[path] ?? []).map((name) => `<image:image><image:loc>${domain}${imagePath(name, "jpg", wideImages.has(name))}</image:loc></image:image>`).join("")}</url>`).join("\n")}
</urlset>`);

await output("robots.txt", `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml
`);

await output("site.webmanifest", JSON.stringify({
  name: "NietBegin Stables",
  short_name: "NietBegin",
  description: "Horse riding lessons, stabling and horse sales near Heidelberg, Gauteng.",
  start_url: "/",
  display: "standalone",
  background_color: "#F7F7FC",
  theme_color: "#002A22",
  icons: [{ src: "/assets/images/brand-mark.svg", sizes: "any", type: "image/svg+xml" }]
}, null, 2));

await output("_redirects", `http://nietbegin.co.za/* https://nietbegin.co.za/:splat 301!
http://www.nietbegin.co.za/* https://nietbegin.co.za/:splat 301!
https://www.nietbegin.co.za/* https://nietbegin.co.za/:splat 301!
/home / 301
/index.php / 301
/wabout.php /about/ 301
/about /about/ 301
/wcontact.php /contact/ 301
/contact /contact/ 301
/cp/39992/* /horses-for-sale/ 301
/cp/40027/* /riding-lessons/ 301
/cp/39993/* /gallery/ 301
/cp/39994/* /gallery/our-riders/ 301
/cp/39995/* /gallery/stable-yard/ 301
/cp/40020/* /horses/mateo/ 301
/cp/40023/* /horses/jovani/ 301
/cp/40024/* /horses/coco/ 301
/cp/40166/* /404.html 410
/p/1062597/* /404.html 410
/p/1062598/* /404.html 410
/wmenu.php /404.html 410
/wevents.php /404.html 410
/wdocs.php /404.html 410
/wfaq.php /404.html 410
/wadditional_pages.php /404.html 410
/wnews.php /404.html 410
/wspecials.php /404.html 410
`);

await output("_headers", `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-Permitted-Cross-Domain-Policies: none
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin-allow-popups
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://report.goodstuffdesigns.co.za; frame-src https://www.google.com https://maps.google.com https://www.facebook.com; form-action 'self'; base-uri 'self'; frame-ancestors 'self'; upgrade-insecure-requests

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: no-cache
`);

await output(".htaccess", `ErrorDocument 404 /404.html

RewriteEngine On
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} ^www\\. [NC]
RewriteRule ^ https://nietbegin.co.za%{REQUEST_URI} [R=301,L,NE]

RedirectMatch 301 ^/(?:home|index\\.php)$ /
RedirectMatch 301 ^/(?:about|wabout\\.php)$ /about/
RedirectMatch 301 ^/(?:contact|wcontact\\.php)$ /contact/
RedirectMatch 301 ^/cp/39992/(?:for-sale(?:\\.php)?)?/?$ /horses-for-sale/
RedirectMatch 301 ^/cp/40027/(?:lessons(?:\\.php)?)?/?$ /riding-lessons/
RedirectMatch 301 ^/cp/39993/(?:gallery(?:\\.php)?)?/?$ /gallery/
RedirectMatch 301 ^/cp/39994/(?:our-riders(?:\\.php)?)?/?$ /gallery/our-riders/
RedirectMatch 301 ^/cp/39995/(?:nietbegin-stables(?:\\.php)?)?/?$ /gallery/stable-yard/
RedirectMatch 301 ^/cp/40020/(?:mateo(?:\\.php)?)?/?$ /horses/mateo/
RedirectMatch 301 ^/cp/40023/(?:jovani(?:\\.php)?)?/?$ /horses/jovani/
RedirectMatch 301 ^/cp/40024/(?:coco(?:\\.php)?)?/?$ /horses/coco/
RedirectMatch 410 ^/cp/40166(?:/.*)?$
RedirectMatch 410 ^/p/106259[78](?:/.*)?$
RedirectMatch 410 ^/(?:wmenu|wevents|wdocs|wfaq|wgallery|wadditional_pages|wnews|wspecials)\\.php$

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript application/javascript application/json application/xml image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Permitted-Cross-Domain-Policies "none"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  Header always set Cross-Origin-Opener-Policy "same-origin-allow-popups"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://report.goodstuffdesigns.co.za; frame-src https://www.google.com https://maps.google.com https://www.facebook.com; form-action 'self'; base-uri 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
  <FilesMatch "\\.(?:avif|webp|jpg|jpeg|png|svg|woff2|css|js)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html?$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`);

console.log(`Built ${sitemapPaths.length} indexable pages plus a custom 404 page.`);
