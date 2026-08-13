> **Correctienota 13 augustus 2026:** bij tegenstrijdigheid met dit oudere auditdocument zijn de live HTML-bestanden en `AUDIT-VERIFICATIE-2026-08-13.md` leidend. De FAVV-, rook-, privacy- en consumentenrechtteksten zijn op 13 augustus opnieuw gecontroleerd en waar nodig aangepast.

# VARGO website - auditimplementatie 12 augustus 2026

## Belangrijkste wijzigingen
- CTA overal gewijzigd van definitief klinkende boeking naar **Check je datum**.
- Homepage herschikt rond waardepropositie, vanafprijs en bewuste pre-launch.
- Nieuwe **VARGO / in de maak** bouwprogressie.
- Aanvraagformulier uitgebreid naar 5 stappen met formule, dranken, bediening en betere leaddata.
- False-success timeout verwijderd: bij een timeout krijgt de bezoeker nu een foutmelding.
- Backendmail bevat nu formule, drankvoorkeuren, bediening, postcode en merken.
- RESEND_API_KEY ontbreekt => function retourneert een foutstatus in plaats van stil te doen alsof alles goed is.
- Pakketten concreter gemaakt met duidelijke doelgroep en inclusies.
- Dorpsfeest vervangen door Match night.
- Placeholdertaal **BEELD VOLGT** vervangen door **VARGO / IN DE MAAK**.
- Sitebrede houttextuur verwijderd; donkere rustige basis met hout in de beeldvlakken.
- Merkkleur geconsolideerd naar brass #C79A5A.
- Page-wipe verwijderd; minder beweging en snellere navigatie.
- Algemene voorwaarden: alcoholleeftijden juridisch nauwkeuriger geformuleerd; verouderde ODR-verwijzing verwijderd.
- Rookverbodartikel herschreven zodat geen toekomstig algemeen terrasverbod als vaststaand feit wordt voorgesteld.
- FAQ uitgebreid met ruimte, bereikbaarheid, slecht weer, transport en definitieve reservatie.

## Voor livegang absoluut testen
1. Netlify deploy-preview openen op desktop, iPhone en iPad.
2. Aanvraagformulier volledig inzenden met elk van de vier formules.
3. Controleren of inzending in Netlify Forms staat.
4. Controleren of mail bij feestje@vargo.be aankomt.
5. Controleren of klantbevestiging aankomt.
6. Controleren of RESEND_API_KEY in Netlify staat en het verzenddomein correct geverifieerd is.
7. Alle prijzen, transportvoorwaarden en algemene voorwaarden commercieel/juridisch finaal valideren voor verkoop.
8. Zodra echte bouwfoto's beschikbaar zijn: de tijdelijke wandbeelden vervangen, maar geen fictieve eindrenders gebruiken.
