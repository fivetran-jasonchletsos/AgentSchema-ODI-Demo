export type MetricDef = {
  id: string
  name: string
  label: string
  category: 'revenue' | 'retention' | 'acquisition' | 'engagement'
  definition: string
  formula: string
  sqlSnippet: string
  sourceModel: string
  owner: string
  ownerTeam: string
  refreshCadence: string
  lastUpdated: string
  tags: string[]
}

export type DbtModel = {
  id: string
  name: string
  layer: 'staging' | 'intermediate' | 'mart' | 'agents_schema'
  source?: string
  description: string
  columns: { name: string; type: string; description: string }[]
  downstreamModels: string[]
  upstreamModels: string[]
  freshness: string
  owner: string
}

export type SchemaTable = {
  id: string
  tableName: string
  description: string
  rowCount: number
  columns: { name: string; type: string; description: string }[]
  lastSync: string
}

export const METRICS: MetricDef[] = [
  {
    id: 'mrr',
    name: 'mrr',
    label: 'Monthly Recurring Revenue',
    category: 'revenue',
    definition:
      'The predictable revenue Beacon generates each month from active subscriptions. Counts only contracts billed monthly or normalized monthly equivalents of annual contracts. Excludes one-time fees, professional services, and trials.',
    formula: 'SUM(normalized_monthly_amount) WHERE subscription_status = \'active\' AND contract_type IN (\'monthly\', \'annual\')',
    sqlSnippet: `SELECT
  DATE_TRUNC('month', period_date) AS month,
  SUM(normalized_monthly_amount)   AS mrr
FROM beacon_gold.fct_mrr_movements
WHERE subscription_status = 'active'
GROUP BY 1
ORDER BY 1 DESC`,
    sourceModel: 'fct_mrr_movements',
    owner: 'Maya Chen',
    ownerTeam: 'RevOps',
    refreshCadence: 'Daily at 06:00 ET',
    lastUpdated: '2026-06-28',
    tags: ['revenue', 'core-kpi', 'board-metric'],
  },
  {
    id: 'arr',
    name: 'arr',
    label: 'Annual Recurring Revenue',
    category: 'revenue',
    definition:
      'MRR multiplied by 12. Represents the annualized value of all active subscription revenue. Use ARR for investor reporting and annual planning. Do not add one-time revenue to ARR.',
    formula: 'MRR * 12',
    sqlSnippet: `SELECT
  month,
  mrr,
  mrr * 12 AS arr
FROM beacon_gold.agg_revenue_metrics
ORDER BY month DESC`,
    sourceModel: 'agg_revenue_metrics',
    owner: 'Maya Chen',
    ownerTeam: 'RevOps',
    refreshCadence: 'Daily at 06:00 ET',
    lastUpdated: '2026-06-28',
    tags: ['revenue', 'core-kpi', 'investor-metric'],
  },
  {
    id: 'nrr',
    name: 'nrr',
    label: 'Net Revenue Retention',
    category: 'retention',
    definition:
      'Measures revenue retained from existing customers including expansion, contraction, and churn. NRR > 100% means expansion revenue exceeds churn. The Finance team owns the denominator definition: starting MRR is measured on the first day of the period.',
    formula: '(starting_mrr + expansion_mrr - contraction_mrr - churned_mrr) / starting_mrr',
    sqlSnippet: `SELECT
  cohort_month,
  ROUND(
    100.0 * (starting_mrr + expansion_mrr - contraction_mrr - churned_mrr)
    / NULLIF(starting_mrr, 0),
    1
  ) AS nrr_pct
FROM beacon_gold.fct_mrr_movements
WHERE movement_type IN ('starting', 'expansion', 'contraction', 'churn')
GROUP BY cohort_month`,
    sourceModel: 'fct_mrr_movements',
    owner: 'Daniel Park',
    ownerTeam: 'Finance',
    refreshCadence: 'Monthly on the 1st',
    lastUpdated: '2026-06-01',
    tags: ['retention', 'core-kpi', 'board-metric'],
  },
  {
    id: 'churn_rate',
    name: 'churn_rate',
    label: 'Gross Revenue Churn Rate',
    category: 'retention',
    definition:
      'Percentage of MRR lost from existing customers in a given month due to cancellations and downgrades. Excludes expansion from other customers. A customer is considered churned if their subscription_status transitions to "cancelled" or "expired" and is not reinstated within 30 days.',
    formula: 'churned_mrr / starting_mrr_of_period',
    sqlSnippet: `SELECT
  DATE_TRUNC('month', churn_date) AS month,
  ROUND(100.0 * SUM(churned_mrr) / MAX(starting_mrr), 2) AS gross_churn_pct
FROM beacon_gold.fct_mrr_movements
WHERE movement_type = 'churn'
GROUP BY 1`,
    sourceModel: 'fct_mrr_movements',
    owner: 'Daniel Park',
    ownerTeam: 'Finance',
    refreshCadence: 'Daily at 06:00 ET',
    lastUpdated: '2026-06-15',
    tags: ['retention', 'core-kpi'],
  },
  {
    id: 'cac',
    name: 'cac',
    label: 'Customer Acquisition Cost',
    category: 'acquisition',
    definition:
      'Total sales and marketing spend divided by new logos acquired in the same period. GTM team uses a 90-day attribution window. Includes SDR salaries, AE commissions, marketing program spend, and allocated overhead. Excludes CS onboarding costs.',
    formula: 'total_s_and_m_spend / new_customers_acquired',
    sqlSnippet: `SELECT
  quarter,
  SUM(s_and_m_spend) AS total_spend,
  COUNT(DISTINCT customer_id) AS new_customers,
  ROUND(SUM(s_and_m_spend) / NULLIF(COUNT(DISTINCT customer_id), 0), 0) AS cac
FROM beacon_gold.fct_gtm_metrics
WHERE is_new_logo = TRUE
GROUP BY 1`,
    sourceModel: 'fct_gtm_metrics',
    owner: 'Priya Anand',
    ownerTeam: 'GTM Analytics',
    refreshCadence: 'Monthly on the 1st',
    lastUpdated: '2026-06-01',
    tags: ['acquisition', 'efficiency'],
  },
  {
    id: 'ltv',
    name: 'ltv',
    label: 'Customer Lifetime Value',
    category: 'acquisition',
    definition:
      'Expected total revenue from a customer over their full relationship with Beacon. Calculated as average monthly revenue per customer divided by monthly churn rate. Use the rolling 12-month churn rate for stability. LTV:CAC ratio should exceed 3:1 for healthy unit economics.',
    formula: 'avg_monthly_revenue_per_customer / monthly_churn_rate',
    sqlSnippet: `WITH base AS (
  SELECT
    AVG(monthly_mrr) AS avg_mrr,
    AVG(monthly_churn_pct / 100.0) AS avg_churn
  FROM beacon_gold.agg_revenue_metrics
  WHERE month >= DATEADD('month', -12, CURRENT_DATE)
)
SELECT
  ROUND(avg_mrr / NULLIF(avg_churn, 0), 0) AS ltv
FROM base`,
    sourceModel: 'agg_revenue_metrics',
    owner: 'Daniel Park',
    ownerTeam: 'Finance',
    refreshCadence: 'Monthly on the 1st',
    lastUpdated: '2026-06-01',
    tags: ['acquisition', 'efficiency', 'board-metric'],
  },
]

export const DBT_MODELS: DbtModel[] = [
  {
    id: 'stg_stripe_subscriptions',
    name: 'stg_stripe_subscriptions',
    layer: 'staging',
    source: 'Stripe (via Fivetran)',
    description: 'Cleaned and typed Stripe subscription events. Normalizes plan names, maps currencies to USD, and coalesces null trial fields.',
    columns: [
      { name: 'subscription_id', type: 'VARCHAR', description: 'Stripe subscription ID' },
      { name: 'customer_id', type: 'VARCHAR', description: 'Stripe customer ID (FK to stg_stripe_customers)' },
      { name: 'plan_id', type: 'VARCHAR', description: 'Normalized plan identifier' },
      { name: 'normalized_monthly_amount', type: 'NUMERIC', description: 'Monthly revenue in USD regardless of billing cadence' },
      { name: 'subscription_status', type: 'VARCHAR', description: 'active | cancelled | trialing | past_due' },
    ],
    downstreamModels: ['fct_mrr_movements', 'fct_subscriptions'],
    upstreamModels: [],
    freshness: '< 6 hours',
    owner: 'Data Engineering',
  },
  {
    id: 'stg_salesforce_accounts',
    name: 'stg_salesforce_accounts',
    layer: 'staging',
    source: 'Salesforce (via Fivetran)',
    description: 'Cleaned Salesforce Account records with standardized industry codes, ARR band bucketing, and deduplication of merged accounts.',
    columns: [
      { name: 'account_id', type: 'VARCHAR', description: 'Salesforce account ID' },
      { name: 'account_name', type: 'VARCHAR', description: 'Legal company name' },
      { name: 'industry_code', type: 'VARCHAR', description: 'Standardized 3-letter industry code' },
      { name: 'arr_band', type: 'VARCHAR', description: 'ARR bucket: SMB / MM / ENT' },
      { name: 'csm_owner_id', type: 'VARCHAR', description: 'Assigned CSM Salesforce user ID' },
    ],
    downstreamModels: ['fct_customers', 'fct_gtm_metrics'],
    upstreamModels: [],
    freshness: '< 6 hours',
    owner: 'Data Engineering',
  },
  {
    id: 'fct_mrr_movements',
    name: 'fct_mrr_movements',
    layer: 'mart',
    description: 'One row per subscription per month per movement type. Captures new business, expansion, contraction, churn, and reactivation as separate events. The canonical source for all MRR-based metrics.',
    columns: [
      { name: 'period_date', type: 'DATE', description: 'First day of the measurement month' },
      { name: 'subscription_id', type: 'VARCHAR', description: 'Stripe subscription ID' },
      { name: 'customer_id', type: 'VARCHAR', description: 'Internal customer ID' },
      { name: 'movement_type', type: 'VARCHAR', description: 'new | expansion | contraction | churn | reactivation' },
      { name: 'normalized_monthly_amount', type: 'NUMERIC', description: 'Change in MRR for this movement (negative for churn/contraction)' },
    ],
    downstreamModels: ['agg_revenue_metrics', 'beacon_agents.metric_definitions'],
    upstreamModels: ['stg_stripe_subscriptions', 'stg_salesforce_accounts'],
    freshness: '< 24 hours',
    owner: 'RevOps Analytics',
  },
  {
    id: 'agg_revenue_metrics',
    name: 'agg_revenue_metrics',
    layer: 'mart',
    description: 'Monthly aggregate revenue snapshot. One row per month. Source of truth for dashboards, board reporting, and agent queries.',
    columns: [
      { name: 'month', type: 'DATE', description: 'First day of the month' },
      { name: 'mrr', type: 'NUMERIC', description: 'Total active MRR' },
      { name: 'arr', type: 'NUMERIC', description: 'MRR * 12' },
      { name: 'new_mrr', type: 'NUMERIC', description: 'MRR from new logos this month' },
      { name: 'expansion_mrr', type: 'NUMERIC', description: 'MRR from upsells and plan upgrades' },
      { name: 'churned_mrr', type: 'NUMERIC', description: 'MRR lost to cancellations' },
      { name: 'nrr_pct', type: 'NUMERIC', description: 'Net Revenue Retention as a percentage' },
    ],
    downstreamModels: ['beacon_agents.metric_definitions'],
    upstreamModels: ['fct_mrr_movements'],
    freshness: '< 24 hours',
    owner: 'RevOps Analytics',
  },
]

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    id: 'metric_definitions',
    tableName: 'beacon_agents.metric_definitions',
    description: 'Canonical definitions for every company metric. Agents query this before computing anything. Updated automatically when dbt semantic models change via GitHub Actions.',
    rowCount: 47,
    columns: [
      { name: 'metric_name', type: 'VARCHAR', description: 'Snake-case metric identifier (e.g., mrr)' },
      { name: 'display_name', type: 'VARCHAR', description: 'Human-readable metric name' },
      { name: 'definition', type: 'TEXT', description: 'Plain-language definition approved by metric owner' },
      { name: 'formula', type: 'TEXT', description: 'Calculation logic in pseudocode' },
      { name: 'canonical_sql', type: 'TEXT', description: 'Reference SQL query for this metric' },
      { name: 'source_model', type: 'VARCHAR', description: 'dbt model that produces this metric' },
      { name: 'owner_name', type: 'VARCHAR', description: 'Metric owner name' },
      { name: 'owner_team', type: 'VARCHAR', description: 'Owning team' },
      { name: 'last_updated', type: 'TIMESTAMP', description: 'When this definition was last changed' },
    ],
    lastSync: '2026-06-28 06:03 ET',
  },
  {
    id: 'model_lineage',
    tableName: 'beacon_agents.model_lineage',
    description: 'dbt model graph published into SQL. Agents query this to understand which tables feed which models before writing queries.',
    rowCount: 312,
    columns: [
      { name: 'upstream_model', type: 'VARCHAR', description: 'Parent model name' },
      { name: 'downstream_model', type: 'VARCHAR', description: 'Child model name' },
      { name: 'edge_type', type: 'VARCHAR', description: 'direct | transitive' },
      { name: 'source_system', type: 'VARCHAR', description: 'Originating system if upstream is a source' },
    ],
    lastSync: '2026-06-28 06:03 ET',
  },
  {
    id: 'business_glossary',
    tableName: 'beacon_agents.business_glossary',
    description: 'Approved terminology for business concepts. Agents use this to resolve ambiguous terms before querying data.',
    rowCount: 128,
    columns: [
      { name: 'term', type: 'VARCHAR', description: 'Business term' },
      { name: 'definition', type: 'TEXT', description: 'Approved definition' },
      { name: 'synonyms', type: 'ARRAY', description: 'Common alternative names for this term' },
      { name: 'category', type: 'VARCHAR', description: 'revenue | retention | acquisition | product' },
      { name: 'owner_team', type: 'VARCHAR', description: 'Team responsible for maintaining this definition' },
    ],
    lastSync: '2026-06-28 06:03 ET',
  },
]

export const AGENT_QUESTIONS = [
  {
    id: 'q1',
    question: 'What is our MRR this month?',
    schemaQuery: "SELECT canonical_sql, definition, source_model FROM beacon_agents.metric_definitions WHERE metric_name = 'mrr'",
    schemaResult: { metric_name: 'mrr', definition: 'SUM of normalized_monthly_amount where subscription_status = active', source_model: 'fct_mrr_movements' },
    answer: "Based on the Agent Schema definition, MRR is the sum of `normalized_monthly_amount` from `fct_mrr_movements` where `subscription_status = 'active'`. Current month MRR is **$2,847,000** — up 4.2% from last month. This matches the Finance team's definition: annual contracts are normalized to a monthly equivalent before inclusion.",
    agentName: 'RevOps Agent',
  },
  {
    id: 'q2',
    question: 'How is Net Revenue Retention calculated?',
    schemaQuery: "SELECT formula, definition, owner_team FROM beacon_agents.metric_definitions WHERE metric_name = 'nrr'",
    schemaResult: { metric_name: 'nrr', formula: '(starting_mrr + expansion_mrr - contraction_mrr - churned_mrr) / starting_mrr', owner_team: 'Finance' },
    answer: "The Agent Schema definition (owned by Finance) states NRR = **(starting_mrr + expansion_mrr - contraction_mrr - churned_mrr) / starting_mrr**. The denominator is measured on the **first day of the period** — not the average. Current trailing 12-month NRR is **114%**, meaning expansion from existing customers exceeds churn.",
    agentName: 'Finance Agent',
  },
  {
    id: 'q3',
    question: 'Which table should I query for customer churn?',
    schemaQuery: "SELECT upstream_model, downstream_model, source_system FROM beacon_agents.model_lineage WHERE downstream_model LIKE '%churn%' OR upstream_model = 'fct_mrr_movements'",
    schemaResult: { recommended_table: 'fct_mrr_movements', filter: "movement_type = 'churn'", freshness: '< 24 hours' },
    answer: "Per the Agent Schema lineage graph, churn data lives in `beacon_gold.fct_mrr_movements` filtered to `movement_type = 'churn'`. Do not query `stg_stripe_subscriptions` directly — the staging layer doesn't apply the 30-day reinstatement window that defines a confirmed churn. Use the mart layer.",
    agentName: 'GTM Agent',
  },
  {
    id: 'q4',
    question: 'What does "ARR" mean at Beacon?',
    schemaQuery: "SELECT term, definition, synonyms FROM beacon_agents.business_glossary WHERE term = 'ARR' OR 'ARR' = ANY(synonyms)",
    schemaResult: { term: 'ARR', definition: 'MRR * 12. Does not include one-time fees or professional services.', synonyms: ['Annual Recurring Revenue', 'annualized revenue'] },
    answer: "The business glossary defines ARR as **MRR multiplied by 12**. It does **not** include one-time fees, professional services revenue, or usage overages. This is important — our sales team sometimes uses 'ARR' loosely to include total contract value, but the financial definition used in board reporting is strictly `MRR × 12`.",
    agentName: 'GTM Agent',
  },
]
