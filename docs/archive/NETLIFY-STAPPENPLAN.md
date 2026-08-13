# VARGO online zetten, stappenplan

Static site voor Netlify, met blog, Decap CMS, een slim aanvraagformulier in stappen, automatische bevestigingsmail en automatische Google Sheet. Test eerst op de gratis Netlify-URL, koppel je domein pas als alles werkt.

## Vooraf invullen
Zoek in de bestanden op "nog in te vullen" en vul in: telefoonnummer, Instagram, Facebook (footer). Het e-mailadres staat op feestje@vargo.be.

## Fase 1: snel testen (slepen)
1. Gratis account op netlify.com.
2. Pak de zip uit tot een map.
3. Netlify, "Add new site", "Deploy manually", sleep de map. Site staat live op een tijdelijke URL.
Let op: met slepen werken het blogdashboard, de mails en de Sheet nog niet. Die hebben Git en instellingen nodig (fase 3 tot 5). Slepen dient enkel om de site en het formulier visueel te testen.

## Fase 2: testen op de tijdelijke URL, ook op gsm
- Openingsanimatie: gaat vlot open, speelt maar 1x per sessie.
- Alle pagina's klikbaar, inclusief de nieuwe Aanbod-pagina.
- Aanvraagformulier: doorloop de vijf stappen, test dat je niet verder kan zonder verplichte velden, en dat je na verzending de samenvatting met vanafprijs ziet.
- Blogartikels openen, echte datums zichtbaar.

## Fase 3: Git koppelen (nodig voor dashboard, mails en Sheet)
1. Gratis GitHub-account, nieuwe repository, alle bestanden erin.
2. Netlify, "Add new site", "Import an existing project", kies de repo, deploy. netlify.toml wordt automatisch gelezen, inclusief de functions-map.
3. Netlify Identity aanzetten, daaronder Git Gateway aanzetten. Identity op "Invite only", nodig jezelf en Elise uit.
4. Ga naar detijdelijke-url/admin, log in, publiceer een testblog.

## Fase 4: automatische mails aanzetten (Resend)
De site stuurt automatisch een bevestiging naar de klant en een notificatie naar feestje@vargo.be zodra een aanvraag binnenkomt. Dat werkt via Resend.
1. Maak een gratis account op resend.com.
2. Voeg je domein vargo.be toe en volg de stappen om het te verifiëren. Dit vraagt enkele DNS-records bij je domeinbeheerder. Zonder verificatie mag je niet vanaf feestje@vargo.be versturen.
3. Maak in Resend een API-sleutel aan.
4. In Netlify, ga naar Site settings, Environment variables, en voeg toe: naam RESEND_API_KEY, waarde de sleutel uit Resend.
5. Deploy opnieuw. Test met een echte aanvraag of de bevestigingsmail en de notificatie binnenkomen.
Werkt de mail niet meteen? Kijk in Netlify onder Functions naar de logs van submission-created, daar zie je de fout.

## Fase 5: automatische Google Sheet (Make)
Zo lopen alle aanvragen automatisch in een werkblad dat jij en Elise gebruiken.
1. Maak een Google Sheet met kolommen: datum, gemeente, gelegenheid, gasten, formule, dranken, bediening, voornaam, naam, email, telefoon, wens.
2. Maak een gratis account op make.com.
3. Nieuw scenario: trigger "Netlify, watch form submissions", of gebruik een webhook. Koppel je Netlify-site en het formulier vargo-aanvraag.
4. Voeg een actie toe: "Google Sheets, add a row", koppel je Sheet, en sleep de juiste velden naar de juiste kolommen.
5. Zet het scenario aan. Elke nieuwe aanvraag verschijnt nu automatisch als rij.
Alternatief: Zapier werkt op dezelfde manier als je dat liever gebruikt.

## Fase 6: eigen domein
Werkt alles? Koppel vargo.be onder "Domain settings". Netlify regelt gratis SSL.

## Wat er in deze versie zit
- Vier formules met richtprijzen op de nieuwe Aanbod-pagina (Select, Signature, Reserve, Grand Open).
- Slim aanvraagformulier in vijf stappen met voortgangsbalk, multi-select voor drankvoorkeuren, en na verzending een samenvatting met indicatieve vanafprijs.
- Alle leaddata wordt gestructureerd verzameld, klaar voor de Google Sheet en later voor een eigen systeem.
- Automatische bevestigingsmail naar de klant en notificatie naar VARGO.
- Fail-proof verzending met timeout-vangnet en foutmelding.
- Bestaande wachtlijst (contact.html) blijft werken naast het nieuwe aanvraagformulier.

## Belangrijk
Fase 4 en 5 zijn het technische deel: Resend, DNS-records en Make. Loop je vast, kom terug met waar het blokkeert. Test na livegang altijd eerst op je eigen gsm.
