import { motion } from 'framer-motion'
import { ExternalLink, Star } from 'lucide-react'
import SectionTitle from './ui/SectionTitle'
import type { Project } from '../types/cv'
import type { Translations } from '../i18n/translations'

interface Props {
  projects: Project[]
  tr: Translations
}

export default function ProjectsGrid({ projects, tr }: Props) {
  return (
    <section id="projects" className="relative z-10 max-w-4xl mx-auto px-6 py-20">
      <SectionTitle>{tr.projects}</SectionTitle>
      <div className="grid md:grid-cols-2 gap-5">
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`bg-cyber-surface border rounded-xl p-5 hover:border-cyber-primary/50 transition-colors flex flex-col ${
        project.highlight ? 'border-cyber-primary/40' : 'border-cyber-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {project.highlight && <Star size={13} className="text-cyber-warn fill-cyber-warn" />}
          <h3 className="font-semibold text-cyber-text">{project.name}</h3>
        </div>
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            className="text-cyber-muted hover:text-cyber-primary transition-colors flex-shrink-0">
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      <p className="text-cyber-muted text-sm leading-relaxed flex-1 mb-3">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span key={t} className="px-2 py-0.5 text-xs rounded bg-cyber-border text-cyber-accent font-mono">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  )
}


