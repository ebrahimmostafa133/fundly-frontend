import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const PRIMARY      = "#00A3FF";
const PRIMARY_DARK = "#0077B6";

const GLOBAL_STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatBob {
    0%, 100% { transform: translateY(0px) rotate(-8deg); }
    50%       { transform: translateY(-12px) rotate(8deg); }
  }
  @keyframes floatBob2 {
    0%, 100% { transform: translateY(0px) rotate(5deg); }
    50%       { transform: translateY(-10px) rotate(-5deg); }
  }
  @keyframes floatBob3 {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-8px) scale(1.1); }
  }
  @keyframes spin404 {
    0%   { transform: rotate(0deg) scale(1); }
    25%  { transform: rotate(-4deg) scale(1.02); }
    75%  { transform: rotate(4deg) scale(0.98); }
    100% { transform: rotate(0deg) scale(1); }
  }
  @keyframes coinSpin {
    0%   { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0,163,255,0.4); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 14px rgba(0,163,255,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0,163,255,0); }
  }
  @keyframes rippleOut {
    0%   { transform: scale(0); opacity: 0.4; }
    100% { transform: scale(30); opacity: 0; }
  }
  @keyframes starPop {
    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
    60%  { transform: scale(1.3) rotate(8deg);  opacity: 1; }
    100% { transform: scale(1)   rotate(0deg);  opacity: 1; }
  }
  @keyframes tickerScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  .nf-btn {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    letter-spacing: 0.5px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    border: none;
  }
  .nf-btn:hover { transform: translateY(-3px); }
  .nf-btn-primary {
    background: ${PRIMARY};
    color: #fff;
    box-shadow: 0 4px 18px rgba(0,163,255,0.3);
  }
  .nf-btn-primary:hover {
    background: ${PRIMARY_DARK};
    box-shadow: 0 8px 28px rgba(0,163,255,0.45);
  }
  .nf-btn-secondary {
    background: #fff;
    color: #374151;
    border: 1.5px solid #e5e7eb !important;
  }
  .nf-btn-secondary:hover {
    border-color: ${PRIMARY} !important;
    color: ${PRIMARY};
  }
  .nf-ripple {
    position: absolute;
    border-radius: 50%;
    width: 10px; height: 10px;
    background: rgba(255,255,255,0.35);
    pointer-events: none;
    animation: rippleOut 0.55s ease-out forwards;
  }

  .ticker-wrap {
    overflow: hidden;
    white-space: nowrap;
  }
  .ticker-inner {
    display: inline-block;
    animation: tickerScroll 18s linear infinite;
  }
`;

/* ── floating decorative emoji ── */
function FloatEmoji({
  children,
  style,
  anim = "floatBob",
  delay = "0s",
}: {
  children: string;
  style?: React.CSSProperties;
  anim?: string;
  delay?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        fontSize: 32,
        pointerEvents: "none",
        animation: `${anim} 3.2s ease-in-out ${delay} infinite`,
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── ripple on click ── */
function spawnRipple(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.className = "nf-ripple";
  dot.style.left = `${e.clientX - rect.left - 5}px`;
  dot.style.top  = `${e.clientY - rect.top  - 5}px`;
  el.appendChild(dot);
  setTimeout(() => dot.remove(), 600);
}

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  /* inject styles */
  useEffect(() => {
    if (document.getElementById("nf-styles")) return;
    const tag = document.createElement("style");
    tag.id = "nf-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => document.getElementById("nf-styles")?.remove();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#F7FAFC" }}
    >
      {/* ── soft dot pattern background ── */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.45,
        }}
      />

      {/* ── top accent bar ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${PRIMARY_DARK}, ${PRIMARY}, #4FD1FF)` }} />

      {/* ── floating emoji decorations ── */}
      <FloatEmoji anim="floatBob"  delay="0s"    style={{ top: "12%", left: "6%" }}>💰</FloatEmoji>
      <FloatEmoji anim="floatBob2" delay="0.4s"  style={{ top: "18%", right: "8%" }}>🤝</FloatEmoji>
      <FloatEmoji anim="floatBob3" delay="0.8s"  style={{ bottom: "22%", left: "9%" }}>💳</FloatEmoji>
      <FloatEmoji anim="floatBob"  delay="1.2s"  style={{ bottom: "18%", right: "7%" }}>🏦</FloatEmoji>
      <FloatEmoji anim="floatBob2" delay="0.6s"  style={{ top: "42%", left: "3%" }}>💸</FloatEmoji>
      <FloatEmoji anim="floatBob3" delay="1.5s"  style={{ top: "38%", right: "4%" }}>💝</FloatEmoji>
      <FloatEmoji anim="floatBob"  delay="1s"    style={{ top: "68%", left: "18%", fontSize: 22 }}>🪙</FloatEmoji>
      <FloatEmoji anim="floatBob2" delay="0.3s"  style={{ top: "72%", right: "16%", fontSize: 22 }}>💵</FloatEmoji>

      {/* ── main content ── */}
      <div
        className="text-center px-6 relative z-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          maxWidth: 520,
          width: "100%",
        }}
      >

        {/* ── 404 hero number ── */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 4 }}>
          <div
            style={{
              fontSize: "clamp(5rem, 22vw, 10rem)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: PRIMARY,
              animation: "spin404 4s ease-in-out infinite",
              display: "inline-block",
              textShadow: `4px 4px 0px ${PRIMARY_DARK}22`,
            }}
          >
            404
          </div>

          {/* coin spinning on top of the 4 */}
          <div
            style={{
              position: "absolute",
              top: -14,
              right: -10,
              fontSize: 28,
              animation: "floatBob3 2s ease-in-out infinite",
            }}
          >
            🪙
          </div>
        </div>

        {/* ── pill badge ── */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 20,
            background: "#fef2f2", border: "1.5px solid #fca5a5",
            fontSize: 12, fontWeight: 700, color: "#b91c1c",
            marginBottom: 20,
            animation: "fadeUp 0.4s ease 0.2s both",
          }}
        >
          <span style={{ fontSize: 13 }}>⚠️</span>
          Page not found
        </div>

        {/* ── heading ── */}
        <h1
          style={{
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            fontWeight: 800,
            color: "#111827",
            margin: "0 0 12px",
            lineHeight: 1.2,
            animation: "fadeUp 0.4s ease 0.28s both",
          }}
        >
          Looks like this donation got lost!
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "#6b7280",
            maxWidth: 360,
            margin: "0 auto 28px",
            lineHeight: 1.7,
            animation: "fadeUp 0.4s ease 0.34s both",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to making an impact. 💙
        </p>

        {/* ── info card ── */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 28,
            textAlign: "left",
            animation: "fadeUp 0.4s ease 0.42s both",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px" }}>
            Request details
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "Path",       value: window.location.pathname, color: "#6b7280" },
              { label: "Status",     value: "404 — Not Found",        color: "#ef4444" },
              { label: "Tip",        value: "Check the URL or go home", color: "#6b7280" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: PRIMARY, flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, minWidth: 46 }}>
                  {row.label}
                </span>
                <span style={{ fontSize: 12, color: row.color, fontWeight: 500, fontFamily: "monospace" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── action buttons ── */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 12, flexWrap: "wrap",
            animation: "fadeUp 0.4s ease 0.50s both",
          }}
        >
          <Link
            to="/"
            className="nf-btn nf-btn-primary"
            onClick={spawnRipple}
          >
            <span style={{ fontSize: 16 }}>🏠</span>
            Go home
          </Link>

          <button
            onClick={(e) => { spawnRipple(e); navigate(-1); }}
            className="nf-btn nf-btn-secondary"
          >
            <span style={{ fontSize: 15 }}>←</span>
            Go back
          </button>

          <Link
            to="/projects"
            className="nf-btn nf-btn-secondary"
            onClick={spawnRipple}
          >
            <span style={{ fontSize: 15 }}>🧑🏻‍💻</span>
            Explore projects
          </Link>
        </div>

        {/* ── ticker ── */}
        <div
          style={{
            marginTop: 36,
            animation: "fadeUp 0.4s ease 0.58s both",
          }}
        >
          <div
            className="ticker-wrap"
            style={{
              padding: "10px 0",
              borderTop: "1px solid #e5e7eb",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div className="ticker-inner">
              {[
                "💰 Keep donating",
                "🤝 Every dirham counts",
                "💝 Change starts with you",
                "🏦 Fund a project today",
                "💸 Make an impact",
                "🪙 Give generously",
                "💳 Secure donations",
                "💵 Support a cause",
                "💰 Keep donating",
                "🤝 Every dirham counts",
                "💝 Change starts with you",
                "🏦 Fund a project today",
                "💸 Make an impact",
                "🪙 Give generously",
                "💳 Secure donations",
                "💵 Support a cause",
              ].map((item, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: i % 2 === 0 ? PRIMARY : "#9ca3af",
                    marginRight: 32,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── corner brand tag ── */}
      <div
        style={{
          position: "absolute", bottom: 24, right: 24,
          fontSize: 11, fontWeight: 700, letterSpacing: "2px",
          color: "#d1d5db",
          animation: "fadeUp 0.4s ease 0.7s both",
        }}
      >
        FUNDLY · 404
      </div>
    </div>
  );
}