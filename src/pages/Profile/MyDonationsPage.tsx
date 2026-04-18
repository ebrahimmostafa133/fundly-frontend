import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import donationsApi from "../../api/donationsApi";
import type { Donation } from "../../types/donation";

const PRIMARY       = "#00A3FF";
const PRIMARY_DARK  = "#0077B6";
const PRIMARY_LIGHT = "#e6f7ff";

const PALETTES = [
  { lid: "#0077B6", body: "#00A3FF", inside: "#e6f7ff", text: "#003f6b", seal: "#003f6b" },
  { lid: "#7c3aed", body: "#a78bfa", inside: "#f5f3ff", text: "#4c1d95", seal: "#5b21b6" },
  { lid: "#be185d", body: "#f472b6", inside: "#fdf2f8", text: "#831843", seal: "#9d174d" },
  { lid: "#b45309", body: "#fbbf24", inside: "#fffbeb", text: "#78350f", seal: "#92400e" },
  { lid: "#065f46", body: "#34d399", inside: "#ecfdf5", text: "#064e3b", seal: "#047857" },
  { lid: "#1e40af", body: "#60a5fa", inside: "#eff6ff", text: "#1e3a8a", seal: "#1d4ed8" },
];

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatBob {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-7px); }
  }
  @keyframes heartPop {
    0%   { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-34px) scale(0.4); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmerSlide {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes starPop {
    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
    60%  { transform: scale(1.3) rotate(8deg);  opacity: 1; }
    100% { transform: scale(1)   rotate(0deg);  opacity: 1; }
  }

  .donations-page * { box-sizing: border-box; }

  .shimmer-bar {
    background-size: 200% 100%;
    animation: shimmerSlide 2s ease infinite;
  }

  .env-card {
    position: relative;
    height: 200px;
    border-radius: 18px;
    overflow: hidden;
    cursor: default;
    transition: transform 0.35s cubic-bezier(.34,1.5,.64,1), box-shadow 0.35s ease;
    perspective: 600px;
  }
  .env-card:hover {
    transform: translateY(-7px) scale(1.018);
    box-shadow: 0 22px 52px rgba(0,0,0,0.14);
  }
  .env-body { position: absolute; inset: 0; border-radius: 18px; }
  .env-tri-bl {
    position: absolute; bottom: 0; left: 0;
    width: 50%; height: 52%;
    clip-path: polygon(0 100%, 100% 100%, 0 0);
    z-index: 2;
  }
  .env-tri-br {
    position: absolute; bottom: 0; right: 0;
    width: 50%; height: 52%;
    clip-path: polygon(100% 100%, 0 100%, 100% 0);
    z-index: 2;
  }
  .env-lid {
    position: absolute;
    top: 0; left: 0; right: 0; height: 52%;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    border-radius: 18px 18px 0 0;
    transform-origin: top center;
    transform: rotateX(0deg);
    transition: transform 0.55s cubic-bezier(.34,1.1,.64,1);
    z-index: 10;
    backface-visibility: hidden;
  }
  .env-card:hover .env-lid { transform: rotateX(-155deg); }
  .env-seal {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 11;
    transition: opacity 0.28s ease, transform 0.5s cubic-bezier(.34,1.5,.64,1);
  }
  .env-card:hover .env-seal {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0) rotate(200deg);
  }
  .env-inner {
    position: absolute; inset: 0; border-radius: 18px; z-index: 5;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 18px 20px 16px;
    opacity: 0; transform: translateY(12px);
    transition: opacity 0.32s ease 0.18s, transform 0.32s ease 0.18s;
  }
  .env-card:hover .env-inner { opacity: 1; transform: translateY(0); }

  .filter-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 10px;
    border: 1.5px solid #e5e7eb;
    background: #fff; color: #6b7280;
    font-weight: 500; font-size: 13px;
    cursor: pointer; transition: all 0.18s ease;
    font-family: inherit;
  }
  .filter-btn.active {
    border-color: ${PRIMARY};
    background: ${PRIMARY_LIGHT};
    color: ${PRIMARY_DARK};
    font-weight: 700;
  }
  .filter-btn:hover:not(.active) { border-color: #d1d5db; background: #f9fafb; }
`;

/* ── Animated counter ── */
function useCountUp(target: number, ms = 1100, run = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / ms, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, ms, run]);
  return v;
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function MyDonationsPage() {
  const [donations, setDonations]   = useState<Donation[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [filter, setFilter]         = useState<"all" | "recent" | "top">("all");
  const [statsReady, setStatsReady] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  /* inject styles */
  useEffect(() => {
    const id = "my-donations-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => document.getElementById(id)?.remove();
  }, []);

  /* observe stats row for count-up trigger */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsReady(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* fetch from backend */
  useEffect(() => {
    donationsApi
      .getMyDonations()
      .then((r) => {
        const data: Donation[] = Array.isArray(r)
          ? r
          : Array.isArray(r?.results)
          ? r.results
          : [];
        setDonations(data);
      })
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 401 || status === 403) {
          setError("You need to be logged in to view your donations.");
        } else {
          setError("Couldn't load your donations. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const total        = donations.reduce((s, d) => s + parseFloat(d.amount || "0"), 0);
  const projectCount = new Set(donations.map((d) => d.project?.id)).size;

  const sorted = [...donations].sort((a, b) => {
    if (filter === "recent")
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (filter === "top")
      return parseFloat(b.amount) - parseFloat(a.amount);
    return 0;
  });

  if (loading) return <Loader />;
  if (error)   return <ErrState msg={error} />;

  return (
    <div
      className="donations-page min-h-screen px-4 py-10"
      style={{ background: "#F7FAFC" }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* back link */}
        <div style={{ animation: "fadeUp 0.25s ease both" }}>
          <Link
            to="/profile"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: PRIMARY, fontWeight: 600, fontSize: 13,
              textDecoration: "none", marginBottom: 20,
              transition: "gap 0.18s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.gap = "10px")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.gap = "6px")}
          >
            <span style={{ fontSize: 16, display: "inline-block" }}>←</span>
            Back to Profile
          </Link>
        </div>

        <HeroBanner donationCount={donations.length} total={total} />

        <div
          ref={statsRef}
          style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14, marginBottom: 28,
            animation: "fadeUp 0.38s ease 0.08s both",
          }}
        >
          <StatCard emoji="💸" label="Total Donated"   num={Math.round(total)} prefix="EGP " color="#00A3FF" run={statsReady} />
          <StatCard emoji="📬" label="Donations Made"  num={donations.length}  color="#7c3aed"  run={statsReady} />
          <StatCard emoji="🌱" label="Projects Backed" num={projectCount}      color="#059669"  run={statsReady} />
        </div>

        <FilterRow active={filter} set={setFilter} />

        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {sorted.map((d, i) => (
              <EnvelopeCard key={d.id} donation={d} index={i} palette={PALETTES[i % PALETTES.length]} />
            ))}
          </div>
        )}

        {sorted.length > 0 && <Thanks count={donations.length} />}
      </div>
    </div>
  );
}

/* ════════════════════ HERO ════════════════════ */
function HeroBanner({ donationCount, total }: { donationCount: number; total: number }) {
  return (
    <div
      style={{
        borderRadius: 22, padding: "24px 28px", marginBottom: 28,
        background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 65%, #4FD1FF 100%)`,
        position: "relative", overflow: "hidden",
        animation: "fadeUp 0.32s ease both",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
    >
      {[{ s: 140, x: -36, y: -36 }, { s: 70, x: "72%", y: -18 }, { s: 50, x: "88%", y: "55%" }].map((b, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: b.s, height: b.s, left: b.x, top: b.y,
          background: "#fff", opacity: 0.08, pointerEvents: "none",
        }} />
      ))}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>Your Impact</p>
        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: "0 0 6px", lineHeight: 1.1 }}>My Donations</h1>
        {donationCount > 0 ? (
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: 0, fontWeight: 500 }}>
            {donationCount} {donationCount === 1 ? "donation" : "donations"} · EGP {Math.round(total).toLocaleString()} total 💙
          </p>
        ) : (
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: 0 }}>
            Every contribution counts — thank you! 💙
          </p>
        )}
      </div>
      <div style={{ fontSize: 56, lineHeight: 1, animation: "floatBob 3s ease-in-out infinite", position: "relative", zIndex: 1 }}>
        💌
      </div>
    </div>
  );
}

/* ════════════════════ STAT CARD ════════════════════ */
function StatCard({ emoji, label, num, prefix = "", color, run }: {
  emoji: string; label: string; num: number; prefix?: string; color: string; run: boolean;
}) {
  const count = useCountUp(num, 1100, run);
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "16px 14px",
      border: `1.5px solid ${color}28`, boxShadow: `0 4px 20px ${color}14`,
      position: "relative", overflow: "hidden",
    }}>
      <div className="shimmer-bar" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        backgroundSize: "200% 100%",
      }} />
      <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1, marginBottom: 3 }}>
        {prefix}{count.toLocaleString()}
      </div>
      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

/* ════════════════════ FILTER ROW ════════════════════ */
type FilterKey = "all" | "recent" | "top";

function FilterRow({ active, set }: { active: FilterKey; set: (k: FilterKey) => void }) {
  const tabs: { k: FilterKey; label: string; icon: string }[] = [
    { k: "all",    label: "All",         icon: "📋" },
    { k: "recent", label: "Most Recent", icon: "🕐" },
    { k: "top",    label: "Largest",     icon: "🏆" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 22, animation: "fadeUp 0.4s ease 0.18s both" }}>
      {tabs.map((t) => (
        <button key={t.k} onClick={() => set(t.k)} className={`filter-btn${active === t.k ? " active" : ""}`}>
          <span>{t.icon}</span>{t.label}
        </button>
      ))}
    </div>
  );
}

/* ════════════════════ ENVELOPE CARD ════════════════════ */
function EnvelopeCard({ donation, index, palette }: {
  donation: Donation; index: number; palette: typeof PALETTES[0];
}) {
  const ref      = useRef<HTMLDivElement>(null);
  const amount   = parseFloat(donation.amount || "0");
  const title    = donation.project?.title ?? "Unknown Project";
  const initials = title.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
  const date     = new Date(donation.created_at).toLocaleDateString("en-US", {
    day: "2-digit", month: "short", year: "numeric",
  });

  function spawnParticles() {
    const el = ref.current;
    if (!el) return;
    ["♥", "★", "✦", "◆"].forEach((ch, i) => {
      const s = document.createElement("span");
      Object.assign(s.style, {
        position: "absolute", left: `${15 + i * 22}%`, bottom: "12px",
        fontSize: "14px", pointerEvents: "none", zIndex: "99",
        color: palette.body,
        animation: `heartPop 0.8s ease-out ${i * 0.1}s forwards`,
      });
      s.textContent = ch;
      el.appendChild(s);
      setTimeout(() => s.remove(), 900 + i * 110);
    });
  }

  return (
    <div
      ref={ref}
      className="env-card"
      style={{ animation: `fadeUp 0.4s ease ${0.06 + index * 0.08}s both` }}
      onMouseEnter={spawnParticles}
    >
      <div className="env-body"   style={{ background: palette.body }} />
      <div className="env-tri-bl" style={{ background: palette.lid, opacity: 0.65 }} />
      <div className="env-tri-br" style={{ background: palette.lid, opacity: 0.8 }} />
      <div className="env-lid"    style={{ background: palette.lid }} />

      <div className="env-seal">
        <div style={{
          width: 46, height: 46, background: palette.seal, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `3px solid ${palette.lid}`,
          clipPath: "polygon(50% 0%,80% 10%,100% 35%,100% 70%,80% 90%,50% 100%,20% 90%,0% 70%,0% 35%,20% 10%)",
          color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: "0.5px",
          animation: "floatBob 2.6s ease-in-out infinite",
        }}>
          {initials}
        </div>
      </div>

      <div className="env-inner" style={{ background: palette.inside }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: palette.body,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 12,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: palette.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {title}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: palette.text, opacity: 0.55 }}>{date}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: "0 0 1px", fontSize: 10, color: palette.text, opacity: 0.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              Donated
            </p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: palette.text, lineHeight: 1 }}>
              EGP {amount.toLocaleString()}
            </p>
          </div>
          <Link
            to={`/projects/${donation.project?.id}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: "7px 13px", borderRadius: 10,
              background: palette.body, color: "#fff",
              fontSize: 11, fontWeight: 700, textDecoration: "none",
              letterSpacing: "0.3px", whiteSpace: "nowrap",
              transition: "opacity 0.18s", flexShrink: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.82")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            View →
          </Link>
        </div>

        <div style={{ marginTop: 10 }}>
          <TierBadge amount={amount} />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════ TIER BADGE ════════════════════ */
function TierBadge({ amount }: { amount: number }) {
  const t =
    amount >= 5000 ? { label: "🏆 Champion Donor",  bg: "#fef9c3", fg: "#854d0e" } :
    amount >= 1000 ? { label: "⭐ Star Supporter",   bg: "#f0fdf4", fg: "#166534" } :
    amount >= 500  ? { label: "💙 Valued Backer",    bg: "#eff6ff", fg: "#1e40af" } :
                     { label: "🌱 Kind Contributor", bg: "#f0fdf4", fg: "#166534" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 100,
      background: t.bg, color: t.fg, fontSize: 10, fontWeight: 700,
    }}>
      {t.label}
    </span>
  );
}

/* ════════════════════ EMPTY STATE ════════════════════ */
function EmptyState() {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "60px 24px", textAlign: "center",
      background: "#fff", borderRadius: 20, border: "1.5px dashed #d1d5db",
      animation: "fadeUp 0.4s ease both",
    }}>
      <div style={{ fontSize: 64, marginBottom: 16, animation: "floatBob 3s ease-in-out infinite" }}>💌</div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1f2937", margin: "0 0 8px" }}>No donations yet</h3>
      <p style={{ fontSize: 14, color: "#9ca3af", maxWidth: 280, margin: "0 0 24px" }}>
        Your first envelope is waiting to be sent! Find a project you love and make an impact.
      </p>
      <Link
        to="/projects"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "12px 26px", borderRadius: 12,
          background: hov ? PRIMARY_DARK : PRIMARY,
          color: "#fff", fontWeight: 700, fontSize: 15,
          textDecoration: "none",
          transition: "background 0.18s ease, transform 0.18s ease",
          transform: hov ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        Explore Projects →
      </Link>
    </div>
  );
}

/* ════════════════════ THANKS FOOTER ════════════════════ */
function Thanks({ count }: { count: number }) {
  const msgs = [
    "The world is better because of people like you 💙",
    "You've brightened someone's day 🌟",
    "Change starts with one donation — and you've made many ✨",
  ];
  return (
    <div style={{
      marginTop: 36, borderRadius: 20, padding: "22px 24px", textAlign: "center",
      background: `linear-gradient(135deg, ${PRIMARY_LIGHT} 0%, #f0fdf4 100%)`,
      border: `1.5px solid ${PRIMARY}30`,
      animation: "fadeUp 0.5s ease 0.25s both",
    }}>
      <div style={{ fontSize: 28, marginBottom: 8, animation: "starPop 0.6s ease 0.5s both" }}>🎉</div>
      <p style={{ fontWeight: 700, color: "#374151", fontSize: 14, margin: "0 0 4px" }}>
        {msgs[count % msgs.length]}
      </p>
      <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
        {count} {count === 1 ? "donation" : "donations"} and counting
      </p>
    </div>
  );
}

/* ════════════════════ LOADER ════════════════════ */
function Loader() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 16, background: "#F7FAFC",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        border: "3px solid #e5e7eb", borderTopColor: PRIMARY,
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af", margin: 0 }}>
        Loading your donations…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ════════════════════ ERROR STATE ════════════════════ */
function ErrState({ msg }: { msg: string }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#F7FAFC",
    }}>
      <div style={{
        color: "#dc2626", background: "#fef2f2",
        border: "1px solid #fca5a5",
        padding: "28px 32px", borderRadius: 16,
        fontSize: 14, textAlign: "center", maxWidth: 340,
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>😕</div>
        <p style={{ fontWeight: 700, color: "#b91c1c", margin: "0 0 8px" }}>Something went wrong</p>
        <p style={{ color: "#6b7280", margin: "0 0 20px", lineHeight: 1.6 }}>{msg}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: PRIMARY, color: "#fff",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}