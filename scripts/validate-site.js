#!/usr/bin/env node
// VARGO statische sitevalidator. Draait op Node zelf, zonder externe pakketten.
// Faalt met exit code 1 zodra er een kritieke fout is.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOMEIN = 'https://vargo.be';
const OVERSLAAN = ['node_modules', '.git', 'docs', 'scripts', 'netlify', 'assets', 'images'];

const fouten = [];
const waarschuwingen = [];
const fout = (bestand, tekst) => fouten.push({ bestand, tekst });
const waarschuw = (bestand, tekst) => waarschuwingen.push({ bestand, tekst });

function zoekHtml(map, uit = []) {
  for (const naam of fs.readdirSync(map)) {
    if (OVERSLAAN.includes(naam)) continue;
    const vol = path.join(map, naam);
    if (fs.statSync(vol).isDirectory()) zoekHtml(vol, uit);
    else if (naam.endsWith('.html')) uit.push(vol);
  }
  return uit;
}

const paginas = zoekHtml(ROOT).sort();
const relatief = (v) => path.relative(ROOT, v).split(path.sep).join('/');
const urlVoor = (rel) => (rel === 'index.html' ? DOMEIN + '/' : DOMEIN + '/' + rel);

const alles = new Map();
for (const vol of paginas) alles.set(relatief(vol), fs.readFileSync(vol, 'utf8'));

const tussen = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };

function metaInhoud(html, naam) {
  const a = html.match(new RegExp('<meta[^>]+name=["\']' + naam + '["\'][^>]*content=["\']([^"\']*)["\']', 'i'));
  if (a) return a[1];
  const b = html.match(new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*name=["\']' + naam + '["\']', 'i'));
  return b ? b[1] : null;
}

function canonicalVan(html) {
  const a = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  if (a) return a[1];
  const b = html.match(/<link[^>]+href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  return b ? b[1] : null;
}

const isNoindex = (html) => /noindex/i.test(metaInhoud(html, 'robots') || '');

function bestaatLokaal(pad) {
  const schoon = pad.split('#')[0].split('?')[0];
  if (!schoon.startsWith('/')) return null;
  return fs.existsSync(path.join(ROOT, schoon.slice(1)));
}

// ---- HTML en metadata ----
const titels = new Map();
const canonicals = new Map();

for (const [rel, html] of alles) {
  const noindex = isNoindex(html);

  const h1s = html.match(/<h1[\s>]/gi) || [];
  if (h1s.length !== 1) fout(rel, 'verwacht precies 1 <h1>, gevonden ' + h1s.length);

  const titel = tussen(html, /<title>([\s\S]*?)<\/title>/i);
  if (!titel) fout(rel, 'geen <title>');
  else if (!noindex) {
    if (titels.has(titel)) fout(rel, 'dubbele titel, ook op ' + titels.get(titel) + ': "' + titel + '"');
    else titels.set(titel, rel);
  }

  const desc = metaInhoud(html, 'description');
  if (!desc) fout(rel, 'geen meta description');
  else if (desc.length < 50) waarschuw(rel, 'meta description erg kort (' + desc.length + ' tekens)');
  else if (desc.length > 165) waarschuw(rel, 'meta description erg lang (' + desc.length + ' tekens)');

  const canon = canonicalVan(html);
  if (!canon) { if (!noindex) fout(rel, 'geen canonical'); }
  else {
    if (canon.indexOf(DOMEIN) !== 0) fout(rel, 'canonical verwijst niet naar ' + DOMEIN + ': ' + canon);
    else {
      const doel = canon.slice(DOMEIN.length).replace(/^\//, '') || 'index.html';
      if (!fs.existsSync(path.join(ROOT, doel))) fout(rel, 'canonical verwijst naar onbestaande pagina: ' + canon);
    }
    if (!noindex) {
      if (canonicals.has(canon)) fout(rel, 'dubbele canonical, ook op ' + canonicals.get(canon) + ': ' + canon);
      else canonicals.set(canon, rel);
    }
  }

  const leeg = html.match(/href=["']\s*["']/g) || [];
  if (leeg.length) fout(rel, leeg.length + ' lege href(s)');

  for (const h of new Set([...html.matchAll(/href=["'](\/[^"']*)["']/g)].map(m => m[1])))
    if (bestaatLokaal(h) === false) fout(rel, 'interne link naar onbestaand bestand: ' + h);

  for (const s of new Set([...html.matchAll(/src=["'](\/[^"']*)["']/g)].map(m => m[1])))
    if (bestaatLokaal(s) === false) fout(rel, 'ontbrekend asset: ' + s);

  for (const s of new Set([...html.matchAll(/<link[^>]+href=["'](\/[^"']*\.css)["']/g)].map(m => m[1])))
    if (bestaatLokaal(s) === false) fout(rel, 'ontbrekende stylesheet: ' + s);
}

// ---- CSS en lettertypes ----
const cssPad = path.join(ROOT, 'assets/css/site.css');
if (!fs.existsSync(cssPad)) fout('assets/css/site.css', 'stylesheet ontbreekt');
else {
  const css = fs.readFileSync(cssPad, 'utf8');
  for (const u of new Set([...css.matchAll(/url\(['"]?(\/[^'")]+)['"]?\)/g)].map(m => m[1])))
    if (!fs.existsSync(path.join(ROOT, u.slice(1)))) fout('assets/css/site.css', 'ontbrekend bestand in CSS: ' + u);
  for (const i of [...css.matchAll(/@import\s+url\(['"]?([^'")]+)['"]?\)/g)].map(m => m[1])) {
    if (i.charAt(0) === '/' && !fs.existsSync(path.join(ROOT, i.slice(1)))) fout('assets/css/site.css', 'ontbrekende @import: ' + i);
    if (/^https?:/.test(i)) waarschuw('assets/css/site.css', 'externe @import: ' + i);
  }
}

const fontsCss = path.join(ROOT, 'assets/fonts/fonts.css');
if (fs.existsSync(fontsCss)) {
  const fc = fs.readFileSync(fontsCss, 'utf8');
  for (const u of new Set([...fc.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)].map(m => m[1])))
    if (u.charAt(0) === '/' && !fs.existsSync(path.join(ROOT, u.slice(1)))) fout('assets/fonts/fonts.css', 'ontbrekend lettertype: ' + u);
}

// ---- structured data ----
let jsonLdBlokken = 0;
for (const [rel, html] of alles) {
  const blokken = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const b of blokken) {
    jsonLdBlokken++;
    try {
      const data = JSON.parse(b[1]);
      if (!data['@type'] && !data['@graph']) fout(rel, 'JSON-LD zonder @type of @graph');
    } catch (e) { fout(rel, 'ongeldige JSON-LD: ' + e.message); }
  }
  if (!blokken.length && !isNoindex(html)) waarschuw(rel, 'geen structured data');
}

// ---- sitemap ----
const sitemapPad = path.join(ROOT, 'sitemap.xml');
let sitemapUrls = [];
if (!fs.existsSync(sitemapPad)) fout('sitemap.xml', 'ontbreekt');
else {
  const sm = fs.readFileSync(sitemapPad, 'utf8');
  sitemapUrls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  const gezien = new Set();
  for (const u of sitemapUrls) {
    if (gezien.has(u)) fout('sitemap.xml', 'dubbele URL: ' + u);
    gezien.add(u);
    if (u.indexOf(DOMEIN) !== 0) { fout('sitemap.xml', 'URL buiten het domein: ' + u); continue; }
    const p = u.slice(DOMEIN.length).replace(/^\//, '') || 'index.html';
    if (!fs.existsSync(path.join(ROOT, p))) fout('sitemap.xml', 'URL bestaat niet als bestand: ' + u);
    else if (alles.get(p) && isNoindex(alles.get(p))) fout('sitemap.xml', 'noindex-pagina staat in sitemap: ' + u);
  }
  for (const [rel, html] of alles) {
    if (isNoindex(html)) continue;
    if (!gezien.has(urlVoor(rel))) fout('sitemap.xml', 'indexeerbare pagina ontbreekt: ' + urlVoor(rel));
  }
  const vandaag = new Date().toISOString().slice(0, 10);
  for (const d of [...sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1].trim())) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) fout('sitemap.xml', 'ongeldige lastmod-datum: ' + d);
    else if (d > vandaag) fout('sitemap.xml', 'lastmod ligt in de toekomst: ' + d);
  }
}

// ---- aanvraagformulier ----
const VELDEN = ['datum','datum-alt','flexibel','postcode','gemeente','gelegenheid','gasten',
                'formule','dranken','bediening','merken','wens','voornaam','naam','email','telefoon'];

const aanvraag = alles.get('aanvraag.html');
if (!aanvraag) fout('aanvraag.html', 'ontbreekt');
else {
  const formulieren = [...aanvraag.matchAll(/<form[\s\S]*?<\/form>/gi)].map(m => m[0]);
  const verborgen = formulieren.find(f => /netlify/i.test(f) && /\shidden/i.test(f));
  const zichtbaar = formulieren.find(f => /id=["']vargo-flow["']/.test(f));

  if (!zichtbaar) fout('aanvraag.html', 'zichtbaar formulier #vargo-flow niet gevonden');
  else {
    const namen = new Set([...zichtbaar.matchAll(/name=["']([^"']+)["']/g)].map(m => m[1]));
    for (const v of VELDEN) if (!namen.has(v)) fout('aanvraag.html', 'zichtbaar formulier mist veld: ' + v);
    const stappen = (zichtbaar.match(/class=["'][^"']*flow-step/g) || []).length;
    if (stappen !== 5) fout('aanvraag.html', 'verwacht 5 formulierstappen, gevonden ' + stappen);
    if (!/name=["']form-name["']/.test(zichtbaar)) fout('aanvraag.html', 'verborgen veld form-name ontbreekt');
    if (!/data-netlify=["']true["']/.test(zichtbaar)) fout('aanvraag.html', 'data-netlify ontbreekt op zichtbaar formulier');
    if (!/netlify-honeypot/.test(zichtbaar)) fout('aanvraag.html', 'netlify-honeypot ontbreekt op zichtbaar formulier');
  }

  if (!verborgen) fout('aanvraag.html', 'verborgen Netlify-formulierdefinitie niet gevonden');
  else {
    const namen = new Set([...verborgen.matchAll(/name=["']([^"']+)["']/g)].map(m => m[1]));
    for (const v of VELDEN) if (!namen.has(v)) fout('aanvraag.html', 'verborgen Netlify-formulier mist veld: ' + v);
    if (!namen.has('bot-field')) fout('aanvraag.html', 'verborgen formulier mist bot-field');
  }

  if (zichtbaar && verborgen) {
    const zn = new Set([...zichtbaar.matchAll(/name=["']([^"']+)["']/g)].map(m => m[1]));
    const vn = new Set([...verborgen.matchAll(/name=["']([^"']+)["']/g)].map(m => m[1]));
    for (const n of zn) if (n !== 'form-name' && !vn.has(n))
      fout('aanvraag.html', 'veld "' + n + '" staat zichtbaar maar niet in de Netlify-definitie');
  }
}

// ---- rapport ----
const groen = (t) => '\x1b[32m' + t + '\x1b[0m';
const rood  = (t) => '\x1b[31m' + t + '\x1b[0m';
const geel  = (t) => '\x1b[33m' + t + '\x1b[0m';

console.log('\nVARGO sitevalidatie\n');
if (!fouten.length) {
  console.log(groen("\u2713 " + paginas.length + " HTML-pagina's gecontroleerd"));
  console.log(groen('\u2713 interne links'));
  console.log(groen('\u2713 metadata'));
  console.log(groen('\u2713 structured data (' + jsonLdBlokken + ' blokken)'));
  console.log(groen('\u2713 formulieren'));
  console.log(groen("\u2713 sitemap (" + sitemapUrls.length + " URL's)"));
} else {
  console.log(rood('\u2717 ' + fouten.length + ' fout(en) gevonden:\n'));
  for (const f of fouten) console.log(rood('  ' + f.bestand) + '\n    ' + f.tekst);
}
if (waarschuwingen.length) {
  console.log(geel('\n! ' + waarschuwingen.length + ' waarschuwing(en):'));
  for (const w of waarschuwingen) console.log(geel('  ' + w.bestand + ': ' + w.tekst));
}
console.log('');
process.exit(fouten.length ? 1 : 0);
