interface Props { children: React.ReactNode }

export default function SectionTitle({ children }: Props) {
  return (
    <h2 className="text-2xl font-bold text-cyber-text mb-8 flex items-center gap-3">
      <span className="text-cyber-primary font-mono text-lg">{'>'}</span>
      {children}
      <span className="flex-1 h-px bg-cyber-border" />
    </h2>
  )
}
