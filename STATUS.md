# VARGO website, huidige status

## Huidige fase

VARGO website v3.5 is de goedgekeurde tussenversie.

Concept, hoofdcopy, formules en aanvraagflow zijn momenteel bevroren.

## Wel wijzigen

- bugs
- technische fouten
- broken links
- performanceproblemen
- echte SEO-fouten
- correcte projectupdates
- echte bouwfoto's
- aantoonbare conversieverbeteringen op basis van data

## Niet willekeurig wijzigen

Zonder expliciete opdracht blijven deze zaken ongewijzigd:

- positionering
- headlines
- formules
- prijzen
- pagina-architectuur
- merkstijl
- formulierflow
- juridische inhoud
- FAVV
- rookbeleid

## Pre-launch status

VARGO is fysiek nog in opbouw.

Geen fictieve eindbeelden gebruiken. Echte bouwbeelden mogen geleidelijk worden toegevoegd.

De bouwstatus staat op de homepage tussen de markeringen `BOUWSTATUS:START` en `BOUWSTATUS:EINDE` in `index.html`. Om een fase bij te werken wijzig je daar de klasse van de betrokken stap en de tekst tussen `<b></b>`:

- geen klasse: nog niet gestart
- `is-active`: in uitvoering
- `is-done`: afgewerkt

Laat de nummering en de titels van de fasen staan. Voeg geen percentages of nieuwe statusclaims toe.

De vijf fasen zijn: Trailer en indeling, Hout en toog, Tap koeling en stroom, Licht en details, Eerste avonden.

## Volgende grote visuele mijlpaal

Echte fotografie zodra voldoende onderdelen van VARGO afgewerkt zijn. Tot dan blijven de beeldvlakken gevuld met de huisstijltextuur en het label "in de maak".

## Gelegenheidspagina's

Er bestaan zes gelegenheidspagina's onder `/gelegenheden/`: huwelijk, tuinfeest, bedrijfsfeest, verjaardag, dorpsfeest en sportevent. Ze worden gegenereerd uit `scripts/gelegenheden-data.json` door `scripts/build-gelegenheden.js`.

Merkcommunicatie gebruikt **Match Night** als naam voor de sportavond.
SEO-taal op de pagina gebruikt: sportevent, sportavond, wedstrijd kijken, mobiele bar voor sportevent.
De URL `/gelegenheden/sportevent.html` blijft ongewijzigd.

De belangrijkste merkgelegenheden zijn verjaardag, tuinfeest, huwelijk, bedrijfsfeest en Match Night. Dorpsfeest blijft bestaan zonder redirect of noindex, maar krijgt geen prominentere plaats in de hoofdpositionering.

## Openstaand voor livegang

1. Mailnotificatie activeren en live testen, zie MAIL-INSTELLEN.md
2. Algemene voorwaarden eenmalig door een jurist laten screenen
3. Drankvergunning en Unisono afronden
4. Facebookpagina aanmaken op vargo.be
5. Verzekering laten bevestigen door de makelaar
6. Google Bedrijfsprofiel en Search Console
