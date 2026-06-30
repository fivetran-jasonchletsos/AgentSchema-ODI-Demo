import React from "react";

const problemStyles = `
  @keyframes spin-dot {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .spin-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: var(--cyan);
    animation: spin-dot 0.9s linear infinite;
    flex-shrink: 0;
  }
`;

interface AgentBubbleProps {
  agentName: string;
  dotColor: string;
  answer: string;
}

const AgentBubble: React.FC<AgentBubbleProps> = ({
  agentName,
  dotColor,
  answer,
}) => (
  <div
    style={{
      background: "rgba(220,38,38,0.04)",
      border: "1px solid rgba(220,38,38,0.22)",
      borderRadius: "10px",
      padding: "0.875rem 1rem",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.5rem",
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: dotColor,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "var(--muted)",
          textTransform: "uppercase",
        }}
      >
        {agentName}
      </span>
    </div>
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.8rem",
        lineHeight: 1.6,
        color: "var(--text)",
        margin: 0,
      }}
    >
      {answer}
    </p>
  </div>
);

const Badge: React.FC<{
  label: string;
  variant: "conflict" | "consistent";
}> = ({ label, variant }) => {
  const isConflict = variant === "conflict";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.25rem 0.625rem",
        borderRadius: "999px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.62rem",
        fontWeight: 800,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        background: isConflict
          ? "rgba(220,38,38,0.15)"
          : "rgba(16,185,129,0.15)",
        color: isConflict ? "var(--red)" : "var(--emerald)",
        border: `1px solid ${
          isConflict ? "rgba(220,38,38,0.35)" : "rgba(16,185,129,0.35)"
        }`,
      }}
    >
      {label}
    </span>
  );
};

const PanelHeader: React.FC<{
  title: string;
  variant: "conflict" | "consistent";
  badge: string;
}> = ({ title, variant, badge }) => {
  const isConflict = variant === "conflict";
  return (
    <div
      style={{
        padding: "1rem 1.25rem 0.875rem",
        borderBottom: `1px solid ${
          isConflict ? "rgba(220,38,38,0.18)" : "rgba(16,185,129,0.18)"
        }`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.85rem",
          fontWeight: 700,
          color: isConflict ? "var(--red)" : "var(--emerald)",
        }}
      >
        {title}
      </span>
      <Badge label={badge} variant={variant} />
    </div>
  );
};

const ProblemSection: React.FC = () => {
  return (
    <>
      <style>{problemStyles}</style>

      <section className="section">
        <div
          className="container"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "5rem 2rem",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="eyebrow" style={{ marginBottom: "0.875rem" }}>
              THE PROBLEM
            </div>
            <h2 className="section-title">
              Three agents. Three answers. Zero trust.
            </h2>
            <p
              className="section-sub"
              style={{ maxWidth: "600px", margin: "0 auto" }}
            >
              Without a shared context layer, each AI agent invents its own
              definition. The result is inconsistent data, eroded trust, and
              decisions made on different versions of the truth.
            </p>
          </div>

          {/* Two panels */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {/* LEFT: Without Agent Schema */}
            <div
              className="card"
              style={{
                flex: "1 1 340px",
                padding: 0,
                overflow: "hidden",
                border: "1px solid rgba(220,38,38,0.25)",
              }}
            >
              <PanelHeader
                title="Without Agent Schema"
                variant="conflict"
                badge="CONFLICT"
              />

              {/* Question row */}
              <div
                style={{
                  padding: "0.875rem 1.25rem 0.75rem",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    fontStyle: "italic",
                  }}
                >
                  Query: "What is our MRR?"
                </span>
              </div>

              {/* Agent bubbles */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  padding: "1rem 1.25rem 1.25rem",
                }}
              >
                <AgentBubble
                  agentName="RevOps Agent"
                  dotColor="var(--purple)"
                  answer={`$2.8M — I queried stripe.subscriptions directly and summed the amount field.`}
                />
                <AgentBubble
                  agentName="Finance Agent"
                  dotColor="var(--amber)"
                  answer={`$3.1M — I included annual contract TCV normalized over 12 months, plus PS revenue.`}
                />
                <AgentBubble
                  agentName="GTM Agent"
                  dotColor="var(--orange)"
                  answer={`$2.4M — I pulled from the salesforce_opportunities table using closed_won ARR divided by 12.`}
                />
              </div>
            </div>

            {/* RIGHT: With Agent Schema */}
            <div
              className="card"
              style={{
                flex: "1 1 340px",
                padding: 0,
                overflow: "hidden",
                border: "1px solid rgba(16,185,129,0.25)",
              }}
            >
              <PanelHeader
                title="With Agent Schema"
                variant="consistent"
                badge="CONSISTENT"
              />

              {/* Question row */}
              <div
                style={{
                  padding: "0.875rem 1.25rem 0.75rem",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    fontStyle: "italic",
                  }}
                >
                  Query: "What is our MRR?"
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  padding: "1rem 1.25rem 1.25rem",
                }}
              >
                {/* Any Agent card */}
                <div
                  style={{
                    background: "rgba(16,185,129,0.04)",
                    border: "1px solid rgba(16,185,129,0.22)",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  {/* Agent header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.625rem 0.875rem",
                      borderBottom: "1px solid rgba(16,185,129,0.14)",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "var(--emerald)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "var(--muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Any Agent
                    </span>
                  </div>

                  {/* Step 1: querying */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      padding: "0.625rem 0.875rem",
                      borderBottom: "1px solid rgba(0,229,255,0.1)",
                      background: "rgba(0,229,255,0.03)",
                    }}
                  >
                    <span className="spin-dot" />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        color: "var(--cyan)",
                      }}
                    >
                      Querying beacon_agents.metric_definitions...
                    </span>
                  </div>

                  {/* Step 2: schema result */}
                  <div
                    style={{
                      padding: "0.625rem 0.875rem",
                      borderBottom: "1px solid var(--border)",
                      background: "rgba(8,12,24,0.5)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        lineHeight: 1.8,
                        color: "var(--muted)",
                      }}
                    >
                      <span style={{ color: "var(--dim)" }}>metric_name: </span>
                      <span style={{ color: "var(--cyan)" }}>mrr</span>
                      <br />
                      <span style={{ color: "var(--dim)" }}>definition: </span>
                      <span style={{ color: "var(--text)" }}>
                        SUM(normalized_monthly_amount) WHERE active
                      </span>
                    </div>
                  </div>

                  {/* Answer */}
                  <div style={{ padding: "0.75rem 0.875rem" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        lineHeight: 1.6,
                        color: "var(--text)",
                        margin: 0,
                      }}
                    >
                      <span style={{ color: "var(--emerald)", fontWeight: 700 }}>
                        $2,847,000
                      </span>{" "}
                      — using the canonical Finance-approved definition from the
                      Agent Schema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p
            style={{
              textAlign: "center",
              marginTop: "2.5rem",
              fontStyle: "italic",
              fontSize: "0.82rem",
              color: "var(--dim)",
              lineHeight: 1.6,
            }}
          >
            Agent Schema is an open standard by Fivetran and dbt Labs. One
            schema. Every agent. No guessing.
          </p>
        </div>
      </section>
    </>
  );
};

export default ProblemSection;
