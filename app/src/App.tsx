import Hero from './components/Hero'
import ProblemSection from './components/ProblemSection'
import { SchemaExplorer } from './components/SchemaExplorer'
import AgentChat from './components/AgentChat'
import Pipeline from './components/Pipeline'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Hero />
      <ProblemSection />

      <section id="schema-explorer" style={{ padding: '96px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 16 }}>
            AGENT SCHEMA EXPLORER
          </p>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--text)', marginBottom: 14 }}>
            Browse the schema. Every agent reads from here.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 560, marginBottom: 40 }}>
            Metric definitions, dbt model lineage, and business glossary — all in one queryable schema. Published automatically whenever definitions change.
          </p>
          <SchemaExplorer />
        </div>
      </section>

      <section id="agent-demo" style={{ padding: '96px 0', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <AgentChat />
        </div>
      </section>

      <Pipeline />
      <Footer />
    </>
  )
}
