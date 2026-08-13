// Genereert de zes gelegenheidspagina's met identieke header/footer
// en per pagina eigen inhoud. Draai met: node scripts/build-gelegenheden.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const bron = fs.readFileSync(path.join(ROOT, 'gelegenheden.html'), 'utf8');

const header = bron.match(/<header[\s\S]*?<\/header>/)[0];
const footer = bron.match(/<footer[\s\S]*?<\/footer>/)[0];

function navVoor(slug) {
  return header
    .replace(/ aria-current="page"/g, '')
    .replace('<a href="/gelegenheden.html">Gelegenheden</a>',
             '<a aria-current="page" href="/gelegenheden.html">Gelegenheden</a>');
}

const paginas = require('./gelegenheden-data.json');

paginas.forEach(p => {
  const secties = p.secties.map(s =>
    `<h2>${s.kop}</h2>${s.alineas.map(a => `<p>${a}</p>`).join('')}`
  ).join('');

  const checklist = p.checklist
    ? `<aside class="gelegenheid-checklist"><p class="eyebrow">${p.checklist.kop}</p><ul>${p.checklist.punten.map(x => `<li>${x}</li>`).join('')}</ul></aside>`
    : '';

  const andere = paginas.filter(x => x.slug !== p.slug)
    .map(x => `<li><a href="/gelegenheden/${x.slug}.html">${x.linktitel}</a></li>`).join('');

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: p.serviceNaam,
    description: p.description,
    serviceType: p.serviceType,
    provider: { '@type': 'Organization', name: 'Forma Concepts BV', url: 'https://vargo.be/' },
    areaServed: p.gebieden.map(g => ({ '@type': 'Place', name: g })),
    url: `https://vargo.be/gelegenheden/${p.slug}.html`
  });

  const html = `<!DOCTYPE html>
<html lang="nl"><head><meta charset="utf-8"/><meta content="width=device-width,initial-scale=1" name="viewport"/><title>${p.title}</title><meta content="${p.description}" name="description"/><link href="https://vargo.be/gelegenheden/${p.slug}.html" rel="canonical"/><meta content="website" property="og:type"/><meta content="${p.ogTitle}" property="og:title"/><meta content="${p.ogDescription}" property="og:description"/><meta content="https://vargo.be/images/og.jpg" property="og:image"/><meta content="summary_large_image" name="twitter:card"/><meta content="https://vargo.be/images/og.jpg" name="twitter:image"/><link href="/assets/css/site.css" rel="stylesheet"/><script type="application/ld+json">${schema}</script></head><body>
<a class="skip-link" href="#inhoud">Ga naar inhoud</a>${navVoor(p.slug)}
<main id="inhoud">
<section class="top-copy wrap"><p class="eyebrow">${p.eyebrow}</p><h1>${p.h1}</h1><p class="lede">${p.lede}</p></section>
<section class="wrap gelegenheid-body" data-reveal><div class="gelegenheid-tekst">${secties}</div>${checklist}</section>
<section class="inline-cta wrap"><p>${p.ctaBoven}</p><h2>${p.ctaKop}</h2><a class="text-button" href="/aanvraag.html">Check je datum <span>→</span></a></section>
<section class="wrap gelegenheid-verder"><p class="eyebrow">Andere gelegenheden</p><ul>${andere}</ul></section>
</main>
${footer}<script defer src="/assets/js/site.js"></script></body></html>
`;

  const map = path.join(ROOT, 'gelegenheden');
  if (!fs.existsSync(map)) fs.mkdirSync(map);
  fs.writeFileSync(path.join(map, `${p.slug}.html`), html);
  console.log('geschreven: gelegenheden/' + p.slug + '.html');
});
