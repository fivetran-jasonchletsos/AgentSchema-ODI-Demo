import React from "react";

const heroStyles = `
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 18px 4px rgba(0,229,255,0.25), 0 0 40px 8px rgba(0,229,255,0.10); }
    50%       { box-shadow: 0 0 32px 10px rgba(0,229,255,0.45), 0 0 70px 20px rgba(0,229,255,0.18); }
  }
  @keyframes arrow-travel {
    0%   { stroke-dashoffset: 60; opacity: 0.3; }
    60%  { stroke-dashoffset: 0;  opacity: 1; }
    100% { stroke-dashoffset: 0;  opacity: 1; }
  }
  @keyframes float-agent {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
  }
  .hero-schema-box {
    animation: pulse-glow 2.8s ease-in-out infinite;
  }
  .hero-arrow-path {
    stroke-dasharray: 60;
    stroke-dashoffset: 60;
    animation: arrow-travel 1.6s ease forwards;
  }
  .hero-arrow-path-down {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: arrow-travel 1.6s 0.6s ease forwards;
  }
  .hero-agent-0 { animation: float-agent 3.2s ease-in-out infinite; }
  .hero-agent-1 { animation: float-agent 3.2s 0.8s ease-in-out infinite; }
  .hero-agent-2 { animation: float-agent 3.2s 1.6s ease-in-out infinite; }
`;

const Hero: React.FC = () => {
  return (
    <>
      <style>{heroStyles}</style>

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          height: "56px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(8,12,24,0.88)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text)",
            }}
          >
            BEACON ANALYTICS
          </span>
          <span
            className="pill pill-cyan"
            style={{ fontSize: "0.6rem", letterSpacing: "0.08em" }}
          >
            FIVETRAN + DBT LABS OPEN STANDARD
          </span>
        </div>

        {/* Right */}
        <a
          href="https://github.com/fivetran-jasonchletsos"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            color: "var(--muted)",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              "var(--cyan)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              "var(--muted)")
          }
        >
          ODI Demo Repository ↗
        </a>
      </nav>

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
          paddingTop: "56px",
        }}
      >
        {/* Radial glow top-left */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-120px",
            width: "640px",
            height: "640px",
            background:
              "radial-gradient(circle at 30% 30%, rgba(0,229,255,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "4rem",
            padding: "5rem 2rem",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            flexWrap: "wrap",
          }}
        >
          {/* Left: copy */}
          <div style={{ flex: "1 1 420px", minWidth: "300px" }}>
            <div className="eyebrow" style={{ marginBottom: "1.25rem" }}>
              AGENT SCHEMA · OPEN STANDARD
            </div>

            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(2.75rem, 6vw, 5rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--text)",
                margin: "0 0 1.5rem 0",
              }}
            >
              Every agent.
              <br />
              <span style={{ color: "var(--cyan)" }}>Same truth.</span>
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "var(--muted)",
                maxWidth: "520px",
                marginBottom: "2.25rem",
              }}
            >
              Beacon Analytics runs three AI agents across RevOps, Finance, and
              GTM. Before Agent Schema, they each had a different definition of
              MRR. Now they all query the same trusted context layer before
              acting.
            </p>

            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <button className="btn btn-primary">Explore the Schema</button>
              <button className="btn btn-ghost">See Agent Demo</button>
            </div>
          </div>

          {/* Right: animated SVG diagram */}
          <div
            style={{
              flex: "1 1 380px",
              minWidth: "280px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AgentDiagram />
          </div>
        </div>
      </section>
    </>
  );
};

/* SVG diagram — agents → schema → data lake */
const AgentDiagram: React.FC = () => {
  const agents = [
    { label: "RevOps Agent", color: "#a78bfa", cls: "hero-agent-0", y: 32 },
    { label: "Finance Agent", color: "var(--cyan)", cls: "hero-agent-1", y: 110 },
    { label: "GTM Agent", color: "#fb923c", cls: "hero-agent-2", y: 188 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "420px",
      }}
    >
      <svg
        viewBox="0 0 420 340"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Agent boxes */}
        {agents.map((ag, i) => (
          <g key={i} className={ag.cls}>
            <rect
              x={10}
              y={ag.y}
              width={130}
              height={44}
              rx={8}
              fill="var(--surface)"
              stroke={ag.color}
              strokeWidth={1.5}
            />
            <text
              x={75}
              y={ag.y + 26}
              textAnchor="middle"
              fill={ag.color}
              fontSize={11}
              fontFamily="var(--font-mono)"
              fontWeight={600}
            >
              {ag.label}
            </text>
          </g>
        ))}

        {/* Arrows: agents → schema */}
        {agents.map((ag, i) => {
          const startY = ag.y + 22;
          const endX = 230;
          const endY = 130;
          return (
            <path
              key={`arr-${i}`}
              className="hero-arrow-path"
              d={`M 140 ${startY} C 190 ${startY} 190 ${endY} ${endX} ${endY}`}
              fill="none"
              stroke="var(--cyan-dim)"
              strokeWidth={1.5}
              strokeLinecap="round"
              style={{ animationDelay: `${i * 0.22}s` }}
            />
          );
        })}

        {/* Central schema box */}
        <rect
          className="hero-schema-box"
          x={230}
          y={96}
          width={160}
          height={68}
          rx={10}
          fill="rgba(0,229,255,0.06)"
          stroke="var(--cyan)"
          strokeWidth={2}
        />
        <text
          x={310}
          y={124}
          textAnchor="middle"
          fill="var(--cyan)"
          fontSize={11}
          fontFamily="var(--font-mono)"
          fontWeight={700}
        >
          beacon_agents
        </text>
        <text
          x={310}
          y={141}
          textAnchor="middle"
          fill="var(--cyan)"
          fontSize={11}
          fontFamily="var(--font-mono)"
          fontWeight={700}
        >
          schema
        </text>

        {/* Arrow: schema → data lake */}
        <line
          className="hero-arrow-path-down"
          x1={310}
          y1={164}
          x2={310}
          y2={218}
          stroke="var(--cyan-dim)"
          strokeWidth={1.5}
          strokeLinecap="round"
          markerEnd="url(#arrow)"
        />

        {/* Arrowhead marker */}
        <defs>
          <marker
            id="arrow"
            markerWidth={8}
            markerHeight={8}
            refX={4}
            refY={4}
            orient="auto"
          >
            <path d="M1,1 L7,4 L1,7 Z" fill="var(--cyan-dim)" />
          </marker>
        </defs>

        {/* Data lake box */}
        <rect
          x={230}
          y={220}
          width={160}
          height={56}
          rx={10}
          fill="var(--surface)"
          stroke="var(--border2)"
          strokeWidth={1.5}
        />
        <text
          x={310}
          y={245}
          textAnchor="middle"
          fill="var(--dim)"
          fontSize={10}
          fontFamily="var(--font-mono)"
        >
          Data Lake
        </text>
        <text
          x={310}
          y={260}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize={10}
          fontFamily="var(--font-mono)"
        >
          (Iceberg)
        </text>
      </svg>
    </div>
  );
};

export default Hero;
