/**
 * SEO-Prüfung gegen das gebaute HTML.
 *
 * Geprüft wird, was Suchmaschinen tatsächlich bekommen: die vorgerenderten
 * Seiten aus `.next/server/app`, nicht der Quelltext. So fallen auch Fehler
 * auf, die erst beim Rendern entstehen – eine H1 mit versteckten Wörtern, ein
 * fehlender Canonical, ein kaputter interner Link.
 *
 * Ausführen nach `npm run build`:  npm run check:seo
 */
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const APP_DIR = ".next/server/app";
const SITE = "https://www.gleistrix.de";

const TITLE_MAX = 70;
const DESCRIPTION_MIN = 70;
const DESCRIPTION_MAX = 170;

/** Wörter, die nur mit Produktbeleg auf die Seite dürfen (siehe SEO-OPTIMIERUNG.md). */
const UNBELEGT = [/x-?rechnung/i, /revisionssicher/i, /tauglichkeit/i, /rechtssicher für/i];
/**
 * Ausgenommen: Integrationsseiten ohne Produktbeleg (Entscheidung offen, siehe
 * SEO-OPTIMIERUNG.md) und die Demo-Seite mit ihren Kundenstimmen.
 */
const CLAIM_EXEMPT = [/^\/integrationen\/(lexoffice|sevdesk|stripe|paypal|agenda|telegram|cal-com|calendly|indeed|stepstone)$/, /^\/demo-buchen$/];

const EXPECTED_H1 = {
  "/": "ERP-Software für Bahnbau und Bahndienstleister",
  "/branchen/sicherungsunternehmen": "Software für Sicherungsunternehmen: SiPo-Einsätze digital planen",
  "/branchen/gleisbauunternehmen": "Gleisbau-Software für Baustellen, Ressourcen und Abrechnung",
};
const EXPECTED_TITLE = {
  "/": "ERP-Software für Bahnbau & Bahndienstleister | Gleistrix",
  "/branchen/sicherungsunternehmen": "Software für Sicherungsunternehmen & SiPo-Planung | Gleistrix",
  "/branchen/gleisbauunternehmen": "Gleisbau-Software für Planung & Abrechnung | Gleistrix",
};

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const decode = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
const textOf = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** Nur öffentliche Seiten – kein Admin, keine Fehlerseiten. */
const pages = walk(APP_DIR)
  .filter((file) => file.endsWith(".html"))
  .map((file) => {
    const route = "/" + relative(APP_DIR, file).replace(/\.html$/, "").replace(/(^|\/)index$/, "");
    return { route: route === "/" ? "/" : route.replace(/\/$/, ""), html: readFileSync(file, "utf8") };
  })
  .filter(({ route }) => !route.startsWith("/admin") && !route.startsWith("/_"));

assert.ok(pages.length > 20, `Zu wenige vorgerenderte Seiten gefunden (${pages.length}) – lief der Build?`);

/** Öffentliche Seiten, die serverseitig gerendert werden und deshalb kein HTML im Build haben. */
const DYNAMIC_ROUTES = ["/preise"];
const knownRoutes = new Set([...pages.map((page) => page.route), ...DYNAMIC_ROUTES]);
const errors = new Set();
/** Routen mit noindex – dürfen nicht in der Sitemap stehen. */
const noindexRoutes = new Set();
/**
 * Aussagen, die aus gepflegten Inhalten stammen können (Blog, Startseiten-
 * Karussell aus dem Adminbereich). Sie werden gemeldet, lassen den Check aber
 * nicht scheitern – der Code kann sie nicht ändern, nur der Adminbereich.
 */
const warnings = new Set();
const seenTitles = new Map();
const seenDescriptions = new Map();

for (const { route, html } of pages) {
  const fail = (message) => errors.add(`${route}: ${message}`);
  const headEnd = html.indexOf("</head>");
  const head = headEnd === -1 ? html : html.slice(0, headEnd);

  const title = decode(/<title>([^<]*)<\/title>/.exec(head)?.[1] ?? "");
  if (!title) fail("kein <title>");
  else if (title.length > TITLE_MAX) fail(`Title zu lang (${title.length}): ${title}`);
  if (EXPECTED_TITLE[route] && title !== EXPECTED_TITLE[route]) fail(`Title "${title}" statt "${EXPECTED_TITLE[route]}"`);

  const description = decode(/<meta name="description" content="([^"]*)"/.exec(head)?.[1] ?? "");
  if (!description) fail("keine Meta-Description");
  else if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    fail(`Description-Länge ${description.length}: ${description}`);
  }

  const robots = /<meta name="robots" content="([^"]*)"/.exec(head)?.[1] ?? "";
  const indexable = !robots.includes("noindex");
  if (!indexable) noindexRoutes.add(route);

  const canonical = /<link rel="canonical" href="([^"]*)"/.exec(head)?.[1];
  if (!canonical) fail("kein Canonical");
  else {
    if (!canonical.startsWith(SITE)) fail(`Canonical nicht auf ${SITE}: ${canonical}`);
    if (canonical !== SITE && canonical.endsWith("/")) fail(`Canonical mit Schrägstrich am Ende: ${canonical}`);
  }

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((match) => textOf(match[1]));
  if (h1s.length !== 1) fail(`${h1s.length} H1 statt genau einer`);
  if (EXPECTED_H1[route] && h1s[0] !== EXPECTED_H1[route]) fail(`H1 "${h1s[0]}" statt "${EXPECTED_H1[route]}"`);

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(json);
      if (!data["@context"] || !data["@type"]) fail(`JSON-LD ohne @context/@type: ${json.slice(0, 80)}`);
    } catch {
      fail(`JSON-LD nicht parsebar: ${json.slice(0, 80)}`);
    }
  }

  for (const [, href] of html.matchAll(/<a[^>]+href="(\/[^"#?]*)/g)) {
    const target = href === "/" ? "/" : href.replace(/\/$/, "");
    const isAsset = /\.[a-z0-9]+$/i.test(target);
    if (!isAsset && !knownRoutes.has(target) && !target.startsWith("/admin") && !target.startsWith("/api")) {
      fail(`interner Link ins Leere: ${href}`);
    }
  }

  if (indexable && canonical === `${SITE}${route === "/" ? "" : route}`) {
    const seenTitle = seenTitles.get(title);
    if (seenTitle) fail(`Title doppelt mit ${seenTitle}`);
    seenTitles.set(title, route);
    const seenDescription = seenDescriptions.get(description);
    if (seenDescription) fail(`Description doppelt mit ${seenDescription}`);
    seenDescriptions.set(description, route);
  }

  if (!CLAIM_EXEMPT.some((pattern) => pattern.test(route))) {
    const body = textOf(html.slice(html.indexOf("<body")).replace(/<script[\s\S]*?<\/script>/g, " "));
    for (const pattern of UNBELEGT) {
      if (pattern.test(body)) warnings.add(`${route}: unbelegte Aussage im Text: ${pattern}`);
    }
  }
}

// Sitemap: nur Seiten, die es gibt, alle auf der kanonischen Domain.
const sitemap = readFileSync(join(APP_DIR, "sitemap.xml.body"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.ok(locs.length > 20, `Sitemap mit nur ${locs.length} Einträgen`);
for (const loc of locs) {
  if (!loc.startsWith(SITE)) errors.add(`sitemap: fremde Domain ${loc}`);
  const route = loc.slice(SITE.length) || "/";
  if (!knownRoutes.has(route)) errors.add(`sitemap: Seite existiert nicht ${loc}`);
  if (noindexRoutes.has(route)) errors.add(`sitemap: Seite steht auf noindex ${loc}`);
  if (route.startsWith("/admin") || route.startsWith("/api")) errors.add(`sitemap: privater Bereich ${loc}`);
}

// robots.txt: öffentlich crawlbar, Admin und API gesperrt, Sitemap verlinkt.
const robotsTxt = readFileSync(join(APP_DIR, "robots.txt.body"), "utf8");
assert.match(robotsTxt, /Allow: \//);
assert.match(robotsTxt, /Disallow: \/admin/);
assert.match(robotsTxt, /Disallow: \/api/);
assert.match(robotsTxt, new RegExp(`Sitemap: ${SITE}/sitemap.xml`));

if (warnings.size > 0) {
  console.warn(`Hinweise (${warnings.size}) – Inhalte prüfen, ggf. im Adminbereich:\n` + [...warnings].map((warning) => `  - ${warning}`).join("\n"));
}
if (errors.size > 0) {
  console.error(`SEO-Prüfung: ${errors.size} Befund(e)\n` + [...errors].map((error) => `  - ${error}`).join("\n"));
  process.exit(1);
}
console.log(`SEO-Prüfung bestanden: ${pages.length} Seiten, ${locs.length} Sitemap-Einträge.`);
