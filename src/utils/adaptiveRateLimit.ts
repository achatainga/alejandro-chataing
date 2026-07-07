/**
 * Adaptive Rate Limiter + Gemini Key Rotation
 * T06 + T03
 *
 * Phase system:
 *   Phase 1 (0–99 sessions):   30 msgs/session, no fingerprint limit
 *   Phase 2 (100–499 sessions): 20 msgs/session, fingerprint limit after 200 sessions
 *   Phase 3 (500+ sessions):   15 msgs/session, full rate limiting
 *
 * All detection mechanisms have minimum sample thresholds to avoid
 * false positives during early traffic (zero-case bugs fixed).
 */

import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../lib/firebase'

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  MIN_SAMPLE_AVG:          10,
  MIN_SAMPLE_TIMING:       20,
  MIN_SAMPLE_FINGERPRINT:  50,
  AVG_FLOOR_MULTIPLIER:    0.5,
  SUSPICIOUS_MULTIPLIER:   3,
  BOT_TIMING_MS:           1500,
  BOT_TIMING_STREAK:       5,
} as const

const PHASES = [
  { maxMsgs: 30, fingerprintLimit: Infinity, minSessions: 0   },
  { maxMsgs: 20, fingerprintLimit: 5,        minSessions: 100  },
  { maxMsgs: 15, fingerprintLimit: 3,        minSessions: 500  },
] as const

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrafficState {
  totalSessions:     number
  totalMessages:     number
  launchDate:        string   // ISO date string
  lastUpdated:       number   // timestamp ms
}

export interface GeminiRotation {
  lastIndex:     number
  failedIndexes: number[]
}

export interface SessionLimits {
  maxMsgs:          number
  phase:            number
  avgFloor:         number
  timingActive:     boolean
  fingerprintActive: boolean
}

// ─── Fingerprint ──────────────────────────────────────────────────────────────

export function getFingerprint(): string {
  const raw = [
    navigator.userAgent,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    `${screen.width}x${screen.height}`,
    navigator.language,
  ].join('|')

  // Simple hash (djb2)
  let hash = 5381
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) ^ raw.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

// ─── Traffic State ────────────────────────────────────────────────────────────

const TRAFFIC_REF = () => doc(db, 'config', 'traffic_state')

export async function getTrafficState(): Promise<TrafficState> {
  try {
    const snap = await getDoc(TRAFFIC_REF())
    if (snap.exists()) return snap.data() as TrafficState

    // First ever visitor — initialize
    const initial: TrafficState = {
      totalSessions: 0,
      totalMessages: 0,
      launchDate:    new Date().toISOString().split('T')[0],
      lastUpdated:   Date.now(),
    }
    await setDoc(TRAFFIC_REF(), initial)
    return initial
  } catch {
    // Bug fix: Firestore error → default to phase 1 (most permissive)
    return { totalSessions: 0, totalMessages: 0, launchDate: new Date().toISOString().split('T')[0], lastUpdated: Date.now() }
  }
}

export async function incrementSession(): Promise<void> {
  try {
    await updateDoc(TRAFFIC_REF(), {
      totalSessions: increment(1),
      lastUpdated:   Date.now(),
    })
  } catch { /* non-critical */ }
}

export async function incrementMessages(count: number): Promise<void> {
  try {
    await updateDoc(TRAFFIC_REF(), {
      totalMessages: increment(count),
      lastUpdated:   Date.now(),
    })
  } catch { /* non-critical */ }
}

// ─── Phase Resolution ─────────────────────────────────────────────────────────

export function resolvePhase(totalSessions: number): typeof PHASES[number] & { index: number } {
  // Iterate in reverse to find highest applicable phase
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (totalSessions >= PHASES[i].minSessions) {
      return { ...PHASES[i], index: i + 1 }
    }
  }
  return { ...PHASES[0], index: 1 }
}

// ─── Session Limits (locked at session start) ─────────────────────────────────

export function resolveSessionLimits(state: TrafficState): SessionLimits {
  const { totalSessions, totalMessages } = state
  const phase = resolvePhase(totalSessions)

  // Bug fix: floor prevents zero-avg from blocking legitimate users
  const avgFloor = Math.floor(phase.maxMsgs * C.AVG_FLOOR_MULTIPLIER)

  // Avg-based detection only after MIN_SAMPLE_AVG sessions
  const avgActive = totalSessions >= C.MIN_SAMPLE_AVG

  // Compute effective avg (with floor protection)
  const rawAvg = totalSessions > 0 ? totalMessages / totalSessions : 0
  const effectiveAvg = avgActive ? Math.max(rawAvg, avgFloor) : phase.maxMsgs

  return {
    maxMsgs:           Math.min(phase.maxMsgs, Math.floor(effectiveAvg * C.SUSPICIOUS_MULTIPLIER)),
    phase:             phase.index,
    avgFloor,
    timingActive:      totalSessions >= C.MIN_SAMPLE_TIMING,
    fingerprintActive: totalSessions >= C.MIN_SAMPLE_FINGERPRINT,
  }
}

// ─── Bot Timing Detection (soft — never hard blocks) ─────────────────────────

export function checkTimingAnomaly(timestamps: number[]): boolean {
  if (timestamps.length < C.BOT_TIMING_STREAK) return false
  const recent = timestamps.slice(-C.BOT_TIMING_STREAK)
  const allFast = recent.every((t, i) =>
    i === 0 || (t - recent[i - 1]) < C.BOT_TIMING_MS
  )
  return allFast
}

// ─── Gemini Key Rotation ──────────────────────────────────────────────────────

const ROTATION_REF = () => doc(db, 'config', 'gemini_rotation')

const KEYS: string[] = (import.meta.env.VITE_GEMINI_KEYS ?? '')
  .split('|')
  .map((k: string) => k.trim())
  .filter(Boolean)

export async function getNextGeminiKey(): Promise<{ key: string; index: number } | null> {
  if (KEYS.length === 0) return null

  let rotation: GeminiRotation = { lastIndex: -1, failedIndexes: [] }

  try {
    const snap = await getDoc(ROTATION_REF())
    if (snap.exists()) rotation = snap.data() as GeminiRotation
  } catch { /* use defaults */ }

  // Find next non-failed key after lastIndex
  const total = KEYS.length
  for (let offset = 1; offset <= total; offset++) {
    const idx = (rotation.lastIndex + offset) % total
    if (!rotation.failedIndexes.includes(idx)) {
      return { key: KEYS[idx], index: idx }
    }
  }

  // All keys failed — reset failedIndexes and try from start
  const resetRotation: GeminiRotation = { lastIndex: -1, failedIndexes: [] }
  try { await setDoc(ROTATION_REF(), resetRotation) } catch { /* non-critical */ }
  return KEYS.length > 0 ? { key: KEYS[0], index: 0 } : null
}

export async function markKeySuccess(index: number): Promise<void> {
  try {
    await setDoc(ROTATION_REF(), { lastIndex: index, failedIndexes: [] }, { merge: true })
  } catch { /* non-critical */ }
}

export async function markKeyFailed(index: number): Promise<void> {
  try {
    const snap = await getDoc(ROTATION_REF())
    const current: GeminiRotation = snap.exists()
      ? snap.data() as GeminiRotation
      : { lastIndex: -1, failedIndexes: [] }

    const failedIndexes = [...new Set([...current.failedIndexes, index])]
    await setDoc(ROTATION_REF(), { ...current, failedIndexes }, { merge: true })
  } catch { /* non-critical */ }
}

// ─── Gemini Model (stored in Firestore, fallback to gemini-flash-latest) ────

const MODEL_REF = () => doc(db, 'config', 'gemini_model')
const FALLBACK_MODEL = 'gemini-flash-latest'

export async function getGeminiModel(): Promise<string> {
  try {
    const snap = await getDoc(MODEL_REF())
    if (snap.exists()) return (snap.data() as { model: string }).model ?? FALLBACK_MODEL
  } catch { /* use fallback */ }
  return FALLBACK_MODEL
}

export async function saveGeminiModel(model: string): Promise<void> {
  try {
    await setDoc(MODEL_REF(), { model }, { merge: true })
  } catch { /* non-critical */ }
}

// ─── Gemini Chat Call (with rotation) ────────────────────────────────────────

export async function callGeminiChat(messages: { role: string; text: string }[]): Promise<string> {
  const keyData = await getNextGeminiKey()
  if (!keyData) throw new Error('No Gemini keys configured')

  const model = await getGeminiModel()
  const { key, index } = keyData
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`

  const contents = messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  })

  if (!res.ok) {
    await markKeyFailed(index)
    // Retry with next key
    const next = await getNextGeminiKey()
    if (!next || next.index === index) throw new Error(`Gemini error: HTTP ${res.status}`)

    const res2 = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${next.key}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents }) }
    )
    if (!res2.ok) { await markKeyFailed(next.index); throw new Error(`Gemini error: HTTP ${res2.status}`) }
    await markKeySuccess(next.index)
    const data2 = await res2.json()
    return data2.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  }

  await markKeySuccess(index)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}
