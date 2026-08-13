# CODEX MASTERPROMPT — VARGO WEBSITE

Je werkt aan de statische website van **VARGO**, een premium mobiele Belgische bruine kroeg van Forma Concepts BV. De broncode in deze map is leidend. Behandel dit niet als een generieke barwebsite: VARGO verkoopt geen tapwagen maar een **echte bruine kroeg op locatie**, gebouwd rond samenkomen, sfeer en een centrale plek op het feest.

## Merk en positionering
- Hoofdzin: **De bruine kroeg op locatie.**
- Kernonderscheid: **Geen tapwagen. Een echte kroeg.**
- Merkbelofte: VARGO wordt het hart van het feest; de bar staat niet naast het feest, de bar wordt de plek waar de avond gebeurt.
- Eerste avonden: eind november 2026.
- Vertrekpunt: Lievegem, inzetbaar in Vlaanderen.
- Vanafprijs: €895.
- Gebruik geen fictieve eindrenders of stockbeelden die doen alsof VARGO al volledig afgewerkt is. Tot echte fotografie bestaat, presenteer de site bewust als **VARGO / IN DE MAAK**.
- Toon geen fake reviews, fake klanten, fake persvermeldingen of andere verzonnen social proof.

## Visuele regels
- Premium bruine-kroegsfeer, maar niet overal houttextuur. De basis is rustig, donker en bijna zwart/bruin.
- Hoofdkleur brass/goud: **#C79A5A**.
- Geen neon, blauw, paars of tech-startupgevoel.
- Typografie: Fraunces + Inter; fonts lokaal houden.
- De openingsdeuren zijn het signature motion-moment. Houd overige animatie subtiel. Geen page-wipe terug toevoegen.
- Geen AI-glow. Geen overdreven gradients. Materiaal, rust, gewicht en authenticiteit.

## Conversieregels
- Primaire CTA is overal **Check je datum**.
- Nooit communiceren dat een datum definitief gereserveerd of “vast” staat na alleen het formulier.
- Een datum is pas definitief na bevestigd voorstel en afgesproken voorschot.
- Houd vanafprijzen zichtbaar genoeg om ongeschikte leads te filteren.
- Het aanvraagformulier moet rijke leaddata bewaren: datum, alternatieve datum, flexibiliteit, postcode, gemeente, gelegenheid, gasten, formule, dranken, bediening, merken, vrije wens, naam, e-mail, telefoon.
- Formulierflow blijft 5 stappen en mobiel eenvoudig.
- Een netwerk-timeout of serverfout mag **nooit** als succesvolle inzending worden getoond.
- De vier formules blijven: Select (€895), Signature (€1.295), Reserve (€1.595), Grand Open (€1.995). “Adviseer mij” is toegestaan in het formulier.

## Technische regels
- Behoud de lichte statische stack: HTML + CSS + vanilla JS + Netlify Forms/functions. Niet migreren naar React/Vue/etc. zonder expliciete opdracht.
- Behoud lokale fonts en WebP-assets.
- Zorg dat `npm run build` blijft slagen.
- Controleer alle interne links na iedere wijziging.
- `bedankt.html` en tijdelijke galerij mogen noindex blijven zolang dat logisch is.
- Structured data moet de werkelijkheid volgen: Organization + Service is geschikter dan doen alsof VARGO een publiek caféadres is.
- E-mailnotificaties lopen via Netlify submission-created + Resend. Als `RESEND_API_KEY` ontbreekt, mag dit niet stil als succes worden behandeld.

## Copyregels
- Schrijf kort, concreet en Belgisch-Nederlands.
- Vermijd holle termen als “unieke beleving”, “onvergetelijke ervaring”, “waar dromen werkelijkheid worden”.
- Vermijd AI-copy en overmatige superlatieven.
- Niet oververkopen wat technisch of operationeel nog niet definitief gebouwd is.
- Gebruik “de bruine kroeg op locatie” als primaire categorie. SEO-termen zoals mobiele bar, mobiele bruine kroeg en bar huren mogen ondersteunend gebruikt worden.

## Juridisch / feitelijk
- Algemene voorwaarden, alcoholregels, FAVV-regels, rookregels, consumentenrecht en andere wettelijke claims nooit op basis van geheugen aanscherpen. Controleer actuele officiële Belgische/EU-bronnen wanneer je zulke inhoud inhoudelijk wijzigt.
- Geen absolute wettelijke claim schrijven als de regel contextafhankelijk is.

## Prioriteit bij volgende verbeteringen
1. Echte bouwfoto’s integreren zodra beschikbaar.
2. Analytics/conversie-events toevoegen als Frederic dat beslist, inclusief correcte privacy-update.
3. Echte Google/Search Console-data gebruiken voor nieuwe SEO-landingspagina’s; geen dunne massaal gegenereerde pagina’s.
4. Formulierconversie meten en vereenvoudigen op basis van echte drop-offdata.
5. Pakketten verder verfijnen zodra drankvolumes, bediening, transport en operationele kost definitief zijn.

## Acceptatiecheck voor elke oplevering
- Geen CTA met “datum vastzetten” vóór echte bevestiging.
- Geen formulier-success zonder HTTP-succes.
- Alle 5 formulierstappen aanwezig.
- Formulekeuze vanuit `aanbod.html?formule=...` werkt.
- Formuliergegevens komen in Netlify Forms en backendmail terecht.
- Mobiele header blijft rustig.
- Geen horizontale overflow op 360px.
- Interne links bestaan.
- Eén H1 per hoofdpage.
- Geen ongefundeerde claims of fictieve fotografie.
- `npm run build` slaagt.

## Gevalideerde operationele randvoorwaarden (13 augustus 2026)

- FAVV: VARGO staat zelf in voor de registratie/toelating die op de eigen activiteit van toepassing is. Na rechtstreeks overleg met het FAVV houdt VARGO het snackaanbod bewust bij nootjes, chips, kaas en salami; gekoelde producten worden correct gekoeld. Formuleer dit nooit als “geen FAVV nodig” of “gedoogd zonder vergunning”.
- Geen maaltijdbereiding, warme keuken of catering door VARGO. Externe cateraars/foodtrucks staan zelf in voor hun verplichtingen.
- Sterke drank: vóór exploitatie verifiëren welke gemeentelijke drankvergunning/reizende/eventtoelating vereist is voor de concrete mobiele formule. Niet op de website suggereren dat dit al rond is wanneer dat nog niet bevestigd is.
- Muziek en tv/sport: schermen mogen technisch vermeld worden, maar beloof een specifieke uitzending pas nadat abonnement/uitzendrechten voor die toepassing bevestigd zijn. Unisono dekt muziek/auteursrechten, niet automatisch alle rechten op sport- of tv-uitzendingen.
- Facturatie-/boekhoudgegevens: wettelijke bewaartermijn in beginsel 10 jaar.
- Consumentenschulden: Boek XIX WER is leidend voor gratis eerste herinnering, wachttijd en wettelijke maxima.
- Reageer op een aanvraag op basis van precontractuele noodzaak; vraag daarvoor geen verplichte marketingtoestemming.
