/**
 * Firebase config — replace with your actual values from:
 * console.firebase.google.com → Project Settings → Your apps → Web app
 *
 * Free Spark plan includes:
 *   - Firestore: 1GB storage, 50K reads/day, 20K writes/day
 *   - Enough for contact form messages
 */
import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? 'YOUR_API_KEY',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? 'YOUR_PROJECT.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? 'YOUR_PROJECT_ID',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? 'YOUR_SENDER_ID',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? 'YOUR_APP_ID',
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const db = getFirestore(app)

// ── Types ────────────────────────────────────────────────────────────────────
export interface ContactMessage {
  id?: string
  name: string
  company: string
  email: string
  phone: string
  message: string
  fileName: string       // attachment filename (empty if none)
  fileBase64: string     // base64 data URI (empty if none, max ~500KB)
  lang: string
  read: boolean
  createdAt: Timestamp | null
}

// ── Write ────────────────────────────────────────────────────────────────────
export async function saveContact(data: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'contacts'), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

// ── Read ─────────────────────────────────────────────────────────────────────
export async function fetchContacts(): Promise<ContactMessage[]> {
  const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ContactMessage))
}
