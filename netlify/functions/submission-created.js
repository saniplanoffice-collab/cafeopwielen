// Netlify verstuurt automatisch een event zodra een formulier is ingezonden.
// Deze functie luistert daarnaar en stuurt twee mails via Resend:
// 1. een bevestiging naar de klant, 2. een notificatie naar VARGO.
// Vereist een omgevingsvariabele RESEND_API_KEY in de Netlify-instellingen.

exports.handler = async function (event) {
  try {
    const payload = JSON.parse(event.body).payload;
    const data = payload.data || {};
    const formName = payload.form_name || '';

    // Enkel reageren op de aanvraag- en wachtlijstformulieren
    if (formName !== 'vargo-aanvraag' && formName !== 'vargo-wachtlijst') {
      return { statusCode: 200, body: 'Formulier genegeerd.' };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log('RESEND_API_KEY ontbreekt, mail niet verstuurd.');
      return { statusCode: 200, body: 'Geen API-sleutel, overgeslagen.' };
    }

    const van = 'VARGO <feestje@vargo.be>';
    const intern = 'feestje@vargo.be';
    const klantEmail = data.email;
    const voornaam = data.voornaam || '';

    // Overzicht van de aanvraag voor de interne mail
    const velden = Object.keys(data)
      .filter((k) => !['bot-field', 'form-name'].includes(k) && data[k])
      .map((k) => `${k}: ${data[k]}`)
      .join('\n');

    async function stuur(naar, onderwerp, tekst) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: van, to: [naar], subject: onderwerp, text: tekst }),
      });
      if (!res.ok) console.log('Resend fout:', await res.text());
    }

    // 1. Bevestiging naar de klant
    if (klantEmail) {
      const klantTekst =
        `Dag ${voornaam},\n\n` +
        `We hebben jullie avond goed ontvangen. We bekijken nu hoe VARGO het beste bij jullie feest past en laten snel van ons horen.\n\n` +
        `Je hoeft nog niets definitief te beslissen.\n\n` +
        `Tot binnenkort,\nVARGO\nDe bruine kroeg op locatie\nfeestje@vargo.be`;
      await stuur(klantEmail, 'We hebben jullie VARGO-avond ontvangen', klantTekst);
    }

    // 2. Notificatie naar VARGO
    const internTekst =
      `Nieuwe ${formName === 'vargo-aanvraag' ? 'aanvraag' : 'wachtlijst-inschrijving'} via de website:\n\n${velden}\n\n` +
      `Antwoord snel, liefst binnen het uur.`;
    await stuur(intern, `Nieuwe aanvraag: ${data.gemeente || ''} ${data.gelegenheid || ''}`.trim(), internTekst);

    return { statusCode: 200, body: 'Mails verstuurd.' };
  } catch (err) {
    console.log('Function fout:', err);
    return { statusCode: 200, body: 'Fout opgevangen.' };
  }
};
