import { google } from 'googleapis'

const SHEET_ID   = (process.env.GOOGLE_SHEET_ID ?? '').trim()
const SHEET_TAB  = 'Waitlist'

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? '{}')
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

/**
 * Vercel serverless function — POST /api/waitlist
 * Checks for duplicates by reading column A, then appends a new row.
 *
 * Required env vars (Vercel dashboard):
 *   GOOGLE_SERVICE_ACCOUNT_JSON  – full service account JSON (single-line)
 *   GOOGLE_SHEET_ID              – spreadsheet ID from its URL
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, interest, timestamp } = req.body ?? {}
  if (!email) return res.status(400).json({ error: 'email is required' })

  try {
    const auth  = getAuth()
    const sheets = google.sheets({ version: 'v4', auth })

    // ── Duplicate check: read existing emails from column A ──────────────────
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_TAB}!A:A`,
    })
    const emails = (existing.data.values ?? []).flat().map(e => e.toLowerCase().trim())
    if (emails.includes(email.toLowerCase().trim())) {
      return res.status(200).json({ success: false, duplicate: true })
    }

    // ── Append new row ────────────────────────────────────────────────────────
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_TAB}!A:D`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          email,
          interest ?? 'both',
          timestamp ?? new Date().toISOString(),
          new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        ]],
      },
    })

    return res.status(200).json({ success: true })

  } catch (err) {
    console.error('[waitlist] error:', err.message)
    return res.status(500).json({ success: false, error: err.message })
  }
}
