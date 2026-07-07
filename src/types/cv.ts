export interface Experience {
  company: string
  role: string
  period: string
  location: string
  bullets: string[]
  tech: string[]
  url?: string
}

export interface Project {
  name: string
  description: string
  tech: string[]
  url?: string
  highlight?: boolean
}

export interface SkillGroup {
  category: string
  skills: Skill[]
}

export interface Skill {
  name: string
  level: number // 0-100
}

export interface Language {
  name: string
  level: string
  detail?: string
}

export interface CVData {
  name: string
  title: string
  summary: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  experience: Experience[]
  projects: Project[]
  skillGroups: SkillGroup[]
  languages: Language[]
  education: Education[]
}

export interface Education {
  institution: string
  degree: string
  period: string
  details?: string[]
}
