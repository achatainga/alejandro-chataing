/**
 * PrintCV — Premium editorial CV, visible ONLY on print.
 * Uses zero Tailwind classes — fully self-contained inline styles.
 * Two-page A4 layout: light theme, Inter font, vector text.
 */
import type { CVData } from '../types/cv'

interface Props { data: CVData }

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  accent:   '#0369a1',
  accent2:  '#0284c7',
  text:     '#0f172a',
  sub:      '#334155',
  muted:    '#64748b',
  light:    '#e0f2fe',
  border:   '#cbd5e1',
  bg:       '#ffffff',
  bgAlt:    '#f8fafc',
  tag:      '#dbeafe',
  tagText:  '#1e40af',
  star:     '#d97706',
  barBg:    '#e2e8f0',
  barFill:  '#0369a1',
  barFill2: '#38bdf8',
  green:    '#059669',
  page:     'A4',
}

// ── Shared style helpers ───────────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    fontSize: '8.5pt',
    color: C.text,
    lineHeight: 1.45,
    background: C.bg,
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '7pt',
    fontWeight: 700,
    color: C.accent,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    borderBottom: `1.5pt solid ${C.accent}`,
    paddingBottom: '3pt',
    marginBottom: '8pt',
    marginTop: '14pt',
  } as React.CSSProperties,

  tag: {
    display: 'inline-block',
    fontSize: '6.5pt',
    fontWeight: 600,
    background: C.tag,
    color: C.tagText,
    border: `0.5pt solid #bfdbfe`,
    borderRadius: '3pt',
    padding: '1.5pt 5pt',
    marginRight: '3pt',
    marginBottom: '3pt',
  } as React.CSSProperties,
}

export default function PrintCV({ data }: Props) {
  return (
    <div id="print-cv">
      {/* ── Google Fonts link (renders in print) ── */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      />

      {/* ══════════ PAGE 1 ══════════ */}
      <div style={{ ...s.page, padding: '1.4cm 1.6cm', pageBreakAfter: 'always' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16pt', paddingBottom: '10pt', borderBottom: `2pt solid ${C.accent}`, marginBottom: '10pt' }}>
          <img
            src="/AlejandroChataing.png"
            alt="Alejandro Chataing"
            style={{ width: '62pt', height: '62pt', borderRadius: '5pt', objectFit: 'cover', flexShrink: 0, border: `1pt solid ${C.border}` }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18pt', fontWeight: 800, color: C.text, lineHeight: 1.1, marginBottom: '2pt' }}>
              {data.name}
            </div>
            <div style={{ fontSize: '10pt', fontWeight: 600, color: C.accent, marginBottom: '5pt' }}>
              {data.title}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 18pt', fontSize: '7.5pt', color: C.muted }}>
              <a href={`mailto:${data.email}`} style={{ color: C.muted, textDecoration: 'none' }}>{data.email}</a>
              <a href={`https://wa.me/${data.phone.replace(/\D/g,'')}`} style={{ color: C.muted, textDecoration: 'none' }}>{data.phone}</a>
              <span>{data.location}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 18pt', fontSize: '7.5pt', color: C.muted, marginTop: '2pt' }}>
              <a href={`https://github.com/${data.github}`} style={{ color: C.muted, textDecoration: 'none' }}>github.com/{data.github}</a>
              <a href={`https://www.linkedin.com/in/${data.linkedin}`} style={{ color: C.muted, textDecoration: 'none' }}>linkedin.com/in/{data.linkedin}</a>
              <a href="https://alejandro-chataing.vercel.app" style={{ color: C.accent, textDecoration: 'none' }}>alejandro-chataing.vercel.app</a>
              <a href="https://www.npmjs.com/package/mcp-code-context" style={{ color: C.muted, textDecoration: 'none' }}>npmjs.com/package/mcp-code-context</a>
            </div>
          </div>
        </div>

        {/* ── Summary ── */}
        <p style={{ fontSize: '8pt', color: C.sub, lineHeight: 1.6, marginBottom: '4pt' }}>
          {data.summary}
        </p>

        {/* ── Experience ── */}
        <div style={s.sectionTitle}>Experience</div>
        {data.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: '9pt', breakInside: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2pt' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {exp.url ? (
                  <a href={exp.url} style={{ fontWeight: 700, fontSize: '9pt', color: C.accent, textDecoration: 'none' }}>{exp.company}</a>
                ) : (
                  <span style={{ fontWeight: 700, fontSize: '9pt', color: C.text }}>{exp.company}</span>
                )}
                <span style={{ color: C.sub, fontSize: '8.5pt' }}> — {exp.role}</span>
              </div>
              <div style={{ fontSize: '7pt', color: C.muted, textAlign: 'right', flexShrink: 0, marginLeft: '8pt', whiteSpace: 'nowrap' }}>
                {exp.period} · {exp.location}
              </div>
            </div>
            <ul style={{ margin: '2pt 0 4pt 12pt', padding: 0 }}>
              {exp.bullets.map((b, j) => (
                <li key={j} style={{ fontSize: '7.5pt', color: C.sub, marginBottom: '1.5pt', lineHeight: 1.4 }}>{b}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {exp.tech.map((t) => <span key={t} style={s.tag}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* ══════════ PAGE 2 ══════════ */}
      <div style={{ ...s.page, padding: '1.4cm 1.6cm' }}>

        {/* ── Projects ── */}
        <div style={s.sectionTitle}>Projects &amp; Open Source</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8pt', marginBottom: '4pt' }}>
          {data.projects.slice(0, 4).map((p, i) => (
            <div key={i} style={{
              border: `0.5pt solid ${p.highlight ? C.accent : C.border}`,
              borderLeft: `3pt solid ${p.highlight ? C.accent : C.border}`,
              borderRadius: '4pt',
              padding: '6pt 8pt',
              background: p.highlight ? '#f0f9ff' : C.bgAlt,
              breakInside: 'avoid',
            }}>
              <div style={{ fontWeight: 700, fontSize: '8.5pt', color: C.text, marginBottom: '2pt' }}>
                {p.highlight && <span style={{ color: C.star, marginRight: '3pt' }}>★</span>}
                {p.name}
                {p.url && (
                  <a href={p.url} style={{ fontSize: '6.5pt', color: C.accent, fontWeight: 400, marginLeft: '4pt', textDecoration: 'none' }}>
                    {p.url.replace('https://', '')}
                  </a>
                )}
              </div>
              <p style={{ fontSize: '7pt', color: C.sub, lineHeight: 1.4, marginBottom: '4pt' }}>{p.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {p.tech.map((t) => <span key={t} style={s.tag}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* ── Skills ── */}
        <div style={s.sectionTitle}>Technical Skills</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6pt 18pt' }}>
          {data.skillGroups.map((group, i) => (
            <div key={i} style={{ breakInside: 'avoid' }}>
              <div style={{ fontSize: '7pt', fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4pt' }}>
                {group.category}
              </div>
              {group.skills.map((skill) => (
                <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: '5pt', marginBottom: '3pt' }}>
                  <span style={{ fontSize: '7.5pt', color: C.sub, width: '90pt', flexShrink: 0, overflow: 'hidden' }}>{skill.name}</span>
                  {/* SVG bar — renders perfectly in print */}
                  <svg width="80" height="5" style={{ flexShrink: 0 }}>
                    <rect x="0" y="0" width="80" height="5" rx="2.5" fill={C.barBg} />
                    <rect x="0" y="0" width={`${skill.level * 0.8}`} height="5" rx="2.5" fill={C.barFill} />
                  </svg>
                  <span style={{ fontSize: '6.5pt', color: C.muted, width: '16pt', textAlign: 'right', flexShrink: 0 }}>{skill.level}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Education + Languages ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18pt', marginTop: '4pt' }}>
          <div>
            <div style={s.sectionTitle}>Education</div>
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '5pt', breakInside: 'avoid' }}>
                <div style={{ fontWeight: 700, fontSize: '8pt', color: C.text }}>{edu.institution}</div>
                <div style={{ fontSize: '7.5pt', color: C.accent }}>{edu.degree}</div>
                <div style={{ fontSize: '7pt', color: C.muted }}>{edu.period}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={s.sectionTitle}>Languages</div>
            {data.languages.map((lang, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginBottom: '5pt' }}>
                <span style={{ fontWeight: 700, fontSize: '8pt', color: C.text, minWidth: '50pt' }}>{lang.name}</span>
                <span style={{
                  fontSize: '6.5pt', fontWeight: 700,
                  background: C.light, color: C.accent,
                  border: `0.5pt solid #bae6fd`,
                  borderRadius: '3pt', padding: '1.5pt 6pt',
                }}>{lang.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          marginTop: '16pt',
          paddingTop: '8pt',
          borderTop: `0.5pt solid ${C.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '6.5pt',
          color: C.muted,
        }}>
          <span>{data.name} · {data.email} · {data.phone}</span>
          <span style={{ color: C.accent }}>
            <a href="https://alejandro-chataing.vercel.app" style={{ color: C.accent, textDecoration: 'none' }}>
              alejandro-chataing.vercel.app
            </a>
          </span>
        </div>
      </div>

      {/* ── Print-only global reset ── */}
      <style>{`
        @media print {
          #print-cv * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #print-cv li::marker {
            color: ${C.accent};
          }
          #print-cv a {
            color: inherit;
            text-decoration: none;
          }
        }
      `}</style>
    </div>
  )
}
