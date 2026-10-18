import { google } from 'googleapis'

const SHEET_ID  = (process.env.GOOGLE_SHEET_ID ?? '').trim()
const SHEET_TAB = 'DeletionRequests'

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? '{}')
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

/**
 * Create the tab on first use, with a header row.
 *
 * Deletion requests are rare and legally significant, so the endpoint
 * provisions its own tab rather than failing because nobody created one by
 * hand. Any other error is rethrown — only "tab already exists" is swallowed.
 */
async function ensureTab(sheets) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID })
  const exists = (meta.data.sheets ?? []).some(
    (s) => s.properties?.title === SHEET_TAB,
  )
  if (exists) return

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{ addSheet: { properties: { title: SHEET_TAB } } }],
    },
  })
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A:F`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        'Email', 'App', 'Scope', 'Note', 'Received (ISO)', 'Received (IST)',
      ]],
    },
  })
}

/**
 * Vercel serverless function — POST /api/delete-request
 *
 * Records a data-deletion request. Google Play requires a publicly reachable
 * URL where users can ask for their account and data to be deleted; this is
 * the endpoint behind that page.
 *
 * Deliberately does NOT delete anything on its own. Anyone can type anyone
 * else's address into a public form, so a request here is a ticket: ownership
 * is verified out of band before any data is touched.
 *
 * Required env vars (same as the waitlist — see .env.example):
 *   GOOGLE_SERVICE_ACCOUNT_JSON
 *   GOOGLE_SHEET_ID
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, app, scope, note } = req.body ?? {}

  const address = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (!address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
    return res.status(400).json({ error: 'A valid email address is required' })
  }
  // The page offers two choices; anything else is a malformed client.
  const requestScope = scope === 'data-only' ? 'data-only' : 'account-and-data'

  try {
    const auth   = getAuth()
    const sheets = google.sheets({ version: 'v4', auth })
    await ensureTab(sheets)

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_TAB}!A:F`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          address,
          typeof app === 'string' && app ? app.slice(0, 60) : 'AI Pandit',
          requestScope,
          typeof note === 'string' ? note.slice(0, 1000) : '',
          new Date().toISOString(),
          new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        ]],
      },
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('[delete-request] error:', err.message)
    return res.status(500).json({ success: false, error: err.message })
  }
}
