# Laatste correcties, 13 augustus 2026

Basis: VARGO-WEBSITE-V3_1-GECONTROLEERD. Die versie was technisch in orde. Hieronder wat er nog is aangepast.

## Twee beslissingen van de zaakvoerder hersteld

**FAVV.** De verificatie-audit had de tekst opnieuw weggehaald van wat bij het FAVV zelf werd nagevraagd. Het antwoord staat nu stellig in de FAQ: "Nee. Wij schenken drank en geven daarbij eenvoudige snacks zoals nootjes, chips, kaas en salami. Daarvoor is geen FAVV-vergunning nodig. De koeling is bij ons in orde."

Ook het blogartikel over snacks is nagelopen op onzekere formuleringen. Zinnen als "binnen de praktische afspraken die we met het FAVV hebben besproken" zijn eruit. Een klant die leest dat je iets moest aftoetsen, twijfelt of je je zaken op orde hebt. Je weet hoe het zit, dus staat het er ook zo.

**Rookverbod.** De audit had de toekomstclaim volledig geschrapt. Dat onderschat wat er wel degelijk beslist is. Opnieuw geverifieerd: de federale regering besliste op 12 september 2025 dat roken en vapen op en nabij publieke terrassen verboden wordt vanaf 1 januari 2027, samen met het einde van de publieke rookkamers.

Het artikel zegt dat nu als feit, met de nuance dat het een regeringsbeslissing is en dat de wettekst en uitvoeringsdetails bij publicatie nog kunnen verschillen. Ook opgenomen: de rol van de uitbater in de naleving, en dat gemeenten bij tijdelijke evenementen kunnen afwijken. In VARGO zelf wordt niet gerookt.

## Opgeloste problemen

**Overflow op de blogpagina.** Bij 768 pixels stond de bloglijst nog in twee kolommen met een vaste fotobreedte, waardoor de pagina 6 pixels buiten beeld liep. De lijst schakelt nu eerder naar één kolom.

**Datum liep uiteen.** Het rookartikel toonde 12 augustus terwijl het overzicht 13 augustus zei. Gelijkgetrokken.

## Toegevoegd

**Beveiligings- en cachingheaders** in netlify.toml: nosniff, SAMEORIGIN, een strikt referrerbeleid en het uitschakelen van locatie, microfoon en camera. Daarnaast een jaar caching op lettertypes en afbeeldingen, wat de site sneller maakt voor terugkerende bezoekers.

## Volledig getest

- npm run build slaagt
- 16 pagina's gecontroleerd op 360, 390, 768 en 1280 pixels: nergens horizontale overflow, geen JavaScript-fouten
- Alle interne links werken, alle JSON-LD is geldig, elke pagina heeft precies één H1, een title en een description
- Formulier van stap 1 tot 5 doorlopen op gsm: formulekeuze via de aanbodpagina werkt, drankvoorkeuren worden verzameld, validatie blokkeert met duidelijke meldingen
- Een mislukte verzending toont een foutmelding en géén succesbeeld. Dit is expliciet getest door de verzending te laten falen
- Geen enkele externe verbinding, lettertypes staan lokaal

## Nog te doen voor livegang

1. Mailmelding aanzetten in Netlify. Zie MAIL-INSTELLEN.md. Zonder dit weet je niet dat er een aanvraag binnenkwam.
2. Eén echte testaanvraag doen op de live omgeving en nakijken of de mail toekomt, ook in de spammap.
3. Algemene voorwaarden eenmalig door een jurist laten screenen, vooral de annulatiepercentages.
4. Drankvergunning en Unisono afronden en dan terug in de FAQ zetten.
5. Facebookpagina aanmaken op vargo.be, anders is die footerlink dood.
6. Verzekering laten bevestigen door de makelaar: BA uitbating, event en de trailer zelf.
7. Echte foto's zodra de kroeg af is. Alle beeldvlakken tonen nu een textuur met het label "in de maak".
