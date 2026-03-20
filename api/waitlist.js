import { google } from 'googleapis'

/**
 * Vercel serverless function — POST /api/waitlist
 * Appends a new waitlist signup row to Google Sheets.
 *
 * Required env vars (set in Vercel dashboard):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL   – service account client_email
 *   GOOGLE_PRIVATE_KEY             – service account private_key (with literal \n)
 *   GOOGLE_SHEET_ID                – the spreadsheet ID from its URL
 */
export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, interest, timestamp } = req.body ?? {}

  if (!email) {
    return res.status(400).json({ error: 'email is required' })
  }

  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Vercel stores the key with literal \n — replace them with real newlines
      key: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
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
    // Return 200 so a Sheets hiccup doesn't break the user-facing form
    return res.status(200).json({ success: false, sheetsError: true })
  }
}
