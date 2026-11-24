import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const ignoredDirectories = new Set(["node_modules", "source", "tools"]);
const errors = [];
const titles = new Map();
const descriptions = new Map();
const indexableCanonicals = new Set();
let htmlCount = 0;
let jsonLdCount = 0;

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function routeToFile(href) {
  const clean = href.split(/[?#]/)[0];
  if (!clean.startsWith("/")) return null;
  const path = clean === "/" ? "index.html" : clean.replace(/^\//, "");
  if (extname(path)) return join(root, path);
  return join(root, path, "index.html");
}

for (const file of await collect(root)) {
  if (extname(file) !== ".html") continue;
  htmlCount += 1;
  const rel = relative(root, file).replaceAll("\\", "/");
  const html = await readFile(file, "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1]?.trim();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const robots = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] ?? "";
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
  const mainCount = (html.match(/<main(?:\s|>)/gi) || []).length;

  if (!title) errors.push(`${rel}: missing title`);
  if (!description) errors.push(`${rel}: missing description`);
  if (!canonical) errors.push(`${rel}: missing canonical`);
  if (h1Count !== 1) errors.push(`${rel}: expected one H1, found ${h1Count}`);
  if (mainCount !== 1) errors.push(`${rel}: expected one main landmark, found ${mainCount}`);
  if (/equicourse/i.test(html)) errors.push(`${rel}: excluded content appears in HTML`);
  if (/style="/i.test(html)) errors.push(`${rel}: inline style conflicts with the production Content Security Policy`);
  if (!/<link rel="alternate" hreflang="en-ZA" href="https:\/\/nietbegin\.co\.za\//i.test(html)) errors.push(`${rel}: missing en-ZA hreflang`);

  if (!robots.includes("noindex")) {
    if (title && (title.length < 30 || title.length > 65)) errors.push(`${rel}: title length ${title.length} is outside the 30–65 character quality range`);
    if (description && (description.length < 90 || description.length > 170)) errors.push(`${rel}: description length ${description.length} is outside the 90–170 character quality range`);
    if (canonical) indexableCanonicals.add(canonical);
    if (!robots.includes("max-image-preview:large")) errors.push(`${rel}: indexable page does not allow large image previews`);
  }

  for (const property of ["og:title", "og:description", "og:url", "og:image", "og:image:width", "og:image:height", "og:image:alt"]) {
    if (!html.includes(`property="${property}"`)) errors.push(`${rel}: missing ${property}`);
  }
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"]) {
    if (!html.includes(`name="${name}"`)) errors.push(`${rel}: missing ${name}`);
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
      jsonLdCount += 1;
    } catch (error) {
      errors.push(`${rel}: invalid JSON-LD (${error.message})`);
    }
  }

  if (!robots.includes("noindex") && !/<script type="application\/ld\+json">[^<]*"@type":"WebPage"/i.test(html)) {
    errors.push(`${rel}: missing WebPage structured data`);
  }

  if (title) {
    if (titles.has(title)) errors.push(`${rel}: duplicate title with ${titles.get(title)}`);
    titles.set(title, rel);
  }
  if (description) {
    if (descriptions.has(description)) errors.push(`${rel}: duplicate description with ${descriptions.get(description)}`);
    descriptions.set(description, rel);
  }

  const links = [...html.matchAll(/href="([^"]+)"/gi)].map((match) => match[1]);
  for (const href of links) {
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http") || href.startsWith("#")) continue;
    const target = routeToFile(href);
    if (target && !existsSync(normalize(target))) errors.push(`${rel}: broken internal link ${href}`);
  }

  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/gi)].map((match) => match[1].split(/[?#]/)[0]);
  for (const asset of assets) {
    if (!existsSync(join(root, asset.replace(/^\//, "")))) errors.push(`${rel}: missing asset ${asset}`);
  }

  for (const image of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = image[1];
    if (!/\balt="[^"]*"/i.test(attributes)) errors.push(`${rel}: image missing alt attribute`);
    if (!/data-lightbox-image/i.test(attributes) && (!/\bwidth="\d+"/i.test(attributes) || !/\bheight="\d+"/i.test(attributes))) {
      errors.push(`${rel}: image missing explicit width or height`);
    }
  }

  for (const link of html.matchAll(/<a\b([^>]*)target="_blank"([^>]*)>/gi)) {
    const attributes = `${link[1]} ${link[2]}`;
    if (!/rel="[^"]*noopener[^"]*noreferrer[^"]*"/i.test(attributes)) errors.push(`${rel}: target=_blank link missing noopener noreferrer`);
  }
}

const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>(https:\/\/nietbegin\.co\.za\/[^<]*)<\/loc>/g)].map((match) => match[1]).filter((url) => !url.includes("/assets/")));
for (const canonical of indexableCanonicals) if (!sitemapUrls.has(canonical)) errors.push(`sitemap.xml: missing indexable canonical ${canonical}`);
for (const url of sitemapUrls) if (!indexableCanonicals.has(url)) errors.push(`sitemap.xml: includes non-indexable or unknown URL ${url}`);

for (const match of sitemap.matchAll(/<image:loc>https:\/\/nietbegin\.co\.za(\/assets\/[^<]+)<\/image:loc>/g)) {
  if (!existsSync(join(root, match[1].replace(/^\//, "")))) errors.push(`sitemap.xml: missing image asset ${match[1]}`);
}

if (!existsSync(join(root, "assets", "images", "nietbegin-logo-transparent.png"))) errors.push("missing transparent logo asset");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Checked ${htmlCount} HTML files and ${jsonLdCount} JSON-LD blocks: metadata, headings, internal links, assets and schema syntax all pass.`);
