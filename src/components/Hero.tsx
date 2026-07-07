import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Phone, MapPin, Download, ExternalLink } from 'lucide-react'
import { useParallax } from '../hooks/useParallax'
import type { CVData } from '../types/cv'
import type { Translations } from '../i18n/translations'
import confetti from 'canvas-confetti'

interface Props {
  data: CVData
  onLogoClick: () => void
  tr: Translations
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
}

const handleDownloadPDF = () => {
  confetti({ particleCount: 100, spread: 80, origin: { y: 0.4 }, colors: ['#00d4ff', '#7c3aed', '#10b981'] })
  setTimeout(() => window.print(), 500)
}

export default function Hero({ data, onLogoClick, tr }: Props) {
  const offsetY = useParallax(0.3)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 pb-10"
      style={{ transform: `translateY(${offsetY * 0.12}px)` }}
    >
      <div className="no-print relative z-10 w-full max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

          {/* Photo */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="flex-shrink-0 cursor-pointer self-center sm:self-start sm:mt-2"
            onClick={onLogoClick}
            title="Click 5× to open Admin Panel"
          >
            <div className="relative w-32 h-32 sm:w-44 sm:h-44">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyber-primary/30 to-cyber-secondary/30 blur-xl" />
              <img
                src="/AlejandroChataing.png"
                alt="Alejandro Chataing"
                className="relative w-full h-full object-cover rounded-2xl border-2 border-cyber-primary/40 hover:border-cyber-primary transition-colors"
              />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-cyber-accent rounded-full border-2 border-cyber-bg" />
            </div>
          </motion.div>

          {/* Info — always left-aligned */}
          <div className="flex-1 min-w-0 text-left w-full">
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
              <span className="inline-block text-xs font-mono text-cyber-accent bg-cyber-accent/10 border border-cyber-accent/20 px-3 py-1 rounded-full mb-3">
                {tr.available}
              </span>
            </motion.div>

            <motion.h1
              custom={2} variants={fadeUp} initial="hidden" animate="show"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-text mb-2 leading-tight"
            >
              {data.name}
            </motion.h1>

            <motion.p
              custom={3} variants={fadeUp} initial="hidden" animate="show"
              className="text-base sm:text-lg md:text-xl text-cyber-primary font-mono mb-4"
            >
              {data.title}
            </motion.p>

            <motion.p
              custom={4} variants={fadeUp} initial="hidden" animate="show"
              className="text-cyber-muted leading-relaxed mb-5 text-sm sm:text-base"
            >
              {data.summary}
            </motion.p>

            {/* Contact links */}
            <motion.div
              custom={5} variants={fadeUp} initial="hidden" animate="show"
              className="flex flex-wrap gap-x-4 gap-y-2 mb-5 text-sm"
            >
              <ContactLink href={`mailto:${data.email}`}                          icon={<Mail size={13} />}     label={data.email} />
              <ContactLink href={`https://wa.me/${data.phone.replace(/\D/g, '')}`} icon={<Phone size={13} />}    label={data.phone} />
              <ContactLink href={`https://github.com/${data.github}`}              icon={<Github size={13} />}   label={`@${data.github}`} />
              <ContactLink href={`https://www.linkedin.com/in/${data.linkedin}`}   icon={<Linkedin size={13} />} label="LinkedIn" />
              <span className="flex items-center gap-1.5 text-cyber-muted">
                <MapPin size={13} className="text-cyber-accent flex-shrink-0" />
                {data.location}
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              custom={6} variants={fadeUp} initial="hidden" animate="show"
              className="flex flex-wrap gap-3"
            >
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyber-primary text-cyber-bg font-semibold rounded-lg hover:bg-cyber-primary/90 transition-colors text-sm"
              >
                <Download size={14} />
                {tr.downloadPDF}
              </button>
              <a
                href="https://www.npmjs.com/package/mcp-code-context"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-cyber-primary/40 text-cyber-primary rounded-lg hover:border-cyber-primary transition-colors text-sm"
              >
                <ExternalLink size={14} />
                mcp-code-context
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-cyber-muted hover:text-cyber-primary transition-colors min-w-0"
    >
      <span className="text-cyber-accent flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </a>
  )
}
