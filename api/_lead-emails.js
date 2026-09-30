// Monterey Bay Door - lead email templates.
// Underscore prefix: Vercel does not expose this file as a route.
//
// Email clients ignore <style> blocks and CSS variables, so every style is
// inline and every layout is a table. Colours are the site's brand tokens
// (src/assets/css): dark teal #051E21, sage #566A33 on light, #94AB69 on dark.

const TEAL = '#051E21';
const SAGE = '#566A33';
const SAGE_BRIGHT = '#94AB69';
const PAPER = '#f5f5f0';
const INK = '#1f2a2b';
const MUTED = '#5c6667';
const RULE = '#e2e2da';
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";

const LOGO = 'https://www.mbdoor.com/assets/logos/logo-email-white.png';
const OFFICE_PHONE = '(831) 757-1878';
const OFFICE_TEL = '+18317571878';
export const BIDS_EMAIL = 'bids@mbdoor.com';

// The contact form's <select> values, as the form shows them.
const PROJECT_LABELS = {
  'access-control': 'Access control system',
  'door-hardware': 'Door hardware',
  'service-maintenance': 'Service & maintenance',
  'emergency-repair': 'Emergency repair',
  'consultation': 'Consultation',
};

export function projectLabel(value) {
  if (!value) return '';
  return PROJECT_LABELS[value] || String(value);
}

// Every value below came from a public form. Escape it before it touches HTML.
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function digits(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function prettyPhone(phone) {
  const d = digits(phone).replace(/^1(?=\d{10}$)/, '');
  if (d.length !== 10) return phone;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function telHref(phone) {
  const d = digits(phone).replace(/^1(?=\d{10}$)/, '');
  return d.length === 10 ? `tel:+1${d}` : `tel:${d}`;
}

function firstName(name) {
  return String(name || '').trim().split(/\s+/)[0] || 'there';
}

function button(href, label, { fill = SAGE, color = '#ffffff', border = fill } = {}) {
  return `<a href="${esc(href)}" style="display:inline-block;padding:12px 22px;margin:0 8px 8px 0;background:${fill};color:${color};border:1px solid ${border};border-radius:6px;font-family:${FONT};font-size:15px;font-weight:600;text-decoration:none;">${label}</a>`;
}

function shell({ preheader, body, footer }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Monterey Bay Door</title></head>
<body style="margin:0;padding:0;background:${PAPER};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${RULE};border-radius:10px;overflow:hidden;">
<tr><td style="background:${TEAL};padding:22px 28px;border-bottom:3px solid ${SAGE_BRIGHT};">
<img src="${LOGO}" width="180" height="48" alt="Monterey Bay Door" style="display:block;border:0;width:180px;height:auto;">
</td></tr>
${body}
<tr><td style="background:${TEAL};padding:18px 28px;font-family:${FONT};font-size:12px;line-height:1.6;color:rgba(255,255,255,0.75);">
${footer}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function row(label, valueHtml) {
  return `<tr>
<td style="padding:12px 0;border-bottom:1px solid ${RULE};font-family:${FONT};font-size:13px;color:${MUTED};width:120px;vertical-align:top;">${label}</td>
<td style="padding:12px 0;border-bottom:1px solid ${RULE};font-family:${FONT};font-size:15px;color:${INK};vertical-align:top;">${valueHtml}</td>
</tr>`;
}

// The internal alert: goes to bids@mbdoor.com with Tommy on cc.
export function notificationEmail({ name, company, email, phone, projectType, message, triage }) {
  const project = projectLabel(projectType);
  const link = `color:${SAGE};text-decoration:underline;`;
  const banner = triage && triage !== 'clean'
    ? `<tr><td style="background:#fff4d6;padding:12px 28px;font-family:${FONT};font-size:14px;color:#6b4e00;border-bottom:1px solid #f0dc9e;"><strong>Flagged by the filter (${esc(triage)}).</strong> This one went to GullStack only, not to Monterey Bay Door.</td></tr>`
    : '';

  const buttons = [
    button(`mailto:${email}?subject=${encodeURIComponent('Your Monterey Bay Door request')}`, `Reply to ${esc(firstName(name))}`),
    phone ? button(telHref(phone), `Call ${esc(prettyPhone(phone))}`, { fill: '#ffffff', color: TEAL, border: TEAL }) : '',
  ].join('');

  const body = `${banner}
<tr><td style="padding:28px 28px 8px;font-family:${FONT};">
<p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${SAGE};font-weight:700;">New website lead${project ? ` &middot; ${esc(project)}` : ''}</p>
<h1 style="margin:0 0 4px;font-size:24px;line-height:1.25;color:${INK};">${esc(name)}</h1>
${company ? `<p style="margin:0;font-size:15px;color:${MUTED};">${esc(company)}</p>` : ''}
</td></tr>
${message ? `<tr><td style="padding:16px 28px 4px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="background:${PAPER};border-left:4px solid ${SAGE};border-radius:4px;padding:16px 18px;font-family:${FONT};font-size:16px;line-height:1.55;color:${INK};">${esc(message).replace(/\n/g, '<br>')}</td>
</tr></table>
</td></tr>` : ''}
<tr><td style="padding:20px 28px 4px;">${buttons}</td></tr>
<tr><td style="padding:8px 28px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row('Email', `<a href="mailto:${esc(email)}" style="${link}">${esc(email)}</a>`)}
${row('Phone', phone ? `<a href="${telHref(phone)}" style="${link}">${esc(prettyPhone(phone))}</a>` : '<span style="color:#8a9293;">Not given</span>')}
${row('Company', company ? esc(company) : '<span style="color:#8a9293;">Not given</span>')}
${row('Project', project ? esc(project) : '<span style="color:#8a9293;">Not chosen</span>')}
</table>
<p style="margin:16px 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${MUTED};">Hitting <strong>Reply</strong> answers ${esc(firstName(name))} directly. We told them to send plans and specs to ${BIDS_EMAIL}.</p>
</td></tr>`;

  return shell({
    preheader: `${name}${company ? ` (${company})` : ''}: ${message || project || 'new request'}`.slice(0, 140),
    body,
    footer: `Sent from the contact form at www&#8203;.mbdoor&#8203;.com. Every lead is also logged, so nothing is lost if an email bounces.<br>Website and lead tracking by GullStack.`,
  });
}

// The thank-you the customer gets. Reply-To is bids@, so plans sent back land there.
export function confirmationEmail({ name, projectType, message }) {
  const project = projectLabel(projectType);
  const body = `
<tr><td style="padding:32px 28px 8px;font-family:${FONT};">
<h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:${INK};">Thanks, ${esc(firstName(name))}. We have your request.</h1>
<p style="margin:0;font-size:16px;line-height:1.6;color:${INK};">Someone from our team will get back to you within one business day.</p>
</td></tr>
<tr><td style="padding:20px 28px 4px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="background:${PAPER};border:1px solid ${RULE};border-radius:8px;padding:18px 20px;font-family:${FONT};">
<p style="margin:0 0 6px;font-size:15px;font-weight:700;color:${INK};">Have plans, drawings or a door schedule?</p>
<p style="margin:0;font-size:15px;line-height:1.55;color:${INK};">Reply to this email with them attached, or send them to <a href="mailto:${BIDS_EMAIL}" style="color:${SAGE};font-weight:600;">${BIDS_EMAIL}</a>. It goes straight to our bids team.</p>
</td></tr></table>
</td></tr>
${project || message ? `<tr><td style="padding:20px 28px 0;font-family:${FONT};">
<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};font-weight:700;">What you sent us</p>
${project ? `<p style="margin:0 0 6px;font-size:15px;color:${INK};"><strong>Project:</strong> ${esc(project)}</p>` : ''}
${message ? `<p style="margin:0;font-size:15px;line-height:1.55;color:${INK};">${esc(message).replace(/\n/g, '<br>')}</p>` : ''}
</td></tr>` : ''}
<tr><td style="padding:24px 28px 28px;font-family:${FONT};">
<p style="margin:0 0 12px;font-size:15px;color:${INK};">Need us sooner?</p>
${button(`tel:${OFFICE_TEL}`, `Call ${OFFICE_PHONE}`)}
</td></tr>`;

  return shell({
    preheader: 'We have your request. Send plans or specs to bids@mbdoor.com.',
    body,
    footer: `<strong style="color:#ffffff;">Monterey Bay Door</strong><br>Commercial doors, frames, hardware and access control &middot; Hollister, CA<br><a href="https://www.mbdoor.com/" style="color:${SAGE_BRIGHT};">mbdoor.com</a> &middot; <a href="tel:${OFFICE_TEL}" style="color:${SAGE_BRIGHT};">${OFFICE_PHONE}</a>`,
  });
}
