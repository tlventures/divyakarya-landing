/**
 * Submits a waitlist signup to the Vercel serverless function in
 * api/waitlist.js, which appends it to the Google Sheet.
 *
 * Firebase was the original backend; it was dropped in e0cb44d and this file
 * kept its old name for a while, which made the long-removed `firebase`
 * dependency look load-bearing.
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
