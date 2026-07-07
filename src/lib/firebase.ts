import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? 'AIzaSyD5UpC4ReyJdEpkNERLRfieUFwOUOlhF9U',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? 'alejandro-chataing-portfolio.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? 'alejandro-chataing-portfolio',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? 'alejandro-chataing-portfolio.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '964337073099',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? '1:964337073099:web:70476903598c5dd580544e',
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const db = getFirestore(app)
