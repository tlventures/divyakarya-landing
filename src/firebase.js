import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export async function addToWaitlist(email, interest) {
  // Check for duplicate
  const q = query(collection(db, 'waitlist'), where('email', '==', email))
  const existing = await getDocs(q)
  if (!existing.empty) {
    return { success: false, duplicate: true }
  }

  const timestamp = new Date().toISOString()

  await addDoc(collection(db, 'waitlist'), {
    email,
    interest, // 'panchanga' | 'pandit' | 'both'
    joinedAt: timestamp,
  })

  // Mirror to Google Sheets (fire-and-forget — a Sheets failure won't surface to the user)
  fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, interest, timestamp }),
  }).catch((err) => console.warn('[sheets sync]', err.message))

  return { success: true, duplicate: false }
}
