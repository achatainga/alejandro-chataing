import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Paperclip, Send, CheckCircle, AlertCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { uploadToCloudinary } from '../utils/cloudinaryUpload'
import { saveHireMeNotification, saveWhatsAppContact } from '../utils/firebaseNotifications'
import type { Translations } from '../i18n/translations'

const SVC  = import.meta.env.VITE_EMAILJS_SERVICE_ID  ?? 'service_eeq90j4'
const TPL  = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'template_92l57sh'
const PKEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  ?? 'hwn1qzhXQfhh35cxO'

const MAX_BYTES = 5 * 1024 * 1024

interface Prefill { name?: string; company?: string; email?: string; phone?: string; message?: string }
interface Props { open: boolean; onClose: () => void; tr: Translations; prefill?: Prefill }
type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function HireMeModal({ open, onClose, tr, prefill }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const [name,       setName]       = useState(prefill?.name    ?? '')
  const [company,    setCompany]    = useState(prefill?.company ?? '')
  const [email,      setEmail]      = useState(prefill?.email   ?? '')
  const [phone,      setPhone]      = useState(prefill?.phone   ?? '')
  const [message,    setMessage]    = useState(prefill?.message ?? '')
  const [fileName,   setFileName]   = useState('')
  const [fileObj,    setFileObj]    = useState<File | null>(null)
  const [status,     setStatus]     = useState<Status>('idle')
  const [errMsg,     setErrMsg]     = useState('')
  const [attachWarn, setAttachWarn] = useState('')

  // Sync prefill whenever modal opens with new data
  useEffect(() => {
    if (open && prefill) {
      if (prefill.name)    setName(prefill.name)
      if (prefill.company) setCompany(prefill.company)
      if (prefill.email)   setEmail(prefill.email)
      if (prefill.phone)   setPhone(prefill.phone)
      if (prefill.message) setMessage(prefill.message)
    }
  }, [open, prefill])

  const clearFile = useCallback(() => {
    setFileName(''); setFileObj(null)
    if (fileRef.current) fileRef.current.value = ''
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_BYTES) { setErrMsg(tr.fileTooLarge); return }
    setFileName(file.name); setFileObj(file); setErrMsg('')
  }, [tr])

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setErrMsg(tr.nameRequired); return }
    setStatus('sending'); setErrMsg(''); setAttachWarn('')

    // 1. Try attachment upload — non-blocking
    let attachmentUrl = ''
    if (fileObj) {
      try {
        attachmentUrl = await uploadToCloudinary(fileObj)
      } catch {
        setAttachWarn(tr.attachmentFailed ?? 'Attachment failed to upload — sending email without it.')
      }
    }

    try {
      // 2. Send email
      await emailjs.send(SVC, TPL, {
        from_name:       name,
        from_company:    company       || '—',
        reply_to:        email,
        phone:           phone         || '—',
        message:         message       || '(no message)',
        attachment_name: fileName      || '(none)',
        attachment_url:  attachmentUrl || '(no attachment)',
      }, PKEY)

      // 3. Save to Firestore (fire-and-forget)
      saveHireMeNotification({
        name, company, email, phone, message,
        attachmentUrl, attachmentName: fileName,
      }).catch(console.error)

      setStatus('sent')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrMsg(tr.sendFailed)
    }
  }, [name, company, email, phone, message, fileName, fileObj, tr])

  const handleWhatsApp = useCallback(() => {
    const text = encodeURIComponent(
      `Hi Alejandro! ${name ? `I'm ${name}` : ''}${company ? ` from ${company}` : ''}. ${message || "I'd like to discuss an opportunity."}`
    )
    // Save to Firestore (fire-and-forget)
    saveWhatsAppContact({ name, company, message }).catch(console.error)
    window.open(`https://wa.me/584241668876?text=${text}`, '_blank')
    onClose()
  }, [name, company, message, onClose])

  const reset = useCallback(() => {
    setName(''); setCompany(''); setEmail(''); setPhone('')
    setMessage(''); clearFile(); setStatus('idle'); setErrMsg(''); setAttachWarn('')
  }, [clearFile])

  const handleClose = useCallback(() => { reset(); onClose() }, [reset, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print"
          onMouseDown={(e) => e.target === e.currentTarget && handleClose()}
          onKeyDown={(e) => e.key === 'Escape' && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="bg-cyber-surface border border-cyber-primary/40 rounded-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-border bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10">
              <div className="flex items-center gap-3">
                <img src="/AlejandroChataing.png" alt="Alejandro" className="w-9 h-9 rounded-full object-cover border border-cyber-primary/30" />
                <div>
                  <h3 className="text-cyber-primary font-semibold text-sm">{tr.letsWorkTogether}</h3>
                  <p className="text-cyber-muted text-xs">a.chataing.a@gmail.com</p>
                </div>
              </div>
              <button type="button" onClick={handleClose} className="text-cyber-muted hover:text-cyber-text transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {status === 'sent' ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3 py-8">
                  <CheckCircle size={40} className="text-cyber-accent" />
                  <p className="text-cyber-accent font-semibold">{tr.messageSent}</p>
                  <p className="text-cyber-muted text-sm text-center">{tr.replySoon}</p>
                  {attachWarn && (
                    <p className="text-yellow-400 text-xs text-center flex items-center gap-1">
                      <AlertCircle size={12} /> {attachWarn}
                    </p>
                  )}
                  <button type="button" onClick={handleClose} className="mt-2 px-6 py-2 bg-cyber-primary text-cyber-bg text-sm font-semibold rounded-lg hover:bg-cyber-primary/90 transition-colors">
                    {tr.close}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSend} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={tr.nameLabel + ' *'} value={name}    onChange={setName}    placeholder="Jane Smith"  required />
                    <Field label={tr.companyLabel}      value={company} onChange={setCompany} placeholder="Acme Inc." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={tr.emailLabel + ' *'} value={email} onChange={setEmail} placeholder="jane@acme.com" type="email" required />
                    <Field label={tr.phoneLabel}         value={phone} onChange={setPhone} placeholder="+1 555 0100" />
                  </div>

                  <div>
                    <label className="block text-xs text-cyber-muted mb-1">{tr.messageLabel}</label>
                    <textarea
                      value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder={tr.messagePlaceholder}
                      rows={3}
                      className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-sm text-cyber-text outline-none resize-none focus:border-cyber-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-cyber-muted mb-1">
                      {tr.attachmentLabel}
                      <span className="ml-1 text-cyber-border">{tr.attachmentHint}</span>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-cyber-bg border border-cyber-border rounded-lg text-xs text-cyber-muted hover:text-cyber-primary hover:border-cyber-primary/50 transition-colors"
                      >
                        <Paperclip size={12} />
                        <span className="truncate max-w-[140px]">{fileName || tr.chooseFile}</span>
                      </button>
                      {fileName && (
                        <button type="button" onClick={clearFile} className="text-cyber-muted hover:text-red-400 transition-colors flex-shrink-0">
                          <X size={13} />
                        </button>
                      )}
                      <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" />
                    </div>
                    {fileName && <p className="text-cyber-accent text-xs mt-1">{tr.fileReady}: {fileName}</p>}
                    {attachWarn && status === 'sending' && (
                      <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {attachWarn}
                      </p>
                    )}
                  </div>

                  {errMsg && <p className="text-red-400 text-xs">{errMsg}</p>}

                  <div className="flex gap-2 pt-1">
                    <button type="submit" disabled={status === 'sending'}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyber-primary text-cyber-bg font-semibold rounded-lg hover:bg-cyber-primary/90 transition-colors text-sm disabled:opacity-60">
                      <Send size={13} />
                      {status === 'sending' ? tr.sending : tr.sendEmail}
                    </button>
                    <button type="button" onClick={handleWhatsApp}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyber-accent/20 border border-cyber-accent/40 text-cyber-accent rounded-lg hover:bg-cyber-accent/30 transition-colors text-sm">
                      <MessageSquare size={13} />
                      {tr.whatsapp}
                    </button>
                  </div>
                  <p className="text-center text-xs text-cyber-border">{tr.poweredBy}</p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs text-cyber-muted mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-sm text-cyber-text outline-none focus:border-cyber-primary/50 transition-colors" />
    </div>
  )
}
