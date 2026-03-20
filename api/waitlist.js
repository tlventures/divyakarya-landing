import { google } from 'googleapis'

/**
 * Vercel serverless function — POST /api/waitlist
 * Appends a new waitlist signup row to Google Sheets.
 *
 * Required env vars (set in Vercel dashboard):
 *   GOOGLE_SERVICE_ACCOUNT_JSON  – full service account JSON (single-line)
 *   GOOGLE_SHEET_ID              – the spreadsheet ID from its URL
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, interest, timestamp } = req.body ?? {}

  if (!email) {
    return res.status(400).json({ error: 'email is required' })
  }

  try {
    // Parse the full service account JSON — private_key \n escapes are handled
    // automatically by JSON.parse, so no manual replacement needed.
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? '{}')

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    // Append a row: [Email, Interest, ISO Timestamp, Human-readable date (IST)]
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Waitlist!A:D',
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
    console.error('[waitlist] Sheets write error:', err.message)
    return res.status(200).json({ success: false, sheetsError: true, debug: err.message })
  }
}
