/**
 * AIChatWidget — T08, T10, T11, T12, T13, T14
 *
 * Floating chat widget (bottom-right) powered by Gemini.
 * - Adaptive rate limiting (T06 algorithm)
 * - Auto-save to Firestore every 3 msgs + beforeunload (T11)
 * - Summary saved to notifications/ai_chat/items (T12)
 * - Contact button opens HireMeModal pre-filled (T13)
 * - EmailJS via template_92l57sh (T14)
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ChevronDown, User, Sparkles } from 'lucide-react'
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import { db } from '../lib/firebase'
import {
  callGeminiChat,
  getTrafficState,
  incrementSession,
  incrementMessages,
  resolveSessionLimits,
  getFingerprint,
  checkTimingAnomaly,
} from '../utils/adaptiveRateLimit'
import type { CVData } from '../types/cv'

// ─── Constants ────────────────────────────────────────────────────────────────

const SVC  = import.meta.env.VITE_EMAILJS_SERVICE_ID  ?? 'service_eeq90j4'
const TPL  = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'template_92l57sh'
const PKEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  ?? 'hwn1qzhXQfhh35cx0'

const QUICK_REPLIES = [
  'What makes Alejandro a strong Tech Lead?',
  'Tell me about mcp-code-context',
  'How does Alejandro use AI in his workflow?',
]

const MAX_RESPONSE_CHARS = 400

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant'
  text: string
  ts:   number
}

interface ContactInfo {
  name:    string
  company: string
  email:   string
  phone:   string
}

interface Props {
  cvData:        CVData
  onOpenHireMe:  (prefill: ContactInfo & { message: string }) => void
  forceOpen?:    number
  initQuestion?: string
}

// ─── System prompt builder ────────────────────────────────────────────────────

function buildSystemPrompt(cv: CVData): string {
  const exp = cv.experience
    .map((e) => `${e.role} at ${e.company} (${e.period}): ${e.bullets.slice(0, 2).join('; ')}`)
    .join('\n')

  const skills = cv.skillGroups
    .map((g) => `${g.category}: ${g.skills.map((s) => s.name).join(', ')}`)
    .join('\n')

  return `You are an AI assistant representing ${cv.name}, a ${cv.title}.
Your job is to advocate for Alejandro to potential employers visiting his portfolio.
Be enthusiastic, honest, and professional. Speak about Alejandro in third person.

KEY RULES:
- Keep every response under ${MAX_RESPONSE_CHARS} characters. Be concise and punchy.
- Never invent experience. Only use the facts below.
- If asked something outside Alejandro's profile, say "That's outside what I can speak to — but feel free to ask Alejandro directly!"
- Detect the language of the user's message and respond in the same language.
- End responses with a subtle call-to-action when appropriate (e.g. "Want to connect with him directly?")

ALEJANDRO'S PROFILE:
Name: ${cv.name}
Title: ${cv.title}
Location: ${cv.location}
Email: ${cv.email}
Summary: ${cv.summary}

EXPERIENCE:
${exp}

KEY SKILLS:
${skills}

NOTABLE PROJECT: mcp-code-context — open-source MCP server on NPM, Tree-sitter WASM AST editing for AI agents. Used in production daily.

LANGUAGES: English C2 (former teacher at Berlitz, Wall Street Institute), Spanish native.`
}

// ─── Session ID ───────────────────────────────────────────────────────────────

function genSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIChatWidget({ cvData, onOpenHireMe, forceOpen, initQuestion }: Props) {
  const [open, setOpen]           = useState(false)

  useEffect(() => {
    if (forceOpen && forceOpen > 0) {
      setOpen(true)
      if (initQuestion) setInput(initQuestion)
    }
  }, [forceOpen, initQuestion])
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [blocked, setBlocked]     = useState(false)
  const [blockMsg, setBlockMsg]   = useState('')
  const [showContact, setShowContact] = useState(false)
  const [contact, setContact]     = useState<ContactInfo>({ name: '', company: '', email: '', phone: '' })
  const [emailSent, setEmailSent] = useState(false)

  const sessionIdRef    = useRef(genSessionId())
  const limitsRef       = useRef<ReturnType<typeof resolveSessionLimits> | null>(null)
  const timestampsRef   = useRef<number[]>([])
  const savedCountRef   = useRef(0)
  const systemPromptRef = useRef(buildSystemPrompt(cvData))
  const bottomRef       = useRef<HTMLDivElement>(null)

  // ─── Init session on open ──────────────────────────────────────────────────

  useEffect(() => {
    if (!open || limitsRef.current) return
    ;(async () => {
      const state = await getTrafficState()
      limitsRef.current = resolveSessionLimits(state)
      await incrementSession()
    })()
  }, [open])

  // ─── Auto-scroll ──────────────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ─── Auto-save every 3 msgs ───────────────────────────────────────────────

  const saveToFirestore = useCallback(async (msgs: Message[], final = false) => {
    if (msgs.length < 2) return
    try {
      const summary = msgs
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'Employer' : 'AI'}: ${m.text.slice(0, 120)}`)
        .join('\n')

      await setDoc(doc(db, 'chat_sessions', sessionIdRef.current), {
        sessionId:    sessionIdRef.current,
        fingerprint:  getFingerprint(),
        messageCount: msgs.length,
        summary,
        contact:      contact.email ? contact : null,
        final,
        updatedAt:    serverTimestamp(),
      }, { merge: true })

      if (final && msgs.length >= 3) {
        await addDoc(collection(db, 'notifications', 'ai_chat', 'items'), {
          sessionId:    sessionIdRef.current,
          summary,
          messageCount: msgs.length,
          contact:      contact.email ? contact : null,
          read:         false,
          createdAt:    serverTimestamp(),
        })
      }
    } catch { /* non-critical */ }
  }, [contact])

  useEffect(() => {
    const newMsgs = messages.length
    if (newMsgs > 0 && newMsgs % 3 === 0 && newMsgs > savedCountRef.current) {
      savedCountRef.current = newMsgs
      saveToFirestore(messages)
    }
  }, [messages, saveToFirestore])

  // ─── beforeunload save ────────────────────────────────────────────────────

  useEffect(() => {
    const handler = () => { if (messages.length >= 2) saveToFirestore(messages, true) }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [messages, saveToFirestore])

  // ─── Send message ─────────────────────────────────────────────────────────

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading || blocked) return

    const limits = limitsRef.current
    const userMsgCount = messages.filter((m) => m.role === 'user').length

    // Rate limit check
    if (limits && userMsgCount >= limits.maxMsgs) {
      setBlocked(true)
      setBlockMsg(`You've reached the message limit for this session (${limits.maxMsgs} messages). Feel free to contact Alejandro directly!`)
      return
    }

    // Timing anomaly (soft — just log, no block)
    const now = Date.now()
    timestampsRef.current = [...timestampsRef.current.slice(-10), now]
    if (limits?.timingActive && checkTimingAnomaly(timestampsRef.current)) {
      // Soft throttle: add small delay
      await new Promise((r) => setTimeout(r, 1500))
    }

    const userMsg: Message = { role: 'user', text, ts: now }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      // Build conversation for Gemini (system prompt as first user turn)
      const history = [
        { role: 'user',      text: systemPromptRef.current },
        { role: 'assistant', text: `Understood. I'm ready to represent ${cvData.name} to potential employers.` },
        ...next.map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', text: m.text })),
      ]

      const raw = await callGeminiChat(history)
      // Enforce max response length
      const reply = raw.length > MAX_RESPONSE_CHARS
        ? raw.slice(0, MAX_RESPONSE_CHARS - 1) + '…'
        : raw

      const assistantMsg: Message = { role: 'assistant', text: reply, ts: Date.now() }
      const final = [...next, assistantMsg]
      setMessages(final)
      await incrementMessages(2)

      // Show contact prompt after 4+ exchanges
      if (final.filter((m) => m.role === 'user').length >= 4 && !showContact) {
        setShowContact(true)
      }
    } catch (err) {
      const errMsg: Message = {
        role: 'assistant',
        text: '__CONNECTION_ERROR__',
        ts: Date.now(),
      }
      setMessages((prev) => [...prev, errMsg])
    }
    setLoading(false)
  }, [loading, blocked, messages, cvData.name, showContact])

  // ─── Contact & Email ──────────────────────────────────────────────────────

  const handleContactSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact.email.trim()) return

    const summary = messages
      .slice(-8)
      .map((m) => `${m.role === 'user' ? 'Employer' : 'AI'}: ${m.text}`)
      .join('\n\n')

    // Save final to Firestore
    await saveToFirestore(messages, true)

    // Send email via EmailJS (same template)
    try {
      await emailjs.send(SVC, TPL, {
        from_name:       contact.name    || 'Anonymous',
        from_company:    contact.company || '—',
        reply_to:        contact.email,
        phone:           contact.phone   || '—',
        message:         `[AI Chat Contact]\n\n${summary}`,
        attachment_name: '(AI Chat — no attachment)',
        attachment_url:  '(none)',
      }, PKEY)
      setEmailSent(true)
    } catch { /* email failed — Firestore save is enough */ }

    // Open HireMeModal pre-filled
    onOpenHireMe({
      ...contact,
      message: messages.filter((m) => m.role === 'user').slice(-1)[0]?.text ?? '',
    })
  }, [contact, messages, saveToFirestore, onOpenHireMe])

  const handleClose = useCallback(() => {
    if (messages.length >= 2) saveToFirestore(messages, true)
    setOpen(false)
  }, [messages, saveToFirestore])

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-40 no-print">
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(true)}
              className="relative w-14 h-14 rounded-full bg-cyber-primary shadow-lg shadow-cyber-primary/40 flex items-center justify-center"
              aria-label="Chat with AI about Alejandro"
            >
              <img src="/AlejandroChataing.png" alt="Alejandro" className="w-12 h-12 rounded-full object-cover" />
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-cyber-bg" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-40 w-[min(420px,calc(100vw-24px))] h-[min(600px,calc(100vh-80px))] bg-cyber-surface border border-cyber-primary/40 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden no-print"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img src="/AlejandroChataing.png" alt="Alejandro" className="w-8 h-8 rounded-full object-cover border border-cyber-primary/40" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-cyber-surface" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-cyber-text">Ask about Alejandro</p>
                  <p className="text-[10px] text-green-400 flex items-center gap-1">
                    <Sparkles size={9} /> AI Assistant · Available
                  </p>
                </div>
              </div>
              <button type="button" onClick={handleClose} className="text-cyber-muted hover:text-cyber-text transition-colors">
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-cyber-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles size={11} className="text-cyber-primary" />
                    </div>
                    <div className="bg-cyber-bg border border-cyber-border rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                      <p className="text-xs text-cyber-text leading-relaxed">
                        Hi! I'm an AI assistant for <strong className="text-cyber-primary">Alejandro Chataing</strong>. Ask me anything about his experience, skills, or projects. 👋
                      </p>
                    </div>
                  </div>
                  {/* Quick replies */}
                  <div className="flex flex-col gap-1.5 pl-8">
                    {QUICK_REPLIES.map((q) => (
                      <button key={q} type="button" onClick={() => sendMessage(q)}
                        className="text-left text-xs px-3 py-1.5 bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-primary rounded-xl hover:bg-cyber-primary/20 transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    m.role === 'user' ? 'bg-cyber-secondary/20' : 'bg-cyber-primary/20'
                  }`}>
                    {m.role === 'user'
                      ? <User size={11} className="text-cyber-secondary" />
                      : <Sparkles size={11} className="text-cyber-primary" />
                    }
                  </div>
                  {m.text === '__CONNECTION_ERROR__' ? (
                    <div className="bg-cyber-bg border border-red-500/30 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%] space-y-2">
                      <p className="text-xs text-red-400">Sorry, I had trouble connecting right now.</p>
                      <div className="flex gap-2 flex-wrap">
                        <button type="button"
                          onClick={() => onOpenHireMe({ name: '', company: '', email: '', phone: '', message: '' })}
                          className="text-xs px-2.5 py-1 bg-cyber-primary/20 border border-cyber-primary/40 text-cyber-primary rounded-lg hover:bg-cyber-primary/30 transition-colors">
                          ✉ Contact Alejandro
                        </button>
                        <a href="https://wa.me/584241668876" target="_blank" rel="noreferrer"
                          className="text-xs px-2.5 py-1 bg-cyber-accent/20 border border-cyber-accent/40 text-cyber-accent rounded-lg hover:bg-cyber-accent/30 transition-colors">
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-cyber-primary/20 border border-cyber-primary/30 text-cyber-text rounded-tr-sm'
                        : 'bg-cyber-bg border border-cyber-border text-cyber-text rounded-tl-sm'
                    }`}>
                      {m.text}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-cyber-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={11} className="text-cyber-primary animate-pulse" />
                  </div>
                  <div className="bg-cyber-bg border border-cyber-border rounded-2xl rounded-tl-sm px-3 py-2">
                    <div className="flex gap-1">
                      {[0,1,2].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 bg-cyber-primary rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {blocked && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-xs text-yellow-300">
                  {blockMsg}
                </div>
              )}

              {/* Contact prompt */}
              {showContact && !emailSent && (
                <div className="bg-cyber-primary/10 border border-cyber-primary/30 rounded-xl p-3">
                  <p className="text-xs text-cyber-primary font-semibold mb-2">Want to connect with Alejandro directly?</p>
                  {!contact.email ? (
                    <form onSubmit={handleContactSubmit} className="space-y-2">
                      {(['name','company','email','phone'] as const).map((f) => (
                        <input key={f} type={f === 'email' ? 'email' : 'text'}
                          placeholder={f.charAt(0).toUpperCase() + f.slice(1) + (f === 'email' ? ' *' : '')}
                          value={contact[f]}
                          onChange={(e) => setContact((c) => ({ ...c, [f]: e.target.value }))}
                          required={f === 'email'}
                          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-2.5 py-1.5 text-xs text-cyber-text outline-none focus:border-cyber-primary/50 transition-colors"
                        />
                      ))}
                      <button type="submit"
                        className="w-full py-1.5 bg-cyber-primary text-cyber-bg text-xs font-semibold rounded-lg hover:bg-cyber-primary/90 transition-colors">
                        Send & Open Contact Form
                      </button>
                    </form>
                  ) : (
                    <p className="text-xs text-cyber-accent">✓ Contact info saved. Opening form…</p>
                  )}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {!blocked && (
              <div className="flex-shrink-0 border-t border-cyber-border p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
                    placeholder="Ask about Alejandro…"
                    disabled={loading}
                    className="flex-1 bg-cyber-bg border border-cyber-border rounded-xl px-3 py-2 text-xs text-cyber-text outline-none focus:border-cyber-primary/50 transition-colors disabled:opacity-50"
                  />
                  <button type="button" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
                    className="w-8 h-8 bg-cyber-primary rounded-xl flex items-center justify-center hover:bg-cyber-primary/90 transition-colors disabled:opacity-40 flex-shrink-0">
                    <Send size={13} className="text-cyber-bg" />
                  </button>
                </div>
                <p className="text-[10px] text-cyber-border text-center mt-1.5">
                  Powered by Gemini AI · Represents Alejandro Chataing
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
