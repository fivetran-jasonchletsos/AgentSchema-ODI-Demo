import { useState } from 'react'
import { METRICS, DBT_MODELS, SCHEMA_TABLES, MetricDef, DbtModel, SchemaTable } from '../data/schema'

type Tab = 'metrics' | 'models' | 'tables'

const CATEGORY_COLORS: Record<string, string> = {
  revenue: 'var(--emerald)',
  retention: 'var(--cyan)',
  acquisition: 'var(--purple)',
  engagement: 'var(--amber)',
}

const LAYER_COLORS: Record<string, string> = {
  staging: 'var(--amber)',
  intermediate: 'var(--purple)',
  mart: 'var(--emerald)',
  agents_schema: 'var(--cyan)',
}

function SqlHighlight({ code }: { code: string }) {
  const KEYWORDS = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|WITH|AS|AND|OR|IN|NOT|NULL|TRUE|FALSE|ROUND|COUNT|SUM|MAX|AVG|DISTINCT|NULLIF|DATE_TRUNC|DATEADD|CURRENT_DATE|ON|LEFT|JOIN|INNER|IS|BY|HAVING|LIMIT|CASE|WHEN|THEN|ELSE|END)\b/g
  const STRINGS = /'[^']*'/g
  const COMMENTS = /--[^\n]*/g
  const NUMBERS = /\b\d+(\.\d+)?\b/g

  const lines = code.split('\n')

  return (
    <pre
      style={{
        margin: 0,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.35)',
        borderRadius: 6,
        border: '1px solid var(--border)',
        fontSize: 12,
        lineHeight: 1.65,
        overflowX: 'auto',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {lines.map((line, li) => {
        // Tokenise the line
        type Tok = { text: string; kind: 'keyword' | 'string' | 'comment' | 'number' | 'plain' }
        const toks: Tok[] = []

        // Mark comment lines wholesale
        const trimmed = line.trimStart()
        if (trimmed.startsWith('--')) {
          toks.push({ text: line, kind: 'comment' })
        } else {
          // Manually walk the string to find strings first, then keywords/numbers
          let remaining = line
          while (remaining.length > 0) {
            const strMatch = STRINGS.exec(remaining)
            const kwMatch = KEYWORDS.exec(remaining)
            const numMatch = NUMBERS.exec(remaining)

            // Reset regex lastIndex since we recreate on every loop
            STRINGS.lastIndex = 0
            KEYWORDS.lastIndex = 0
            NUMBERS.lastIndex = 0

            const candidates: Array<{ idx: number; len: number; kind: Tok['kind'] }> = []
            if (strMatch) candidates.push({ idx: strMatch.index, len: strMatch[0].length, kind: 'string' })
            if (kwMatch) candidates.push({ idx: kwMatch.index, len: kwMatch[0].length, kind: 'keyword' })
            if (numMatch) candidates.push({ idx: numMatch.index, len: numMatch[0].length, kind: 'number' })

            if (candidates.length === 0) {
              toks.push({ text: remaining, kind: 'plain' })
              break
            }

            // Pick earliest match
            candidates.sort((a, b) => a.idx - b.idx)
            const first = candidates[0]

            if (first.idx > 0) {
              toks.push({ text: remaining.slice(0, first.idx), kind: 'plain' })
            }
            toks.push({ text: remaining.slice(first.idx, first.idx + first.len), kind: first.kind })
            remaining = remaining.slice(first.idx + first.len)
          }
        }

        const kindStyle = (k: Tok['kind']): React.CSSProperties => {
          if (k === 'keyword') return { color: 'var(--cyan)', fontWeight: 600 }
          if (k === 'string') return { color: 'var(--amber)' }
          if (k === 'comment') return { color: 'var(--muted)', fontStyle: 'italic' }
          if (k === 'number') return { color: 'var(--purple)' }
          return { color: 'var(--text)' }
        }

        return (
          <span key={li}>
            {toks.map((t, ti) => (
              <span key={ti} style={kindStyle(t.kind)}>{t.text}</span>
            ))}
            {li < lines.length - 1 ? '\n' : ''}
          </span>
        )
      })}
    </pre>
  )
}

function MetaRow({ pairs }: { pairs: Array<{ label: string; value: string }> }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0 24px',
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '10px 16px',
      }}
    >
      {pairs.map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {label}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}

function TagPill({ label, color }: { label: string; color?: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: color ?? 'var(--muted)',
        background: color ? `${color}18` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${color ? `${color}40` : 'var(--border)'}`,
        borderRadius: 4,
        padding: '2px 8px',
      }}
    >
      {label}
    </span>
  )
}

function ColTable({ columns }: { columns: { name: string; type: string; description: string }[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
          {['Column', 'Type', 'Description'].map((h) => (
            <th
              key={h}
              style={{
                textAlign: 'left',
                padding: '7px 12px',
                color: 'var(--muted)',
                fontWeight: 600,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {columns.map((col, i) => (
          <tr key={col.name} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
            <td
              style={{
                padding: '7px 12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--cyan)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                whiteSpace: 'nowrap',
              }}
            >
              {col.name}
            </td>
            <td
              style={{
                padding: '7px 12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--amber)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                whiteSpace: 'nowrap',
                fontSize: 11,
              }}
            >
              {col.type}
            </td>
            <td
              style={{
                padding: '7px 12px',
                color: 'var(--dim)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {col.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--muted)',
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  )
}

function LineageList({ label, items, arrow }: { label: string; items: string[]; arrow: string }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.length === 0 ? (
          <span style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>none</span>
        ) : (
          items.map((m) => (
            <div
              key={m}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text)',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                borderRadius: 5,
                padding: '5px 10px',
              }}
            >
              <span style={{ color: 'var(--muted)' }}>{arrow}</span>
              <span>{m}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function MetricDetail({ metric }: { metric: MetricDef }) {
  const catColor = CATEGORY_COLORS[metric.category] ?? 'var(--muted)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {metric.label}
        </h2>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: catColor,
            background: `${catColor}18`,
            border: `1px solid ${catColor}40`,
            borderRadius: 4,
            padding: '3px 9px',
          }}
        >
          {metric.category}
        </span>
      </div>

      {/* Definition */}
      <div>
        <SectionLabel>Definition</SectionLabel>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--dim)', lineHeight: 1.7 }}>
          {metric.definition}
        </p>
      </div>

      {/* Formula */}
      <div>
        <SectionLabel>Formula</SectionLabel>
        <pre
          style={{
            margin: 0,
            padding: '10px 14px',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--emerald)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {metric.formula}
        </pre>
      </div>

      {/* SQL Reference */}
      <div>
        <SectionLabel>SQL Reference</SectionLabel>
        <SqlHighlight code={metric.sqlSnippet} />
      </div>

      {/* Metadata */}
      <div>
        <SectionLabel>Metadata</SectionLabel>
        <MetaRow
          pairs={[
            { label: 'Source Model', value: metric.sourceModel },
            { label: 'Owner', value: metric.owner },
            { label: 'Team', value: metric.ownerTeam },
            { label: 'Refresh', value: metric.refreshCadence },
            { label: 'Last Updated', value: metric.lastUpdated },
          ]}
        />
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {metric.tags.map((t) => (
          <TagPill key={t} label={t} />
        ))}
      </div>
    </div>
  )
}

function ModelDetail({ model }: { model: DbtModel }) {
  const layerColor = LAYER_COLORS[model.layer] ?? 'var(--muted)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {model.name}
        </h2>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: layerColor,
            background: `${layerColor}18`,
            border: `1px solid ${layerColor}40`,
            borderRadius: 4,
            padding: '3px 9px',
          }}
        >
          {model.layer}
        </span>
      </div>

      {model.source && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Source
          </span>
          <span
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--cyan)',
              background: 'var(--cyan-dim)',
              border: '1px solid rgba(var(--cyan-rgb, 0,210,210),0.25)',
              borderRadius: 4,
              padding: '2px 8px',
            }}
          >
            {model.source}
          </span>
        </div>
      )}

      {/* Description */}
      <div>
        <SectionLabel>Description</SectionLabel>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--dim)', lineHeight: 1.7 }}>
          {model.description}
        </p>
      </div>

      {/* Columns */}
      <div>
        <SectionLabel>Columns</SectionLabel>
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <ColTable columns={model.columns} />
        </div>
      </div>

      {/* Lineage */}
      <div>
        <SectionLabel>Lineage</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <LineageList label="Upstream" items={model.upstreamModels} arrow="←" />
          <LineageList label="Downstream" items={model.downstreamModels} arrow="→" />
        </div>
      </div>

      {/* Metadata */}
      <div>
        <SectionLabel>Metadata</SectionLabel>
        <MetaRow
          pairs={[
            { label: 'Freshness', value: model.freshness },
            { label: 'Owner', value: model.owner },
          ]}
        />
      </div>
    </div>
  )
}

function TableDetail({ table }: { table: SchemaTable }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
        <h2
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 700,
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {table.tableName}
        </h2>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--cyan)',
            background: 'var(--cyan-dim)',
            border: '1px solid rgba(0,210,210,0.25)',
            borderRadius: 4,
            padding: '3px 8px',
          }}
        >
          Agent Schema
        </span>
      </div>

      {/* Description */}
      <div>
        <SectionLabel>Description</SectionLabel>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--dim)', lineHeight: 1.7 }}>
          {table.description}
        </p>
      </div>

      {/* Columns */}
      <div>
        <SectionLabel>Columns</SectionLabel>
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <ColTable columns={table.columns} />
        </div>
      </div>

      {/* Metadata */}
      <div>
        <SectionLabel>Metadata</SectionLabel>
        <MetaRow
          pairs={[
            { label: 'Row Count', value: table.rowCount.toLocaleString() },
            { label: 'Last Sync', value: table.lastSync },
          ]}
        />
      </div>

      {/* Auto-publish note */}
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: 'var(--cyan)',
          fontStyle: 'italic',
          lineHeight: 1.6,
        }}
      >
        This table is published automatically via GitHub Actions whenever dbt models or metric definitions change.
      </p>
    </div>
  )
}

export function SchemaExplorer() {
  const [activeTab, setActiveTab] = useState<Tab>('metrics')
  const [selectedId, setSelectedId] = useState<string>('mrr')

  // Resolve the selected item
  const selectedMetric = activeTab === 'metrics' ? METRICS.find((m) => m.id === selectedId) : undefined
  const selectedModel = activeTab === 'models' ? DBT_MODELS.find((m) => m.id === selectedId) : undefined
  const selectedTable = activeTab === 'tables' ? SCHEMA_TABLES.find((t) => t.id === selectedId) : undefined

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    if (tab === 'metrics') setSelectedId(METRICS[0].id)
    else if (tab === 'models') setSelectedId(DBT_MODELS[0].id)
    else setSelectedId(SCHEMA_TABLES[0].id)
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'metrics', label: 'Metrics' },
    { id: 'models', label: 'Models' },
    { id: 'tables', label: 'Tables' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        minHeight: 560,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface2)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
          beacon_agents
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--emerald)',
            background: 'rgba(var(--emerald-rgb,16,185,129),0.12)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 3,
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--emerald)',
              display: 'inline-block',
            }}
          />
          LIVE
        </span>
      </div>

      {/* Body: sidebar + main */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div
          style={{
            width: 280,
            minWidth: 280,
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface2)',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--cyan)' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  color: activeTab === tab.id ? 'var(--cyan)' : 'var(--muted)',
                  transition: 'color 0.15s, border-color 0.15s',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Item list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'metrics' &&
              METRICS.map((metric) => {
                const selected = selectedId === metric.id
                const catColor = CATEGORY_COLORS[metric.category] ?? 'var(--muted)'
                return (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedId(metric.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '9px 14px 9px 12px',
                      background: selected ? 'rgba(0,210,210,0.06)' : 'transparent',
                      borderLeft: selected ? '2px solid var(--cyan)' : '2px solid transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: catColor,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        color: selected ? 'var(--cyan)' : 'var(--text)',
                        fontWeight: selected ? 600 : 400,
                      }}
                    >
                      {metric.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: 'var(--muted)',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border)',
                        borderRadius: 3,
                        padding: '1px 5px',
                        fontFamily: 'var(--font-sans)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {metric.ownerTeam}
                    </span>
                  </button>
                )
              })}

            {activeTab === 'models' &&
              DBT_MODELS.map((model) => {
                const selected = selectedId === model.id
                const layerColor = LAYER_COLORS[model.layer] ?? 'var(--muted)'
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedId(model.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '9px 14px 9px 12px',
                      background: selected ? 'rgba(0,210,210,0.06)' : 'transparent',
                      borderLeft: selected ? '2px solid var(--cyan)' : '2px solid transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: layerColor,
                        background: `${layerColor}18`,
                        border: `1px solid ${layerColor}40`,
                        borderRadius: 3,
                        padding: '1px 5px',
                        flexShrink: 0,
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {model.layer}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        color: selected ? 'var(--cyan)' : 'var(--text)',
                        fontWeight: selected ? 600 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {model.name}
                    </span>
                  </button>
                )
              })}

            {activeTab === 'tables' &&
              SCHEMA_TABLES.map((table) => {
                const selected = selectedId === table.id
                const shortName = table.tableName.split('.').pop() ?? table.tableName
                return (
                  <button
                    key={table.id}
                    onClick={() => setSelectedId(table.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '9px 14px 9px 12px',
                      background: selected ? 'rgba(0,210,210,0.06)' : 'transparent',
                      borderLeft: selected ? '2px solid var(--cyan)' : '2px solid transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {/* Table icon */}
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      style={{ flexShrink: 0, opacity: 0.6 }}
                    >
                      <rect x="0.5" y="0.5" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1" />
                      <line x1="0.5" y1="4.5" x2="12.5" y2="4.5" stroke="currentColor" strokeWidth="1" />
                      <line x1="4.5" y1="4.5" x2="4.5" y2="12.5" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        color: selected ? 'var(--cyan)' : 'var(--text)',
                        fontWeight: selected ? 600 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {shortName}
                    </span>
                  </button>
                )
              })}
          </div>
        </div>

        {/* Main panel */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
          }}
        >
          {selectedMetric && <MetricDetail metric={selectedMetric} />}
          {selectedModel && <ModelDetail model={selectedModel} />}
          {selectedTable && <TableDetail table={selectedTable} />}
          {!selectedMetric && !selectedModel && !selectedTable && (
            <p style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: 13 }}>
              Select an item from the sidebar to view details.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
