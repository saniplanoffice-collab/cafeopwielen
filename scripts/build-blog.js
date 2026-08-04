const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const blogDir = path.join(root, 'blog');
const baseUrl = 'https://vargo.be';

function escapeHtml(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const MAANDEN = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
function formatDate(value) {
  if (!value) return '';
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return '';
  const jaar = m[1], maand = parseInt(m[2], 10), dag = parseInt(m[3], 10);
  if (maand < 1 || maand > 12) return '';
  return `${dag} ${MAANDEN[maand - 1]} ${jaar}`;
}

function parsePost(source, filename) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Ontbrekende frontmatter in ${filename}`);
  const data = {};
  match[1].split('\n').forEach((line) => {
    const separator = line.indexOf(':');
    if (separator > -1) data[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^"|"$/g, '');
  });
  return { ...data, slug: path.basename(filename, '.md'), body: match[2].trim() };
}

function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.split('\n');
  const output = [];
  let listOpen = false;
  let paragraph = [];
  const closeParagraph = () => { if (paragraph.length) { output.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; } };
  const closeList = () => { if (listOpen) { output.push('</ul>'); listOpen = false; } };
  lines.forEach((line) => {
    if (!line.trim()) { closeParagraph(); closeList(); return; }
    if (line.startsWith('### ')) { closeParagraph(); closeList(); output.push(`<h3>${inline(line.slice(4))}</h3>`); return; }
    if (line.startsWith('## ')) { closeParagraph(); closeList(); output.push(`<h2>${inline(line.slice(3))}</h2>`); return; }
    if (line.startsWith('- ')) { closeParagraph(); if (!listOpen) { output.push('<ul>'); listOpen = true; } output.push(`<li>${inline(line.slice(2))}</li>`); return; }
    paragraph.push(line.trim());
  });
  closeParagraph(); closeList();
  return output.join('\n');
}

function header(active) {
  const links = [['concept.html', 'Concept'], ['gelegenheden.html', 'Gelegenheden'], ['galerij.html', 'Galerij'], ['blog.html', 'Blog'], ['faq.html', 'FAQ']];
  const nav = links.map(([href, label]) => `<a${active === label ? ' aria-current="page"' : ''} href="/${href}">${label}</a>`).join('');
  return `<a class="skip-link" href="#inhoud">Ga naar inhoud</a><header class="site-header"><div class="wrap"><a class="brand" href="/index.html" aria-label="VARGO home"><i></i>VARGO</a><nav class="nav-list" aria-label="Hoofdnavigatie">${nav}</nav><a class="button header-cta" href="/contact.html">Wachtlijst <span>↗</span></a><button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false">Menu +</button><nav class="mobile-nav" data-mobile-nav aria-label="Mobiele navigatie">${nav}</nav></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="wrap footer-top"><div class="brand"><i></i>VARGO</div><p>De bruine kroeg op locatie.<br>Oost-Vlaanderen.</p><nav class="footer-nav"><a href="/concept.html">Concept</a><a href="/gelegenheden.html">Gelegenheden</a><a href="/galerij.html">Galerij</a><a href="/blog.html">Blog</a><a href="/contact.html">Wachtlijst</a></nav><div class="footer-contact"><a href="mailto:welkom@vargo.be">welkom@vargo.be</a><span>Telefoon: <a href="tel:+32470186726">0470 18 67 26</a></span><span>Instagram: <a href="https://instagram.com/vargo.be">@vargo.be</a></span></div></div><div class="wrap footer-bottom"><span>© Forma Concepts BV 2026</span><span>Gebouwd voor lange avonden.</span><span>Facebook: binnenkort</span></div></footer>`;
}

function articlePage(post) {
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description,
    datePublished: post.date, dateModified: post.date, image: `${baseUrl}${post.featuredImage}`,
    author: { '@type': 'Organization', name: 'Forma Concepts BV' }, publisher: { '@type': 'Organization', name: 'VARGO' },
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}.html`
  });
  let content = markdownToHtml(post.body);
  content = content.replace(/<h2>Klaar om je feest onvergetelijk te maken\?<\/h2>\n<p>([\s\S]*?)<\/p>$/, '<section class="article-cta"><h2>Klaar om je feest onvergetelijk te maken?</h2><p>$1</p><a class="button dark" href="/contact.html">Reserveer als eerste <span>↗</span></a></section>');
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(post.title)} | VARGO Journal</title><meta name="description" content="${escapeHtml(post.description)}"><link rel="canonical" href="${baseUrl}/blog/${post.slug}.html"><meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(post.title)}"><meta property="og:description" content="${escapeHtml(post.description)}"><meta property="og:image" content="${baseUrl}${post.featuredImage}"><meta property="article:published_time" content="${post.date}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${baseUrl}${post.featuredImage}"><link rel="stylesheet" href="/assets/css/site.css"><script type="application/ld+json">${jsonLd}</script></head><body>${header('Blog')}<main id="inhoud"><section class="article-hero wrap"><span class="article-date">${escapeHtml(post.category || 'Journal')}${formatDate(post.date) ? ' / ' + escapeHtml(formatDate(post.date)) : ''}</span><h1>${escapeHtml(post.title)}</h1><p class="lede">${escapeHtml(post.description)}</p></section><div class="article-cover photo" style="background-image:url('${post.featuredImage}')" role="img" aria-label="${escapeHtml(post.featuredAlt || post.title)}"></div><section class="article-layout wrap"><article class="article-content">${content}</article><aside class="article-aside"><b>VARGO JOURNAL</b>Praktische inspiratie voor een feest waar mensen langer blijven hangen.<br><br><a href="/contact.html">Reserveer als eerste →</a></aside></section></main>${footer()}<script src="/assets/js/site.js" defer></script></body></html>`;
}

const posts = fs.readdirSync(blogDir).filter((file) => file.endsWith('.md')).map((file) => parsePost(fs.readFileSync(path.join(blogDir, file), 'utf8'), file)).sort((a, b) => b.date.localeCompare(a.date));
posts.forEach((post) => fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), articlePage(post)));

const cards = posts.map((post, index) => `<article class="article-card"><div class="photo" style="background-image:url('${post.featuredImage}')" role="img" aria-label="${escapeHtml(post.featuredAlt || post.title)}"></div><div><span class="article-date">${escapeHtml(formatDate(post.date) || post.category || 'Journal')}</span><h2>${escapeHtml(post.title)}</h2><a class="text-button" href="/blog/${post.slug}.html">Lees verder <span>→</span></a></div></article>`).join('');
const overviewPath = path.join(root, 'blog.html');
let overview = fs.readFileSync(overviewPath, 'utf8');
overview = overview.replace(/<!-- BLOG_POSTS:START -->[\s\S]*?<!-- BLOG_POSTS:END -->/, `<!-- BLOG_POSTS:START --><section class="article-list wrap">${cards}</section><!-- BLOG_POSTS:END -->`);
fs.writeFileSync(overviewPath, overview);

const pages = ['index.html', 'concept.html', 'aanbod.html', 'aanvraag.html', 'gelegenheden.html', 'galerij.html', 'blog.html', 'faq.html', 'contact.html'];
const urls = [...pages.map((file) => `${baseUrl}/${file === 'index.html' ? '' : file}`), ...posts.map((post) => `${baseUrl}/blog/${post.slug}.html`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
console.log(`Built ${posts.length} blog articles and sitemap.`);
