import { motion } from 'framer-motion'
import { Briefcase, ExternalLink } from 'lucide-react'
import SectionTitle from './ui/SectionTitle'
import type { Experience } from '../types/cv'
import type { Translations } from '../i18n/translations'

interface Props {
  experience: Experience[]
  tr: Translations
}

export default function ExperienceTimeline({ experience, tr }: Props) {
  return (
    <section id="experience" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 overflow-hidden">
      <SectionTitle>{tr.experience}</SectionTitle>
      <div className="relative">
        <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-cyber-border" />
        <div className="space-y-10">
          {experience.map((exp, i) => (
            <ExperienceCard key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="relative pl-7 sm:pl-12 w-full"
    >
      {/* Dot */}
      <div className="absolute left-1 sm:left-2.5 top-1.5 w-3 h-3 rounded-full bg-cyber-primary border-2 border-cyber-bg" />

      <div className="bg-cyber-surface border border-cyber-border rounded-xl p-4 sm:p-5 hover:border-cyber-primary/40 transition-colors w-full min-w-0 overflow-hidden">
        <div className="flex flex-col xs:flex-row xs:flex-wrap xs:items-start xs:justify-between gap-1 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2 min-w-0">
              <Briefcase size={14} className="text-cyber-primary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                {exp.url ? (
                  <a href={exp.url} target="_blank" rel="noopener noreferrer"
                    className="font-semibold text-cyber-text hover:text-cyber-primary transition-colors flex items-center gap-1 break-words">
                    {exp.company} <ExternalLink size={11} className="flex-shrink-0" />
                  </a>
                ) : (
                  <span className="font-semibold text-cyber-text break-words">{exp.company}</span>
                )}
                <p className="text-cyber-primary text-sm mt-0.5 break-words">{exp.role}</p>
              </div>
            </div>
          </div>
          <div className="text-xs text-cyber-muted xs:text-right flex-shrink-0">
            <p>{exp.period}</p>
            <p>{exp.location}</p>
          </div>
        </div>

        <ul className="space-y-1 mb-3">
          {exp.bullets.map((b, j) => (
            <li key={j} className="text-cyber-muted text-sm flex gap-2 break-words min-w-0">
              <span className="text-cyber-accent mt-1 flex-shrink-0">›</span>
              <span className="break-words min-w-0">{b}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {exp.tech.map((t) => (
            <span key={t} className="px-2 py-0.5 text-xs rounded bg-cyber-border text-cyber-primary font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}


