# Aanvragen in je mailbox krijgen

Op dit moment komen alle aanvragen binnen in je Netlify-dashboard onder **Forms > vargo-aanvraag**. Je kan ze daar altijd bekijken, ook zonder de stappen hieronder. Maar je krijgt er geen melding van, dus je moet zelf gaan kijken. Dat wil je niet.

Er zijn twee manieren. Begin met manier 1, die werkt binnen twee minuten. Manier 2 is mooier maar vraagt meer werk.

---

## Manier 1: Netlify stuurt de mail (aanbevolen om mee te starten)

Geen code nodig, werkt meteen.

1. Log in op netlify.com en open je VARGO-site.
2. Ga naar **Forms** in het linkermenu.
3. Klik op het formulier **vargo-aanvraag**.
4. Ga naar het tabblad **Settings** of naar **Form notifications**.
5. Klik op **Add notification** en kies **Email notification**.
6. Vul bij het e-mailadres in: feestje@vargo.be
7. Bewaren.

Vanaf nu krijg je bij elke aanvraag een mail van Netlify met alle ingevulde gegevens.

**Wat je hiermee niet hebt:** de klant krijgt geen bevestigingsmail. Hij ziet enkel de bevestiging op het scherm. Voor de start is dat aanvaardbaar, maar een bevestigingsmail wekt vertrouwen en vermindert het aantal mensen dat belt om te vragen of hun aanvraag wel is aangekomen.

---

## Manier 2: eigen mails via Resend

Hiermee krijg jij een verzorgde melding in VARGO-stijl, én de klant krijgt automatisch een bevestiging met zijn datum erin. Het bestand `netlify/functions/submission-created.js` staat al klaar in je project. Je moet enkel nog de sleutel instellen.

1. Maak een gratis account op **resend.com**.
2. Ga naar **Domains** en voeg **vargo.be** toe.
3. Resend toont enkele DNS-records. Voeg die toe bij de partij waar je domeinnaam beheerd wordt. Wacht tot Resend het domein als geverifieerd toont. Zonder die verificatie mag je niet versturen vanaf feestje@vargo.be.
4. Ga in Resend naar **API Keys** en maak een nieuwe sleutel aan. Kopieer die.
5. Ga in Netlify naar **Site configuration > Environment variables**.
6. Klik **Add a variable**, met als naam exact: `RESEND_API_KEY` en als waarde de sleutel uit Resend.
7. Ga naar **Deploys** en klik **Trigger deploy > Deploy site**, zodat de sleutel wordt ingelezen.

Test daarna met een echte aanvraag via het formulier.

**Werkt het niet?** Ga in Netlify naar **Functions**, klik op `submission-created` en bekijk de logs. Daar staat wat er misging. De functie is zo gebouwd dat het formulier altijd blijft werken, ook wanneer de mail faalt. Je verliest dus nooit een aanvraag.

---

## Belangrijk om te weten

De twee manieren kunnen naast elkaar bestaan. Zet gerust manier 1 aan als vangnet, ook wanneer manier 2 werkt. Dan heb je altijd een spoor.

Kijk de eerste weken toch af en toe in het Netlify-dashboard onder Forms. Zo weet je zeker dat er geen aanvragen tussenuit vallen door een mailfilter.

Controleer ook of mails van je eigen domein niet in de spammap van je klanten belanden. Stuur een testaanvraag naar een Gmail-adres en een Outlook-adres, en kijk waar die toekomt.
