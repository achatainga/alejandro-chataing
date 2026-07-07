import { motion } from 'framer-motion'
import { githubRepos, LANG_COLORS } from '../utils/githubRepos'
import type { Translations } from '../i18n/translations'

interface Props {
  tr: Translations
}

export default function GitHubSection({ tr }: Props) {
  return (
    <section id="github" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 no-print">
      <h2 className="text-2xl font-bold text-cyber-text mb-2 flex items-center gap-3">
        <span className="text-cyber-primary font-mono text-lg">{'>'}</span>
        {tr.githubRepos}
        <span className="flex-1 h-px bg-cyber-border" />
      </h2>
      <p className="text-cyber-muted text-sm mb-6 ml-8 flex items-center gap-2">
        <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" className="text-cyber-accent">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
        github.com/achatainga
        <a
          href="https://github.com/achatainga"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyber-primary text-xs hover:underline"
        >
          {tr.viewProfile}
        </a>
      </p>

      <div className="grid gap-4">
        {githubRepos.map((repo, i) => (
          <RepoCard key={repo.name} repo={repo} tr={tr} index={i} />
        ))}
      </div>
    </section>
  )
}

function RepoCard({ repo, tr, index }: { repo: typeof githubRepos[0]; tr: Translations; index: number }) {
  const langColor = LANG_COLORS[repo.language] ?? LANG_COLORS.default

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`bg-cyber-surface border rounded-xl p-4 flex flex-col gap-2 hover:border-cyber-primary/40 transition-colors ${
        repo.highlight ? 'border-cyber-primary/40' : 'border-cyber-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          {/* Repo icon SVG */}
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" className="text-cyber-muted flex-shrink-0">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
          </svg>
          <span className="font-semibold text-cyber-text text-sm truncate">{repo.name}</span>
          {repo.highlight && (
            <svg viewBox="0 0 16 16" width="12" height="12" fill="#f59e0b" className="flex-shrink-0">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
          )}
        </div>
        <div className="flex gap-1.5 flex-shrink-0 flex-wrap">
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-0.5 bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20 rounded hover:bg-cyber-accent/20 transition-colors"
            >
              {tr.liveDemo}
            </a>
          )}
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2 py-0.5 bg-cyber-border text-cyber-muted rounded hover:text-cyber-text transition-colors"
          >
            {tr.viewOnGitHub}
          </a>
        </div>
      </div>

      <p className="text-cyber-muted text-xs leading-relaxed flex-1">{repo.description}</p>

      <div className="flex items-center gap-3 text-xs text-cyber-muted">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: langColor }} />
          {repo.language}
        </span>
        {repo.stars > 0 && (
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            {repo.stars}
          </span>
        )}
      </div>
    </motion.div>
  )
}
