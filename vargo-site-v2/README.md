# VARGO static site

Dit is een pure static site. De live site heeft geen framework, server, database of externe runtime nodig. De enige buildstap is een klein Node-script dat Markdown-blogartikels omzet naar statische HTML-pagina's en het blogoverzicht plus sitemap bijwerkt.

## Publiceren op Netlify

1. Plaats de volledige inhoud van deze map in een Git-repository en verbind die repository met Netlify.
2. Netlify leest `netlify.toml`: het buildcommando is `npm run build` en de publicatiemap is de hoofdmap.
3. Open in Netlify **Identity** en activeer Identity.
4. Onder **Identity > Services** activeer je **Git Gateway**.
5. Nodig de klant uit als gebruiker. Daarna kan die inloggen op `/admin/` en blogartikels publiceren.

Een publicatie in Decap CMS maakt een Markdown-bestand in `/blog/`. Git Gateway triggert daarna automatisch een Netlify-build. Het buildscript maakt een eigen HTML-artikelpagina, vernieuwt `blog.html` en vult `sitemap.xml` aan.

## Wachtlijstformulier

Het formulier op `contact.html` gebruikt Netlify Forms. Na de eerste Netlify-deploy verschijnen inzendingen in **Forms > vargo-wachtlijst**. De bedankpagina is `bedankt.html`.

## Plaatshouders

Vervang voor lancering de telefoon- en sociale placeholderteksten in de HTML-bestanden. `welkom@vargo.be` is bewust als tijdelijk e-mailadres opgenomen.
