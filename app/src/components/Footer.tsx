export default function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontVariant: 'small-caps',
            letterSpacing: '0.08em',
            color: 'var(--text)',
          }}
        >
          Agent Schema · ODI Demo
        </span>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--muted)',
          }}
        >
          Built by Jason Chletsos, Fivetran SE, with Claude Code
        </span>
      </div>

      {/* Center */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
        }}
      >
        <a
          href="https://github.com/fivetran-jasonchletsos"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--cyan)', textDecoration: 'none' }}
        >
          Fivetran Demo Repository
        </a>
        <span style={{ color: 'var(--border)' }}>|</span>
        <a
          href="https://www.getdbt.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--cyan)', textDecoration: 'none' }}
        >
          dbt Labs
        </a>
        <span style={{ color: 'var(--border)' }}>|</span>
        <a
          href="https://www.fivetran.com/blog/how-agents-schema-brings-trusted-business-context-to-ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--cyan)', textDecoration: 'none' }}
        >
          Agent Schema Blog Post
        </a>
      </div>

      {/* Right */}
      <div
        style={{
          fontSize: '11px',
          color: 'var(--muted)',
          fontStyle: 'italic',
          textAlign: 'right',
          maxWidth: '260px',
        }}
      >
        Beacon Analytics is a fictional company. All metrics are illustrative.
      </div>
    </footer>
  );
}
