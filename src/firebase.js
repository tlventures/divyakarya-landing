/**
 * Submits a waitlist signup directly to the Vercel serverless function,
 * which writes to Google Sheets. No Firebase dependency required.
 */
export async function addToWaitlist(email, interest) {
  const timestamp = new Date().toISOString()

  const res = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, interest, timestamp }),
  })

  if (!res.ok) throw new Error(`Server error: ${res.status}`)

  const data = await res.json()

  if (data.duplicate) return { success: false, duplicate: true }

  return { success: true, duplicate: false }
}
