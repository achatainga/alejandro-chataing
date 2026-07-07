import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface HireMePayload {
  name: string
  company: string
  email: string
  phone: string
  message: string
  attachmentUrl: string
  attachmentName: string
}

export interface WhatsAppPayload {
  name: string
  company: string
  message: string
}

const col = (name: string) => collection(db, 'notifications', name, 'items')

export async function saveHireMeNotification(payload: HireMePayload): Promise<void> {
  await addDoc(col('hire_me'), {
    ...payload,
    source: 'email_form',
    createdAt: serverTimestamp(),
    read: false,
  })
}

export async function saveWhatsAppContact(payload: WhatsAppPayload): Promise<void> {
  await addDoc(col('whatsapp'), {
    ...payload,
    source: 'whatsapp_button',
    createdAt: serverTimestamp(),
    read: false,
  })
}
