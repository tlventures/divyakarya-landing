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
    const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? ''
    console.log('[waitlist] JSON env length:', rawJson.length)
    console.log('[waitlist] Sheet ID:', process.env.GOOGLE_SHEET_ID)

    const credentials = JSON.parse(rawJson)
    console.log('[waitlist] Parsed SA email:', credentials.client_email)

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
    const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? ''
    const sheetId = process.env.GOOGLE_SHEET_ID ?? 'MISSING'
    let parsedEmail = 'parse-failed'
    try { parsedEmail = JSON.parse(rawJson).client_email } catch(_) {}
    return res.status(200).json({
      success: false,
      sheetsError: true,
      debug: err.message,
      jsonLen: rawJson.length,
      sheetId,
      parsedEmail,
    })
  }
}
