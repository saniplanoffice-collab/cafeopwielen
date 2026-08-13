> **Correctienota 13 augustus 2026:** bij tegenstrijdigheid met dit oudere auditdocument zijn de live HTML-bestanden en `AUDIT-VERIFICATIE-2026-08-13.md` leidend. De FAVV-, rook-, privacy- en consumentenrechtteksten zijn op 13 augustus opnieuw gecontroleerd en waar nodig aangepast.

# Correcties na de audit, 13 augustus 2026

De auditversie is als basis genomen, want die was op de meeste punten beter. Hieronder wat er daarna nog is aangepast.

## FAVV opnieuw juridisch en operationeel gescheiden

De concrete snackkeuze komt uit rechtstreeks overleg met het FAVV: VARGO beperkt zich tot nootjes, chips, kaas en salami en bewaart gekoelde producten correct gekoeld. Dat is verwerkt in FAQ en blog. De website zegt bewust niet meer “geen FAVV-vergunning nodig” of “gedoogd”, omdat het FAVV publiek stelt dat professionele operatoren in de voedselketen gekend moeten zijn en dat registratie of toelating afhangt van de activiteit. VARGO neemt zijn eigen FAVV-verplichtingen op zich.

## Rookartikel teruggebracht naar de actuele, verifieerbare situatie

De eerdere versie maakte een toekomstige algemene terrasregel voor 2027 te stellig. De live versie beschrijft daarom alleen de huidige basisregels en zegt dat toekomstige of lokale regels op de datum en locatie van het evenement opnieuw gecontroleerd worden. Zo kan een oud blogartikel later niet als juridisch advies worden gelezen.

## Horizontale overflow op gsm opgelost

De FAQ liep 65 pixels buiten beeld op een scherm van 360 pixels, waardoor je de pagina zijwaarts kon schuiven. Oorzaak: de titel "WARME ANTWOORDEN." was 425 pixels breed omdat de minimale lettergrootte van 58 pixels te groot is voor smalle schermen.

Structureel opgelost met kleinere titels onder 520 en onder 380 pixels, plus het afbreken van lange woorden. Alle 16 pagina's zijn opnieuw getest op 360 en 390 pixels: nergens nog overflow.

## Vijf stappen behouden

Bewuste keuze. Het levert rijkere leaddata op, waardoor een voorstel kan worden opgemaakt zonder eerst te bellen, en het filtert wie het niet meent. De optie "Adviseer mij" staat in stap 3 zodat niemand vastloopt wie de formule nog niet weet.

## Gecontroleerd en in orde bevonden

- npm run build slaagt
- Alle interne links werken
- Alle structured data is geldig
- Eén H1 per pagina
- Geen JavaScript-fouten op geen enkele pagina
- Het volledige formulier van stap 1 tot 5 werkt op gsm, inclusief formulekeuze via de aanbodpagina, drankvoorkeuren en de kennisname van voorwaarden/privacy
- Validatie blokkeert correct met duidelijke Nederlandse meldingen
- Geen enkele externe verbinding, fonts staan lokaal
