// Monterey Bay Door - Crew Project Portal handler
// PIN-gated: uploads job photos to Vercel Blob + emails a summary via SendGrid.
// Stateless three-step flow driven by the client:
//   {action:'verify', pin}                                   -> {ok}
//   {action:'photo',  pin, jobSlug, filename, data(base64)}  -> {url}
//   {action:'finish', pin, job, photoUrls[]}                 -> uploads meta.json, sends email

import { put } from '@vercel/blob';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'leads@gullstack.com';
const NOTIFY_EMAIL = process.env.PORTAL_NOTIFY_EMAIL || 'bryce@gullstack.com';
const PORTAL_PIN = process.env.PORTAL_PIN || '1630';

export const config = { api: { bodyParser: { sizeLimit: '4mb' } } };

function slugify(s) {
  return (s || 'job')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'job';
}

function esc(s) {
  return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

async function sendEmail({ subject, html }) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: NOTIFY_EMAIL }] }],
      from: { email: FROM_EMAIL, name: 'MBD Crew Portal' },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });
  return response.ok;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { action, pin } = req.body || {};
    if (!pin || String(pin) !== String(PORTAL_PIN)) {
      return res.status(401).json({ error: 'Wrong PIN' });
    }

    if (action === 'verify') {
      return res.status(200).json({ ok: true });
    }

    if (action === 'photo') {
      const { jobSlug, filename, data } = req.body;
      if (!data || !jobSlug) return res.status(400).json({ error: 'Missing photo data' });
      const buf = Buffer.from(data, 'base64');
      if (buf.length > 3 * 1024 * 1024) return res.status(413).json({ error: 'Photo too large' });
      const safeName = slugify(String(filename || 'photo').replace(/\.[a-z0-9]+$/i, ''));
      const path = `projects/${slugify(jobSlug)}/${Date.now()}-${safeName}.jpg`;
      const blob = await put(path, buf, {
        access: 'public',
        contentType: 'image/jpeg',
      });
      return res.status(200).json({ url: blob.url });
    }

    if (action === 'finish') {
      const { job = {}, photoUrls = [] } = req.body;
      const jobSlug = slugify(job.jobName);
      const meta = {
        submittedAt: new Date().toISOString(),
        jobName: job.jobName || '',
        city: job.city || '',
        workType: job.workType || '',
        notes: job.notes || '',
        submittedBy: job.submittedBy || '',
        photoUrls,
      };
      await put(`projects/${jobSlug}/meta-${Date.now()}.json`, JSON.stringify(meta, null, 2), {
        access: 'public',
        contentType: 'application/json',
      });

      const photoLinks = photoUrls
        .map((u, i) => `<li><a href="${esc(u)}">Photo ${i + 1}</a></li>`)
        .join('');
      const html = `
        <h2>New crew portal submission</h2>
        <p><strong>Job:</strong> ${esc(meta.jobName)}<br>
        <strong>City:</strong> ${esc(meta.city)}<br>
        <strong>Type:</strong> ${esc(meta.workType)}<br>
        <strong>Submitted by:</strong> ${esc(meta.submittedBy)}<br>
        <strong>Notes:</strong> ${esc(meta.notes)}</p>
        <p><strong>${photoUrls.length} photo(s):</strong></p>
        <ul>${photoLinks}</ul>`;
      const sent = await sendEmail({
        subject: `Portal: ${meta.jobName || 'New job'} (${photoUrls.length} photos)`,
        html,
      });
      return res.status(200).json({ ok: true, emailed: sent });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('[PORTAL ERROR]', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
