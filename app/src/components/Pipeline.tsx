export default function Pipeline() {
  const nodes = [
    {
      label: 'SOURCES',
      title: 'Salesforce · Stripe · HubSpot · Mixpanel',
      sub: '500+ connectors',
      borderColor: 'var(--border2)',
      bgColor: 'var(--surface)',
      titleColor: 'var(--muted)',
      subColor: 'var(--dim)',
      glow: false,
      badge: null,
    },
    {
      label: 'FIVETRAN',
      title: 'Move',
      sub: 'Automated schema evolution · Self-healing pipelines · Iceberg-native',
      borderColor: 'var(--orange)',
      bgColor: '#1a0800',
      titleColor: 'var(--orange)',
      subColor: '#7a4020',
      glow: false,
      badge: null,
    },
    {
      label: 'ICEBERG LAKE',
      title: 'Open Lake',
      sub: 'Apache Iceberg on S3 · One Parquet file, every engine reads it',
      borderColor: 'var(--amber)',
      bgColor: '#1a1000',
      titleColor: 'var(--amber)',
      subColor: '#7a5010',
      glow: false,
      badge: null,
    },
    {
      label: 'DBT GOLD LAYER',
      title: 'Transform',
      sub: 'dbt Wizard · dbt State · Great Expectations',
      borderColor: 'var(--purple)',
      bgColor: 'var(--purple-dim)',
      titleColor: 'var(--purple)',
      subColor: '#4a308a',
      glow: false,
      badge: null,
    },
    {
      label: 'AGENT SCHEMA',
      title: 'beacon_agents',
      sub: 'metric_definitions · model_lineage · business_glossary',
      borderColor: 'var(--cyan)',
      bgColor: 'var(--cyan-dim)',
      titleColor: 'var(--cyan)',
      subColor: 'var(--muted)',
      glow: true,
      badge: 'OPEN STANDARD',
    },
    {
      label: 'AI AGENTS',
      title: 'Every Agent',
      sub: 'RevOps · Finance · GTM · Slack bots · External apps',
      borderColor: 'var(--purple)',
      bgColor: 'var(--purple-dim)',
      titleColor: 'var(--purple)',
      subColor: '#4a308a',
      glow: false,
      badge: null,
    },
  ]

  const featureCards = [
    {
      title: 'dbt Wizard',
      color: 'var(--amber)',
      dimBg: '#1a1000',
      dimBorder: '#4a3000',
      description: 'Ask a business question, get a tested dbt model published directly to Agent Schema.',
    },
    {
      title: 'dbt State',
      color: 'var(--purple)',
      dimBg: 'var(--purple-dim)',
      dimBorder: '#2d1a5e',
      description: 'Incremental runs skip unchanged models. Schema stays fresh without burning warehouse credits.',
    },
    {
      title: 'Great Expectations',
      color: 'var(--emerald)',
      dimBg: '#042d1e',
      dimBorder: '#0a4a30',
      description: 'Data quality checks gate every metric before it publishes to Agent Schema. No stale definitions reach your agents.',
    },
  ]

  return (
    <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
          50% { box-shadow: 0 0 18px 4px rgba(6, 182, 212, 0.25); }
        }
      `}</style>

      {/* intro */}
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 12 }}>
        ODI ARCHITECTURE
      </p>
      <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--text)', marginBottom: 12, lineHeight: 1.2 }}>
        One pipeline. Context for every agent.
      </h2>
      <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 680, marginBottom: 56 }}>
        Fivetran lands data in open formats. dbt builds the gold layer. Agent Schema publishes trusted context automatically — every agent reads from the same definitions.
      </p>

      {/* pipeline diagram */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          paddingBottom: 8,
        }}
      >
        {nodes.map((node, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {/* node card */}
            <div
              style={{
                background: node.bgColor,
                border: `1px solid ${node.borderColor}`,
                borderRadius: 10,
                padding: '16px 14px',
                minWidth: 130,
                maxWidth: 160,
                position: 'relative',
                animation: node.glow ? 'pulseGlow 2.4s ease-in-out infinite' : 'none',
                flexShrink: 0,
              }}
            >
              {node.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--cyan)',
                    color: '#000',
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    padding: '2px 8px',
                    borderRadius: 99,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {node.badge}
                </span>
              )}
              <p
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: node.subColor,
                  marginBottom: 6,
                }}
              >
                {node.label}
              </p>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: node.titleColor,
                  marginBottom: 6,
                  fontFamily: node.label === 'AGENT SCHEMA' ? 'var(--font-mono)' : 'var(--font-sans)',
                }}
              >
                {node.title}
              </p>
              <p style={{ fontSize: 10, color: node.subColor, lineHeight: 1.5 }}>
                {node.sub}
              </p>
            </div>

            {/* arrow */}
            {i < nodes.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 4px',
                  flexShrink: 0,
                }}
              >
                <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                  <line x1="0" y1="8" x2="22" y2="8" stroke="var(--border2)" strokeWidth="1.5" />
                  <polyline points="18,3 24,8 18,13" stroke="var(--border2)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* feature cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginTop: 48,
        }}
      >
        {featureCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: card.dimBg,
              border: `1px solid ${card.dimBorder}`,
              borderRadius: 10,
              padding: '20px 20px',
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: card.color,
                marginBottom: 8,
              }}
            >
              {card.title}
            </p>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
