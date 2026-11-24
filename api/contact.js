// Monterey Bay Door - Contact Form Handler
// Sends notification email to business + auto-reply to lead via SendGrid,
// and logs every lead to Vercel Blob (leads/ prefix) so nothing is lost.

import { put } from '@vercel/blob';
// Shared across every client lead endpoint. Canonical copy lives in
// Gull-Stack/walkthru-labs → shared/lead-spam-filter.js; this is a synced copy,
// so fix it there and re-run shared/sync-lead-spam-filter.sh, not here.
import { classifyLead } from './lead-spam-filter.js';
import { notificationEmail, confirmationEmail, projectLabel, BIDS_EMAIL, SERVICE_EMAIL, isServiceRequest, SCOPE_LABELS, SUPPLY_LABELS, ISSUE_LABELS, URGENCY_LABELS } from './_lead-emails.js';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'leads@gullstack.com';
// Routing, per Tommy (text, 2026-09-30): leads and plans go to the bids desk.
// Tommy stays on cc; GullStack gets a bcc so we can prove delivery.
// Hardcoded on purpose: the old SITE_EMAIL env var pointed at Tommy alone.
const LEAD_TO = BIDS_EMAIL;
const LEAD_CC = 'tomrehak@mbdoor.com';
// Service calls (Tito, email 8 Oct 2026): to service@mbdoor.com with Tito on cc.
const SERVICE_CC = 'tito@staleydoor.com';
const LEAD_BCC = 'bryce@gullstack.com';

function slugify(s) {
  return String(s || 'lead')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'lead';
}

// One line of form text: trimmed, single-spaced, capped.
function clean(value, max = 200) {
  if (typeof value !== 'string') return null;
  const s = value.replace(/\s+/g, ' ').trim().slice(0, max);
  return s || null;
}

// A plan link is the one place a customer is asked for a URL, so it has its
// own field and is checked here. (URLs in the message are still spam.)
function cleanPlanLink(value) {
  let s = clean(value, 500);
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  try {
    const u = new URL(s);
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes('.')) return null;
    return u.href;
  } catch (e) {
    return null;
  }
}

function prettyDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (isNaN(d) || d.getUTCMonth() !== +m[2] - 1) return null;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// Service-call photos. The form shrinks each one to a JPEG in the browser and
// sends it as a data URL. Anything that is not a small JPEG is dropped.
const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 1024 * 1024;
function decodePhotos(value) {
  if (!Array.isArray(value)) return [];
  const out = [];
  for (const item of value.slice(0, MAX_PHOTOS)) {
    if (typeof item !== 'string') continue;
    const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(item);
    if (!m) continue;
    const buf = Buffer.from(m[1], 'base64');
    if (buf.length < 100 || buf.length > MAX_PHOTO_BYTES) continue;
    if (buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) continue; // JPEG magic bytes
    out.push(buf);
  }
  return out;
}

function isGibberish(text) {
  if (!text || text.length < 2) return false;
  const cleaned = text.toLowerCase().replace(/[^a-z]/g, '');
  if (cleaned.length < 2) return false;
  const vowels = cleaned.match(/[aeiou]/g);
  if (!vowels || vowels.length < cleaned.length * 0.15) return true;
  if (/[^aeiou]{5,}/i.test(cleaned)) return true;
  return false;
}

function looksLikeSpam(data) {
  const { name, fax_number, _timestamp, email, message } = data;
  if (fax_number) return 'honeypot';
  if (_timestamp) {
    const elapsed = Date.now() - parseInt(_timestamp, 10);
    if (elapsed < 3000) return 'too_fast';
  }
  if (isGibberish(name)) return 'gibberish_name';
  if (name && /[_|<>{}[\]\\\/~`^]/.test(name)) return 'suspicious_name_chars';

  if (email) {
    const localPart = email.split('@')[0];
    if (isGibberish(localPart)) return 'gibberish_email';
    const disposable = /@(mailinator|guerrillamail|tempmail|throwaway|yopmail|sharklasers|grr\.la|dispostable|maildrop)\./i;
    if (disposable.test(email)) return 'disposable_email';
  }

  if (message) {
    const spamPatterns = /\b(viagra|casino|crypto|bitcoin|lottery|prize|winner|click here|buy now|free money|seo services|backlink|link building)\b/i;
    if (spamPatterns.test(message)) return 'spam_content';
    const urls = message.match(/https?:\/\/[^\s)]+/g) || [];
    const externalUrls = urls.filter(u => !u.includes('mbdoor.com'));
    if (externalUrls.length > 0) return 'external_url';
  }

  return false;
}

async function sendEmail({ to, from, fromName, subject, html, replyTo, cc, bcc }) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: to }],
        ...(cc ? { cc: [{ email: cc }] } : {}),
        ...(bcc ? { bcc: [{ email: bcc }] } : {}),
      }],
      from: { email: from, name: fromName || 'Monterey Bay Door' },
      reply_to: replyTo ? { email: replyTo } : undefined,
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });
  // Return a RESULT, never a bare boolean that call sites can drop. `detail`
  // carries SendGrid's own error body, which names the real cause (duplicate
  // recipient across to/cc, unverified sender, revoked key) instead of a bare
  // status. A silent send failure is how leads go missing for months.
  let detail = '';
  if (!response.ok) {
    try { detail = (await response.text()).slice(0, 400); } catch (e) { detail = ''; }
  }
  return { ok: response.ok, status: response.status, detail };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, company, email, phone, message, fax_number, _timestamp } = req.body;
    const requestType = req.body['request-type'] || req.body.requestType || null;
    const legacyType = req.body['project-type'] || req.body.projectType;
    const service = isServiceRequest(requestType, legacyType);

    // The choices added for Erika (23 Nov 2026). Only known option values count.
    const pick = (labels, key) => (Object.hasOwn(labels, req.body[key]) ? labels[req.body[key]] : null);
    const scope = pick(SCOPE_LABELS, 'bid-scope');
    const issue = pick(ISSUE_LABELS, 'service-issue');
    const urgency = pick(URGENCY_LABELS, 'service-urgency');
    const urgent = service && req.body['service-urgency'] === 'urgent';
    // What the emails and the lead log show as the request's subject. A cached
    // copy of the old form still sends `project-type`.
    const projectType = (service ? issue : scope) || legacyType;
    const planLink = service ? null : cleanPlanLink(req.body['plan-link']);
    const details = (service
      ? [
          ['How soon', urgency],
          ['Property', clean(req.body['property-name'], 120)],
          ['Address', clean(req.body['service-address'], 200)],
          ['Door / opening', clean(req.body['door-location'], 120)],
          ['On-site contact', [clean(req.body['onsite-name'], 120), clean(req.body['onsite-phone'], 40)].filter(Boolean).join(', ')],
        ]
      : [
          ['Project', clean(req.body['project-name'], 120)],
          ['City / ZIP', clean(req.body['project-city'], 80)],
          ['Supply / install', pick(SUPPLY_LABELS, 'supply-install')],
          ['Bid due', prettyDate(req.body['bid-due'])],
        ]
    ).filter(([, value]) => value);

    const spamReason = looksLikeSpam({ name, fax_number, _timestamp, email, message });
    if (spamReason) {
      console.log(`[SPAM BLOCKED] reason=${spamReason} name="${name}" email="${email}"`);
      return res.status(200).json({ success: true });
    }

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const leadData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      company: clean(company, 120),
      interest: projectLabel(projectType) || null,
      request_type: service ? 'service' : 'bid',
      details: Object.fromEntries(details),
      plan_link: planLink,
      photos: [],
      message: message?.trim() || null,
      source: 'mbdoor.com',
      status: 'new',
      email_sent: false,
      created_at: new Date().toISOString(),
    };

    // Customer, or someone selling to Tom? Three of the recent "leads" here were
    // outbound sales, including a VA agency that hit D One Builders in June under
    // a different name from the same phone number. Flagged submissions are still
    // logged to Blob — the record is never lost — but the alert comes to us.
    const triage = classifyLead({
      name, email, phone: leadData.phone, message,
      extraText: [projectType, company, ...details.map(([, value]) => value)].filter(Boolean).join(' '),
    });
    const isClean = triage.verdict === 'clean';
    leadData.triage = triage.verdict;
    if (!isClean) {
      leadData.triage_reasons = triage.reasons;
      console.log(`[LEAD TRIAGE] verdict=${triage.verdict} reasons=${triage.reasons.join('|')} name="${name}" — routed to Bryce, NOT the client`);
    }

    // Service-call photos go to Blob first, so their links are in the log and
    // the email. Kept off the leads/ prefix: the /leads dashboard lists that
    // prefix and reads every file in it as a lead. A cold pitch stores nothing.
    // A failed upload never blocks the lead.
    const photoUrls = [];
    if (service && triage.verdict !== 'solicitation') {
      const day = leadData.created_at.slice(0, 10);
      const stamp = Date.now();
      const photos = decodePhotos(req.body.photos);
      for (let i = 0; i < photos.length; i++) {
        try {
          const blob = await put(`lead-photos/${day}/${stamp}-${slugify(leadData.name)}-${i + 1}.jpg`, photos[i], {
            access: 'public',
            contentType: 'image/jpeg',
            addRandomSuffix: true,
          });
          photoUrls.push(blob.url);
        } catch (e) {
          console.error('Lead photo upload error:', e);
        }
      }
      leadData.photos = photoUrls;
    }

    // Log every lead to Vercel Blob so nothing is ever lost, even if email
    // fails. One JSON file per lead under leads/YYYY-MM-DD/. The /leads
    // dashboard reads these back (list by prefix 'leads/'). Never allowed to
    // break the email path below.
    try {
      const day = leadData.created_at.slice(0, 10); // YYYY-MM-DD
      const key = `leads/${day}/${Date.now()}-${slugify(leadData.name)}.json`;
      await put(key, JSON.stringify(leadData, null, 2), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: true, // unguessable URL — record is only listable with the store token
      });
    } catch (e) {
      console.error('Lead blob log error:', e);
    }

    if (SENDGRID_API_KEY) {
      const emailData = { name: leadData.name, company, email: leadData.email, phone: leadData.phone, projectType, message: leadData.message, triage: triage.verdict, service, details, planLink, photos: photoUrls, urgent };
      const confirmationHtml = confirmationEmail(emailData);

      // Skipped on a flagged submission: thanking a cold pitch confirms the
      // mailbox is live and gets the address resold.
      if (isClean) {
        await sendEmail({
          to: email,
          from: FROM_EMAIL,
          subject: 'We got your request - Monterey Bay Door',
          html: confirmationHtml,
          // Replies land on the desk that owns the request, not a no-reply box.
          replyTo: service ? SERVICE_EMAIL : BIDS_EMAIL,
        });
      }

      const notificationHtml = notificationEmail(emailData);

      // A solicitation gets no email at all — not to the client, not to Bryce.
      // It is already in the log above; nobody needs to read a cold pitch to
      // know one arrived. Test submissions still mail Bryce so the pipe is
      // provably alive. (Bryce, 2026-09-23: "don't let me even see it.")
      if (triage.verdict === 'solicitation') {
        console.log(`[LEAD] name="${leadData.name}" triage=solicitation notify=skipped`);
        return res.status(200).json({ success: true });
      }

      const label = projectLabel(projectType);
      const who = company ? `${leadData.name}, ${company}` : leadData.name;
      const notify = await sendEmail({
        to: isClean ? (service ? SERVICE_EMAIL : LEAD_TO) : LEAD_BCC,
        from: FROM_EMAIL,
        fromName: `${leadData.name} via Monterey Bay Door`,
        subject: isClean
          ? `${service ? (urgent ? 'URGENT SERVICE CALL' : 'SERVICE CALL') : 'New bid request'}: ${who}${label ? ' - ' + label : ''}`
          : `[OUR TEST - not a lead]: ${leadData.name}`,
        html: notificationHtml,
        replyTo: email,
        // Flagged mail goes to GullStack only. SendGrid rejects a
        // personalization that repeats an address across to/cc/bcc, which
        // fails the send outright, so no cc/bcc on that path.
        cc: isClean ? (service ? SERVICE_CC : LEAD_CC) : undefined,
        bcc: isClean ? LEAD_BCC : undefined,
      });
      console.log(`[LEAD] name="${leadData.name}" triage=${triage.verdict} request=${leadData.request_type} notify=${notify.ok ? 'sent' : `FAILED ${notify.status} ${notify.detail}`}`);
      if (!notify.ok) {
        console.error(`[LEAD] 🔴 notification FAILED: ${notify.status} ${notify.detail}`);
        // The lead is safe in Blob either way, but a visitor must not be told
        // it worked when nobody was told about them.
        return res.status(500).json({ error: 'Something went wrong. Please call us at (831) 757-1878.' });
      }
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please call us at (831) 757-1878.' });
  }
}
