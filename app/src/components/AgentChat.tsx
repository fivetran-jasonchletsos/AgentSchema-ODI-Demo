import { useState, useEffect } from 'react'
import { AGENT_QUESTIONS } from '../data/schema'

type Question = typeof AGENT_QUESTIONS[number]
type Step = 0 | 1 | 2 | 3

function renderBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--text)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

function Spinner() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 10,
        height: 10,
        borderRadius: '50%',
        border: '2px solid var(--cyan-dim)',
        borderTopColor: 'var(--cyan)',
        animation: 'spin 0.7s linear infinite',
        marginRight: 8,
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    />
  )
}

export default function AgentChat() {
  const [selected, setSelected] = useState<Question | null>(null)
  const [step, setStep] = useState<Step>(0)

  useEffect(() => {
    if (!selected) { setStep(0); return }
    setStep(1)
    const t1 = setTimeout(() => setStep(2), 800)
    const t2 = setTimeout(() => setStep(3), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [selected])

  const handleSelect = (q: Question) => {
    if (selected?.id === q.id) return
    setSelected(null)
    setTimeout(() => setSelected(q), 20)
  }

  return (
    <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* intro */}
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 12 }}>
        LIVE AGENT DEMO
      </p>
      <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--text)', marginBottom: 12, lineHeight: 1.2 }}>
        Watch an agent check the schema first.
      </h2>
      <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 640, marginBottom: 48 }}>
        Click a question to see how any of Beacon's agents uses the Agent Schema as a trusted context layer before generating a response.
      </p>

      {/* two-column layout */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* LEFT: question selector */}
        <div style={{ flex: '0 0 38%', minWidth: 260 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
            Ask Beacon's agents
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {AGENT_QUESTIONS.map((q) => {
              const isActive = selected?.id === q.id
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelect(q)}
                  style={{
                    background: isActive ? 'var(--cyan-dim)' : 'var(--surface)',
                    border: `1px solid ${isActive ? 'var(--cyan)' : 'var(--border)'}`,
                    borderRadius: 10,
                    padding: '14px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                    outline: 'none',
                    boxShadow: isActive ? '0 0 0 1px var(--cyan)' : 'none',
                  }}
                >
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isActive ? 'var(--cyan)' : 'var(--muted)', marginBottom: 5 }}>
                    {q.agentName}
                  </p>
                  <p style={{ fontSize: 14, color: isActive ? 'var(--text)' : 'var(--text)', lineHeight: 1.4 }}>
                    {q.question}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT: response panel */}
        <div style={{ flex: '1 1 0', minWidth: 300, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, minHeight: 360 }}>
          {!selected ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 320 }}>
              <p style={{ color: 'var(--muted)', fontSize: 15 }}>
                &larr; Select a question to see the agent in action
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Step 1: schema query */}
              <div style={{ animation: 'fadeIn 0.35s ease both' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  {step < 2 && <Spinner />}
                  {step >= 2 && (
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--cyan)', marginRight: 8, flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--cyan)', letterSpacing: '0.04em' }}>
                    Querying Agent Schema...
                  </span>
                </div>
                <pre
                  style={{
                    background: '#030e1a',
                    border: '1px solid var(--dim)',
                    borderRadius: 8,
                    padding: '14px 16px',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: '#7dd3fc',
                    overflowX: 'auto',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {selected.schemaQuery}
                </pre>
              </div>

              {/* Step 2: schema result */}
              {step >= 2 && (
                <div style={{ animation: 'fadeIn 0.35s ease both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ color: 'var(--emerald)', marginRight: 8, fontSize: 14 }}>&#10003;</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--emerald)', letterSpacing: '0.04em' }}>
                      Schema result:
                    </span>
                  </div>
                  <div
                    style={{
                      background: '#03140d',
                      border: '1px solid #0a4a30',
                      borderRadius: 8,
                      padding: '14px 16px',
                    }}
                  >
                    {Object.entries(selected.schemaResult).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--emerald)', flexShrink: 0 }}>{k}:</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#a7f3d0', wordBreak: 'break-word' }}>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: agent answer */}
              {step >= 3 && (
                <div style={{ animation: 'fadeIn 0.35s ease both' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                    {selected.agentName}
                  </p>
                  <div
                    style={{
                      background: 'var(--surface2)',
                      border: '1px solid var(--border2)',
                      borderRadius: 10,
                      padding: '16px 18px',
                      fontSize: 14,
                      color: 'var(--text)',
                      lineHeight: 1.7,
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {renderBold(selected.answer)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
