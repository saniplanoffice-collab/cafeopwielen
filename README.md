# VARGO website

Statische site voor VARGO, de bruine kroeg op locatie, een concept van Forma Concepts BV.

Geen framework, geen server, geen database. Alleen HTML, CSS en vanilla JavaScript, gehost op Netlify.

**Lees eerst `STATUS.md`.** Daar staat wat op dit moment wel en niet gewijzigd mag worden.

## Structuur

```
/                        hoofdpagina's
/blog/                   artikels
/gelegenheden/           zes gelegenheidspagina's (gegenereerd)
/assets/css/site.css     volledige stylesheet
/assets/js/site.js       alle interactie
/assets/fonts/           Fraunces en Inter, lokaal gehost
/images/                 beelden en textuur
/netlify/functions/      mailnotificatie bij formulierinzending
/scripts/                buildscript en validator
/docs/archive/           historische documentatie, geen actuele instructie
```

## Build

```
npm run build
```

Dit doet twee dingen:

1. `scripts/build-gelegenheden.js` genereert de zes gelegenheidspagina's uit `scripts/gelegenheden-data.json`. Header en footer worden overgenomen uit `gelegenheden.html`, zodat navigatie en voettekst automatisch gelijk blijven.
2. `scripts/validate-site.js` valideert de volledige site.

De build **faalt met exit code 1** zodra de validator een kritieke fout vindt. Netlify zal dan niet deployen. Dat is bewust.

### Wat de validator controleert

- exact één `<h1>` per pagina
- `<title>`, meta description en canonical aanwezig
- canonical wijst naar een bestaande pagina op het juiste domein
- geen dubbele titels of dubbele canonicals
- geen lege `href`
- geen interne links naar onbestaande bestanden
- geen ontbrekende CSS, JS, afbeeldingen of lettertypes
- alle JSON-LD is geldig JSON met een `@type` of `@graph`
- elke indexeerbare pagina staat in de sitemap
- geen noindex-pagina's of onbestaande URL's in de sitemap
- geen dubbele sitemap-URL's, geen lastmod in de toekomst
- het aanvraagformulier heeft vijf stappen en alle zestien velden
- het zichtbare en het verborgen Netlify-formulier bevatten dezelfde velden

Wijzig je een tekst op een gelegenheidspagina, doe dat dan in `scripts/gelegenheden-data.json` en draai `npm run build`. Rechtstreeks in `/gelegenheden/*.html` werken heeft geen zin, die bestanden worden overschreven.

## Aanvragen: hoe het werkt

**Netlify Forms is de bron van waarheid.** Elke inzending van het aanvraagformulier wordt door Netlify opgeslagen en is terug te vinden onder **Forms > vargo-aanvraag** in het Netlify-dashboard.

**Resend dient enkel voor notificaties.** De functie `netlify/functions/submission-created.js` wordt door Netlify aangeroepen na een geslaagde inzending en stuurt twee mails: een melding naar feestje@vargo.be en een bevestiging naar de klant.

Belangrijk gevolg: **als een Resend-mail mislukt, is de lead niet verloren.** De submission staat dan nog steeds in Netlify. Ontbreekt `RESEND_API_KEY`, dan geeft de functie een foutstatus, zodat een ontbrekende mailconfiguratie zichtbaar wordt in de functielogs in plaats van stil te blijven.

Het formulier zelf toont nooit een succesbeeld zonder HTTP-succes. Een netwerkfout of timeout geeft een foutmelding met het mailadres als uitweg.

Zie `MAIL-INSTELLEN.md` voor het activeren van de notificaties.

### Verplichte live test na deploy

Doe deze test op de productieomgeving of een deploy preview, niet lokaal.

1. Vul het aanvraagformulier volledig in, alle vijf de stappen
2. Controleer in Netlify onder **Forms > vargo-aanvraag** of de submission binnenkwam
3. Controleer of de interne melding toekwam op feestje@vargo.be
4. Controleer of de klantbevestiging toekwam op het opgegeven adres, ook in de spammap
5. Controleer in de submission de waarden van alle belangrijke velden: datum, alternatieve datum, flexibiliteit, postcode, gemeente, gelegenheid, aantal gasten, formule, drankvoorkeuren, bediening, merken, vrije toelichting, voornaam, naam, e-mail en telefoon

Wijzig de backend niet zolang de submission veilig in Netlify wordt opgeslagen.

## Formulekeuze via de aanbodpagina

De aanbodpagina linkt naar `/aanvraag.html?formule=Signature` en dergelijke. De JavaScript leest die parameter en selecteert de juiste formule vooraf in stap 3. Wijzig de waarden in de query niet zonder ook `assets/js/site.js` na te kijken.

## Bouwstatus bijwerken

Zie `STATUS.md`.

## Deploy

Netlify leest `netlify.toml`. Publicatiemap is de hoofdmap, functies staan in `netlify/functions`. Security- en cachingheaders staan eveneens in dat bestand.

## Privacy

De site laadt geen enkele externe bron. Lettertypes staan lokaal. Er is geen analytics, geen tracking en geen advertentiecookie. De enige browseropslag is `sessionStorage` dat onthoudt of de deuranimatie al speelde. Daarom is er bewust geen cookiebanner. Voeg geen analytics toe zonder het privacybeleid aan te passen.
