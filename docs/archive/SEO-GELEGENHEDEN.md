# Zes gelegenheidspagina's en lokale vindbaarheid

## Wat er nieuw is

**Zes eigen pagina's** onder /gelegenheden/: huwelijk, tuinfeest, bedrijfsfeest, verjaardag, dorpsfeest en sportevent.

Elke pagina heeft echt eigen inhoud, geen omgewisselde sjabloontekst. Concreet per pagina:

- **Huwelijk**: waarom een toog groepen samenbrengt, verloop van receptie tot laatste ronde, combineren met feestzaal en traiteur
- **Tuinfeest**: toegang tot de tuin als grootste struikelblok, weer en seizoen, buren en geluidsregels
- **Bedrijfsfeest**: collega's die elkaar tegenkomen, opstelling op parking of koer, bediening en verantwoord schenken, facturatie exclusief btw
- **Verjaardag**: gezelschap dat elkaar half kent, zelf tappen of laten schenken, hoeveel drank je nodig hebt
- **Dorpsfeest**: vergunning inname openbaar domein, rookregels bij tijdelijke evenementen, omgaan met korte drukke pieken
- **Sportevent**: de schermen en de nuance rond uitzendrechten, verloop van een wedstrijddag, opstelling op een sportterrein

Elke pagina heeft een praktische checklist in de zijkolom, eigen Service-schema met het bediende gebied, en verwijzingen naar de vijf andere gelegenheden.

**Geen prijzen** op deze pagina's, zoals gevraagd. De vanafprijzen blijven op de aanbodpagina.

## Overzichtspagina rechtgezet

Er stonden zes kaarten, maar twee ervan gingen over hetzelfde: "Match night" en "Sportevent". Dorpsfeest ontbrak. Dat is gelijkgetrokken: zes kaarten die elk naar hun eigen pagina linken.

## Plaatsnamen

Gent, Eeklo, Deinze, Aalst en het Waasland staan nu op de homepage bij de praktische informatie, en op elke gelegenheidspagina in de tekst en de metabeschrijving. Ook toegevoegd aan het bediende gebied in de structured data, zodat Google de streek koppelt aan je dienst.

De formulering blijft natuurlijk: "We vertrekken vanuit Lievegem en zijn inzetbaar in heel Vlaanderen. Gent, Eeklo, Deinze, Aalst en het Waasland liggen vlakbij." Geen opsomming van zoekwoorden.

## Technisch

De zes pagina's worden gegenereerd door scripts/build-gelegenheden.js op basis van scripts/gelegenheden-data.json. Wil je een tekst aanpassen, doe dat in het JSON-bestand en draai npm run build. Header en footer blijven zo automatisch gelijk met de rest van de site.

npm run build genereert nu eerst de pagina's en valideert daarna de site.

## Getest

22 pagina's op 360, 390, 768 en 1280 pixels: geen horizontale overflow, geen JavaScript-fouten. Alle interne links werken, alle JSON-LD is geldig, elke pagina heeft precies één H1. Sitemap uitgebreid naar 20 URL's.

## Wat nog kan

De grootste winst blijft buiten de site liggen: een Google Bedrijfsprofiel aanmaken en Search Console koppelen. Zonder die twee weet je niet op welke woorden mensen je vinden, en verschijn je niet op de kaart bij lokale zoekopdrachten.
