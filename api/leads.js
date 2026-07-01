// Monterey Bay Door - Leads dashboard handler
// PIN-gated read of the leads logged by api/contact.js into Vercel Blob.
//   {action:'verify', pin}  -> {ok}
//   {action:'list',   pin}  -> {leads:[...]}  (newest first)

import { list } from '@vercel/blob';

const PORTAL_PIN = process.env.PORTAL_PIN || '1630';

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

    if (action === 'list') {
      const { blobs } = await list({ prefix: 'leads/' });
      // Pull each lead's JSON. Low volume; fine to fetch in parallel.
      const leads = (
        await Promise.all(
          blobs.map(async (b) => {
            try {
              const r = await fetch(b.url);
              if (!r.ok) return null;
              const data = await r.json();
              return { ...data, _blobPath: b.pathname };
            } catch {
              return null;
            }
          })
        )
      )
        .filter(Boolean)
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      return res.status(200).json({ leads, count: leads.length });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('[LEADS ERROR]', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
