// Wordt door Netlify automatisch aangeroepen bij elke formulierinzending.
// Stuurt een melding naar VARGO en een bevestiging naar de klant.
// Vereist de omgevingsvariabele RESEND_API_KEY in Netlify.
// Zonder die sleutel geeft deze functie bewust een foutstatus zodat een ontbrekende mailconfiguratie niet stil wordt gemaskeerd.

const NAAR_VARGO = 'feestje@vargo.be';
const VAN = 'VARGO <feestje@vargo.be>';

function veilig(waarde) {
  if (waarde === undefined || waarde === null) return '';
  return String(waarde)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function datumNL(waarde) {
  if (!waarde) return '';
  const d = new Date(waarde);
  if (isNaN(d.getTime())) return veilig(waarde);
  return d.toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function rij(label, waarde) {
  if (!waarde) return '';
  return `<tr>
    <td style="padding:9px 16px 9px 0;color:#8a7a68;font-size:13px;vertical-align:top;white-space:nowrap">${veilig(label)}</td>
    <td style="padding:9px 0;color:#1c1512;font-size:15px;font-weight:600">${veilig(waarde)}</td>
  </tr>`;
}

async function verstuur(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const tekst = await res.text();
    throw new Error(`Resend gaf ${res.status}: ${tekst}`);
  }
  return res.json();
}

exports.handler = async (event) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('RESEND_API_KEY ontbreekt, er wordt geen mail verstuurd.');
    return { statusCode: 500, body: 'RESEND_API_KEY ontbreekt.' };
  }

  let data = {};
  let formNaam = '';
  try {
    const body = JSON.parse(event.body || '{}');
    const payload = body.payload || {};
    data = payload.data || {};
    formNaam = payload.form_name || '';
  } catch (err) {
    console.error('Kon de inzending niet lezen:', err);
    return { statusCode: 400, body: 'Ongeldige inzending.' };
  }

  const voornaam = data.voornaam || '';
  const naam = data.naam || '';
  const volledigeNaam = `${voornaam} ${naam}`.trim();
  const email = data.email || '';
  const telefoon = data.telefoon || '';
  const datum = datumNL(data.datum);
  const datumAlt = datumNL(data['datum-alt']);
  const gemeente = data.gemeente || '';
  const gelegenheid = data.gelegenheid || '';
  const gasten = data.gasten || '';
  const postcode = data.postcode || '';
  const formule = data.formule || '';
  const dranken = data.dranken || '';
  const merken = data.merken || '';
  const bediening = data.bediening || '';
  const flexibel = data.flexibel || '';
  const wens = data.wens || '';

  const rijen = [
    rij('Datum', datum),
    rij('Alternatief', datumAlt),
    rij('Flexibel', flexibel),
    rij('Locatie', [postcode, gemeente].filter(Boolean).join(' ')),
    rij('Gelegenheid', gelegenheid),
    rij('Aantal gasten', gasten),
    rij('Formule', formule),
    rij('Drankvoorkeur', dranken),
    rij('Merken / favorieten', merken),
    rij('Bediening', bediening),
    rij('Naam', volledigeNaam),
    rij('E-mail', email),
    rij('Telefoon', telefoon)
  ].join('');

  const wensBlok = wens
    ? `<div style="margin-top:22px;padding:18px 20px;background:#f6f1ea;border-left:3px solid #c78a3c">
         <div style="color:#8a7a68;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:7px">Wat ze meegeven</div>
         <div style="color:#1c1512;font-size:15px;line-height:1.7">${veilig(wens)}</div>
       </div>`
    : '';

  const melding = `<!doctype html><html lang="nl"><body style="margin:0;padding:28px 18px;background:#efe9e1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
    <div style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #e0d6c8">
      <div style="padding:26px 30px;background:#1c1512">
        <div style="color:#e8a33a;font-size:13px;letter-spacing:.24em;font-weight:700">VARGO</div>
        <div style="color:#efe9e1;font-size:19px;margin-top:7px">Nieuwe aanvraag</div>
      </div>
      <div style="padding:26px 30px">
        <table style="width:100%;border-collapse:collapse">${rijen}</table>
        ${wensBlok}
        <div style="margin-top:26px;padding-top:20px;border-top:1px solid #e8e0d4">
          ${telefoon ? `<a href="tel:${veilig(telefoon)}" style="display:inline-block;padding:11px 20px;margin-right:8px;background:#1c1512;color:#e8a33a;text-decoration:none;font-size:13px;font-weight:700">Bellen</a>` : ''}
          ${email ? `<a href="mailto:${veilig(email)}" style="display:inline-block;padding:11px 20px;background:#f6f1ea;color:#1c1512;text-decoration:none;font-size:13px;font-weight:700;border:1px solid #d8ccb8">Antwoorden</a>` : ''}
        </div>
      </div>
    </div>
  </body></html>`;

  const bevestiging = `<!doctype html><html lang="nl"><body style="margin:0;padding:28px 18px;background:#efe9e1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
    <div style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #e0d6c8">
      <div style="padding:34px 30px;background:#1c1512;text-align:center">
        <div style="color:#e8a33a;font-size:15px;letter-spacing:.28em;font-weight:700">VARGO</div>
        <div style="color:#efe9e1;font-size:21px;margin-top:12px;line-height:1.4">We hebben je aanvraag<br>goed ontvangen.</div>
      </div>
      <div style="padding:30px">
        <p style="margin:0 0 18px;color:#1c1512;font-size:16px;line-height:1.75">Dag ${veilig(voornaam) || 'daar'},</p>
        <p style="margin:0 0 18px;color:#40342c;font-size:15px;line-height:1.8">Bedankt om jullie avond door te geven. We controleren de beschikbaarheid en bekijken welke VARGO-formule het best past. Daarna ontvang je een persoonlijk voorstel.</p>
        ${datum ? `<div style="margin:22px 0;padding:18px 20px;background:#f6f1ea;border-left:3px solid #c78a3c">
          <div style="color:#8a7a68;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">Jouw datum</div>
          <div style="color:#1c1512;font-size:17px;font-weight:600">${veilig(datum)}${gemeente ? ` in ${veilig(gemeente)}` : ''}</div>
        </div>` : ''}
        <p style="margin:0 0 18px;color:#40342c;font-size:15px;line-height:1.8">Je legt hiermee nog niets definitief vast. Een datum is pas gereserveerd na een bevestigd voorstel en het voorschot.</p>
        <p style="margin:0 0 6px;color:#40342c;font-size:15px;line-height:1.8">Ondertussen een vraag? Bel gerust op <a href="tel:+32470186726" style="color:#1c1512;font-weight:600">0470 18 67 26</a> of antwoord op deze mail.</p>
        <div style="margin-top:30px;padding-top:22px;border-top:1px solid #e8e0d4;color:#8a7a68;font-size:13px;line-height:1.8">
          VARGO, de bruine kroeg op locatie<br>
          Forma Concepts BV, Bredestraat 30A, 9920 Lievegem<br>
          BTW BE 1039.945.512
        </div>
      </div>
    </div>
  </body></html>`;

  try {
    await verstuur(apiKey, {
      from: VAN,
      to: [NAAR_VARGO],
      reply_to: email || undefined,
      subject: `Nieuwe aanvraag${volledigeNaam ? ` van ${volledigeNaam}` : ''}${datum ? ` voor ${datum}` : ''}`,
      html: melding
    });
    console.log('Melding naar VARGO verstuurd.');
  } catch (err) {
    console.error('Melding naar VARGO mislukt:', err.message);
  }

  if (email) {
    try {
      await verstuur(apiKey, {
        from: VAN,
        to: [email],
        reply_to: NAAR_VARGO,
        subject: 'Je aanvraag bij VARGO is goed aangekomen',
        html: bevestiging
      });
      console.log('Bevestiging naar klant verstuurd.');
    } catch (err) {
      console.error('Bevestiging naar klant mislukt:', err.message);
    }
  }

  return { statusCode: 200, body: 'Verwerkt.' };
};
