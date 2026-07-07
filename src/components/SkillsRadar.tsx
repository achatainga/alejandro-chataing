import { motion } from 'framer-motion'
import SectionTitle from './ui/SectionTitle'
import type { SkillGroup } from '../types/cv'
import type { Translations } from '../i18n/translations'

interface Props {
  skillGroups: SkillGroup[]
  tr: Translations
}

export default function SkillsRadar({ skillGroups, tr }: Props) {
  return (
    <section id="skills" className="relative z-10 max-w-4xl mx-auto px-6 py-20">
      <SectionTitle>{tr.skills}</SectionTitle>
      <div className="grid md:grid-cols-2 gap-6">
        {skillGroups.map((group, i) => (
          <SkillGroupCard key={i} group={group} groupIndex={i} />
        ))}
      </div>
    </section>
  )
}

function SkillGroupCard({ group, groupIndex }: { group: SkillGroup; groupIndex: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: groupIndex * 0.1, duration: 0.5 }}
      className="bg-cyber-surface border border-cyber-border rounded-xl p-5"
    >
      <h3 className="text-cyber-primary font-mono text-sm font-semibold mb-4 uppercase tracking-wider">
        {group.category}
      </h3>
      <div className="space-y-3">
        {group.skills.map((skill, j) => (
          <SkillBar key={j} name={skill.name} level={skill.level} delay={groupIndex * 0.1 + j * 0.05} />
        ))}
      </div>
    </motion.div>
  )
}

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-cyber-text">{name}</span>
        <span className="text-cyber-muted font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-cyber-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary skill-bar-fill rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ delay, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}


