import { useEffect, useState, useRef, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectsApi } from '../../api/projectsApi';
import type { Category, Project } from '../../types/project.types';

/* ─── Theme ─── */
const P   = '#00A3FF';
const PD  = '#0077B6';
const PDD = '#003f6b';
const PL  = '#e6f7ff';
const PC  = '#4FD1FF';

/* ─── Card palette for wallet slots ─── */
const CARD_PALETTES = [
  { bg: PD,  text: '#fff', chip: 'rgba(255,255,255,0.2)',  label: 'rgba(255,255,255,0.65)' },
  { bg: P,   text: '#fff', chip: 'rgba(255,255,255,0.2)',  label: 'rgba(255,255,255,0.65)' },
  { bg: '#fff', text: PDD, chip: 'rgba(0,63,107,0.08)', label: '#6b91aa' },
];

/* ─── Injected CSS ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes floatBob{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

  /* ── blob float ── */
  @keyframes blobFloat {
    0%   { border-radius:40% 60% 70% 30%/40% 50% 60% 50%; transform:translate(0,0); }
    50%  { border-radius:60% 40% 50% 50%/30% 60% 40% 70%; transform:translate(5px,-5px); }
    100% { border-radius:50% 50% 30% 70%/60% 40% 60% 40%; transform:translate(-5px,5px); }
  }

  /* ── slideIntoPocket ── */
  @keyframes slideIntoPocket {
    0%   { transform:translateY(-100px); opacity:0; }
    100% { transform:translateY(0);      opacity:1; }
  }

  /* ── Gooey search ── */
  .gooey-wrap {
    position:relative; width:100%; max-width:560px; height:72px;
    display:flex; align-items:center; justify-content:center;
  }
  .gooey-bg-layer {
    position:absolute; inset:0;
    filter:url('#fundly-goo');
    z-index:1; pointer-events:none;
  }
  .g-blob {
    position:absolute; border-radius:50%;
    background:linear-gradient(135deg,${P},${PC});
    transition:all .8s cubic-bezier(.34,1.56,.64,1);
  }
  .g-blob-1 { width:140px;height:72px;left:0;top:0;   animation:blobFloat 6s infinite alternate ease-in-out; }
  .g-blob-2 { width:120px;height:72px;right:0;top:0;  background:linear-gradient(135deg,${PC},${P}); animation:blobFloat 8s infinite alternate-reverse ease-in-out; }
  .g-blob-3 { width:200px;height:72px;left:50%;top:0; transform:translateX(-50%); background:linear-gradient(135deg,${PD},${P}); opacity:.92; }
  .g-bridge  { position:absolute;height:40px;width:80%;left:10%;top:16px;background:${PD};border-radius:40px; }

  .gooey-wrap:focus-within .g-blob-1 { transform:scale(1.15) translateX(-20px); filter:brightness(1.15); }
  .gooey-wrap:focus-within .g-blob-2 { transform:scale(1.15) translateX(20px);  filter:brightness(1.15); }

  .g-input-overlay {
    position:relative; z-index:10;
    width:92%; height:52px;
    background:rgba(255,255,255,.1);
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    border:1px solid rgba(255,255,255,.3);
    border-radius:26px;
    display:flex; align-items:center; padding:0 20px;
    box-shadow:0 10px 30px rgba(0,119,182,.25);
    transition:all .4s cubic-bezier(.165,.84,.44,1);
    gap:10px;
  }
  .gooey-wrap:focus-within .g-input-overlay {
    transform:translateY(-4px);
    background:rgba(255,255,255,.16);
    border-color:rgba(255,255,255,.5);
    box-shadow:0 20px 50px rgba(0,119,182,.35);
  }
  .g-input {
    background:transparent; border:none; outline:none;
    flex:1; color:#fff; font-size:15px; font-weight:500;
    letter-spacing:.02em; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .g-input::placeholder { color:rgba(255,255,255,.65); font-weight:400; }
  .g-focus-line {
    position:absolute; bottom:0; left:50%; width:0;
    height:2px; background:#fff; border-radius:2px;
    transform:translateX(-50%); transition:width .4s ease;
    box-shadow:0 0 15px rgba(255,255,255,.5);
  }
  .gooey-wrap:focus-within .g-focus-line { width:40%; }
  .gooey-svg { position:absolute; width:0; height:0; pointer-events:none; }

  /* ── Wallet ── */
  .fundly-wallet {
    position:relative; width:260px; height:220px;
    cursor:pointer; perspective:1000px;
    display:flex; justify-content:center; align-items:flex-end;
    transition:transform .4s ease;
  }
  .fundly-wallet:hover { transform:translateY(-6px); }
  .wallet-back {
    position:absolute; bottom:0; width:260px; height:190px;
    background:${PDD};
    border-radius:22px 22px 60px 60px; z-index:5;
    box-shadow:inset 0 25px 35px rgba(0,0,0,.4), inset 0 5px 15px rgba(0,0,0,.5);
  }

  /* project cards inside wallet */
  .w-card {
    position:absolute; width:244px; height:136px; left:8px;
    border-radius:16px; padding:16px; color:#fff;
    box-shadow:inset 0 1px 1px rgba(255,255,255,.3), 0 -4px 15px rgba(0,0,0,.1);
    transition:transform .6s cubic-bezier(.34,1.56,.64,1);
    animation:slideIntoPocket .8s cubic-bezier(.2,.8,.2,1) backwards;
    cursor:pointer;
  }
  .w-card-inner { display:flex; flex-direction:column; justify-content:space-between; height:100%; }
  .w-card-top   { display:flex; justify-content:space-between; align-items:center; font-size:12px; text-transform:uppercase; letter-spacing:1px; font-weight:700; }
  .w-chip       { width:30px; height:22px; background:rgba(255,255,255,.2); border-radius:4px; border:1px solid rgba(255,255,255,.15); }
  .w-card-bottom{ display:flex; justify-content:space-between; align-items:flex-end; }
  .w-label      { font-size:7px; opacity:.7; text-transform:uppercase; margin-bottom:2px; display:block; }
  .w-value      { font-size:11px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px; }
  .w-raised     { text-align:right; }
  .w-raised-num { font-size:14px; font-weight:800; letter-spacing:-.5px; }

  /* stacking positions */
  .w-c0 { background:${PD}; bottom:88px; z-index:10; animation-delay:.1s; }
  .w-c1 { background:${P};  bottom:62px; z-index:20; animation-delay:.2s; }
  .w-c2 { background:#fff; color:${PDD}; bottom:36px; z-index:30; animation-delay:.3s; }
  .w-c2 .w-chip { background:rgba(0,63,107,.06); }

  /* hover fans */
  .fundly-wallet:hover .w-c0 { transform:translateY(-72px) rotate(-4deg); }
  .fundly-wallet:hover .w-c1 { transform:translateY(-44px) rotate(2.5deg); }
  .fundly-wallet:hover .w-c2 { transform:translateY(-10px); }

  /* individual card hover */
  .w-card:hover { z-index:100 !important; transition-delay:0s !important; }
  .fundly-wallet:hover .w-c0:hover { transform:translateY(-58px) scale(1.05) rotate(0); }
  .fundly-wallet:hover .w-c1:hover { transform:translateY(-70px) scale(1.05) rotate(0); }
  .fundly-wallet:hover .w-c2:hover { transform:translateY(-60px) scale(1.05) rotate(0); }

  /* pocket */
  .w-pocket { position:absolute; bottom:0; width:260px; height:155px; z-index:40; filter:drop-shadow(0 15px 25px rgba(0,40,80,.4)); }
  .w-pocket-content {
    position:absolute; top:42px; width:100%; text-align:center; z-index:50;
    display:flex; flex-direction:column; align-items:center; gap:6px;
  }
  .w-bal-stars { color:${PC}; font-size:20px; letter-spacing:3px; transition:.3s; font-weight:800; }
  .w-bal-real  { color:#7dd3fc; font-size:19px; font-weight:700; opacity:0; position:absolute; top:0; left:50%; transform:translate(-50%,10px); transition:.3s; white-space:nowrap; }
  .fundly-wallet:hover .w-bal-stars { opacity:0; }
  .fundly-wallet:hover .w-bal-real  { opacity:1; transform:translate(-50%,0); }
  .fundly-wallet:hover .w-eye-slash { opacity:0; transform:scale(.5); }
  .fundly-wallet:hover .w-eye-open  { opacity:1; transform:scale(1.1); }
  .w-eye-wrap { margin-top:6px; height:20px; width:20px; position:relative; opacity:.35; transition:.3s; }
  .fundly-wallet:hover .w-eye-wrap  { opacity:1; }
  .w-eye { position:absolute; top:0; left:0; stroke:${PC}; transition:.3s; }

  /* ── Progress bar on cards ── */
  .w-progress { height:3px; border-radius:2px; background:rgba(255,255,255,.2); margin-top:4px; overflow:hidden; }
  .w-progress-fill { height:100%; border-radius:2px; background:rgba(255,255,255,.8); }

  /* ── Category pill ── */
  .cat-pill {
    display:inline-flex; align-items:center; gap:8px;
    padding:10px 18px; border-radius:100px;
    border:1.5px solid ${P}33; background:#fff;
    font-size:13px; font-weight:600; color:${PD};
    cursor:pointer; text-decoration:none;
    transition:all .2s ease;
    box-shadow:0 2px 8px ${P}12;
  }
  .cat-pill:hover {
    background:${P}; color:#fff; border-color:${P};
    transform:translateY(-2px);
    box-shadow:0 8px 20px ${P}30;
  }

  /* ── Latest project card ── */
  .latest-card {
    background:#fff; border-radius:18px;
    border:1.5px solid #e5e7eb;
    overflow:hidden; cursor:pointer; text-decoration:none;
    transition:transform .28s cubic-bezier(.34,1.56,.64,1), box-shadow .28s ease;
    display:block;
  }
  .latest-card:hover {
    transform:translateY(-6px) scale(1.018);
    box-shadow:0 20px 48px ${P}20;
    border-color:${P}55;
  }
  .latest-thumb {
    height:140px; background:linear-gradient(135deg,${PD},${P},${PC});
    display:flex; align-items:center; justify-content:center;
    font-size:40px; position:relative; overflow:hidden;
  }
  .latest-thumb-shimmer {
    position:absolute; inset:0;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);
    background-size:200% 100%;
    animation:shimmer 2.5s ease infinite;
  }
  .latest-body { padding:14px; }
  .latest-tag  {
    display:inline-block; padding:3px 10px; border-radius:100px;
    background:${PL}; color:${PD}; font-size:10px; font-weight:700;
    letter-spacing:.5px; margin-bottom:8px;
  }
  .latest-title {
    font-size:14px; font-weight:700; color:#111827;
    margin:0 0 10px; line-height:1.4;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  }
  .latest-prog-track { height:4px; background:#f3f4f6; border-radius:2px; overflow:hidden; margin-bottom:8px; }
  .latest-prog-fill  { height:100%; border-radius:2px; background:linear-gradient(90deg,${PD},${PC}); transition:width .6s ease; }
  .latest-meta { display:flex; justify-content:space-between; font-size:11px; color:#9ca3af; font-weight:500; }
  .latest-raised { font-weight:700; color:${P}; }

  /* ── Section heading ── */
  .section-head {
    display:flex; align-items:center; gap:12px; margin-bottom:24px;
  }
  .section-head-line { flex:1; height:1.5px; background:linear-gradient(90deg,${P}44,transparent); }
  .section-emoji { font-size:22px; animation:floatBob 3s ease-in-out infinite; }
`;

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function HomePage() {
  const navigate = useNavigate();

  const [topRated,   setTopRated]   = useState<Project[]>([]);
  const [latest,     setLatest]     = useState<Project[]>([]);
  const [featured,   setFeatured]   = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [errText,    setErrText]    = useState('');

  useEffect(() => {
    const id = 'home-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    return () => document.getElementById(id)?.remove();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [trRes, ltRes, ftRes, catRes] = await Promise.all([
          projectsApi.getTopRatedProjects(),
          projectsApi.getProjects(),
          projectsApi.getFeaturedProjects(),
          projectsApi.getCategories(),
        ]);
        setTopRated((trRes.data  ?? []).slice(0, 9));   // 3 wallets × 3
        setLatest(  (ltRes.data  ?? []).slice(0, 5));
        setFeatured((ftRes.data  ?? []).slice(0, 5));
        setCategories((catRes.data ?? []).slice(0, 12));
      } catch {
        setErrText('Something went wrong loading homepage data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = search.trim();
    if (v) navigate(`/projects?search=${encodeURIComponent(v)}`);
  };

  /* chunk array into groups of n */
  const chunk = <T,>(arr: T[], n: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

  const walletGroups = chunk(topRated, 3);

  return (
    <div style={{
      maxWidth: 1280, margin: '0 auto', padding: '40px 20px 80px',
      fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#F7FAFC', minHeight: '100vh',
    }}>

      {/* ═══ HERO ═══ */}
      <section style={{ marginBottom: 64, animation: 'fadeUp .4s ease both' }}>
        {/* decorative bubbles */}
        <div style={{ position: 'relative', marginBottom: 36 }}>
          {[
            { w: 320, h: 320, x: -60, y: -60, op: .04 },
            { w: 180, h: 180, x: '75%', y: -40, op: .06 },
          ].map((b, i) => (
            <div key={i} style={{
              position: 'absolute', borderRadius: '50%',
              width: b.w, height: b.h, left: b.x, top: b.y,
              background: `radial-gradient(circle, ${P}, ${PD})`,
              opacity: b.op, pointerEvents: 'none',
            }} />
          ))}

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 100,
              background: PL, border: `1.5px solid ${P}33`,
              marginBottom: 16, fontSize: 12, fontWeight: 700,
              color: PD, letterSpacing: '.5px',
            }}>
              <span style={{ animation: 'floatBob 2.5s ease-in-out infinite', fontSize: 14 }}>💙</span>
              FUNDLY — CROWDFUNDING PLATFORM
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem,5vw,3.4rem)', fontWeight: 800,
              color: '#111827', margin: '0 0 12px', lineHeight: 1.1,
            }}>
              Discover Projects,<br />
              <span style={{
                background: `linear-gradient(135deg, ${PD}, ${P}, ${PC})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Fund Dreams.
              </span>
            </h1>
            <p style={{ color: '#6b7280', fontSize: 16, margin: '0 0 32px', maxWidth: 480 }}>
              Browse campaigns you believe in and help bring ideas to life — one donation at a time.
            </p>

            {/* Gooey search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <GooeySearch value={search} onChange={setSearch} />
              <SearchBtn />
            </form>
          </div>
        </div>
      </section>

      {/* ═══ LOADING / ERROR ═══ */}
      {loading && <PageLoader />}
      {!loading && errText && (
        <div style={{
          padding: '20px 24px', borderRadius: 16,
          background: '#fef2f2', border: '1.5px solid #fca5a5',
          color: '#b91c1c', fontSize: 14, fontWeight: 600, marginBottom: 40,
        }}>
          😕 {errText}
        </div>
      )}

      {!loading && !errText && (
        <>
          {/* ═══ TOP RATED — Wallet stacks ═══ */}
          <section style={{ marginBottom: 64, animation: 'fadeUp .4s ease .1s both' }}>
            <SectionHead emoji="🏆" title="Top Rated Projects" sub="Hover the wallet to reveal projects" />
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 40,
              justifyContent: walletGroups.length < 3 ? 'flex-start' : 'space-between',
            }}>
              {walletGroups.map((group, gi) => (
                <ProjectWallet key={gi} projects={group} groupIndex={gi} navigate={navigate} />
              ))}
              {topRated.length === 0 && <EmptySlot label="No top rated projects yet" />}
            </div>
          </section>

          {/* ═══ LATEST ═══ */}
          <section style={{ marginBottom: 64, animation: 'fadeUp .4s ease .18s both' }}>
            <SectionHead emoji="✨" title="Latest Projects" sub="Fresh campaigns just launched" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 18 }}>
              {latest.map((p, i) => <LatestCard key={p.id} project={p} index={i} navigate={navigate} />)}
              {latest.length === 0 && <EmptySlot label="No projects yet" />}
            </div>
          </section>

          {/* ═══ FEATURED ═══ */}
          <section style={{ marginBottom: 64, animation: 'fadeUp .4s ease .26s both' }}>
            <SectionHead emoji="⭐" title="Featured Projects" sub="Hand-picked by our team" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 18 }}>
              {featured.map((p, i) => <LatestCard key={p.id} project={p} index={i} navigate={navigate} featured />)}
              {featured.length === 0 && <EmptySlot label="No featured projects yet" />}
            </div>
          </section>

          {/* ═══ CATEGORIES ═══ */}
          <section style={{ animation: 'fadeUp .4s ease .34s both' }}>
            <SectionHead emoji="🗂️" title="Browse by Category" sub="Find what inspires you" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/projects?category=${cat.id}`}
                  className="cat-pill"
                  style={{ animationDelay: `${i * 0.04}s`, animation: 'fadeUp .35s ease both' }}
                >
                  <span style={{ fontSize: 16 }}>{CAT_EMOJIS[i % CAT_EMOJIS.length]}</span>
                  {cat.name}
                </Link>
              ))}
              {categories.length === 0 && <EmptySlot label="No categories yet" />}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ─── Category emoji rotation ─── */
const CAT_EMOJIS = ['🌱','💡','🏥','🎓','🌊','🎨','🏗️','🤝','🌍','💻','🐾','🍀'];

/* ════════════════════ GOOEY SEARCH ════════════════════ */
function GooeySearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="gooey-wrap">
      {/* SVG goo filter */}
      <svg className="gooey-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="fundly-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* blobs */}
      <div className="gooey-bg-layer">
        <div className="g-blob g-blob-1" />
        <div className="g-blob g-blob-2" />
        <div className="g-blob g-blob-3" />
        <div className="g-bridge" />
      </div>

      {/* input overlay */}
      <div className="g-input-overlay">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ width: 18, height: 18, flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="g-input"
          type="text"
          placeholder="Search by project title or tag…"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <div className="g-focus-line" />
      </div>
    </div>
  );
}

/* ─── Search button ─── */
function SearchBtn() {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="submit"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '14px 28px', borderRadius: 14,
        background: hov ? PD : P,
        border: 'none', color: '#fff',
        fontWeight: 800, fontSize: 14, cursor: 'pointer',
        boxShadow: hov ? `0 8px 24px ${P}50` : `0 4px 14px ${P}30`,
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all .2s ease',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        whiteSpace: 'nowrap',
      }}
    >
      Search →
    </button>
  );
}

/* ════════════════════ PROJECT WALLET ════════════════════ */
function ProjectWallet({
  projects, groupIndex, navigate,
}: {
  projects: Project[];
  groupIndex: number;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const total = projects.reduce((s, p) => s + (parseFloat(String(p.total_donations ?? p.raised_amount ?? 0))), 0);
  const display = total > 0 ? `EGP ${Math.round(total).toLocaleString()}` : 'EGP —';

  return (
    <div className="fundly-wallet" style={{ animationDelay: `${groupIndex * .12}s` }}>
      <div className="wallet-back" />

      {/* project cards (up to 3) */}
      {projects.slice(0, 3).map((project, i) => {
        const pal     = CARD_PALETTES[i];
        const raised  = parseFloat(String(project.total_donations ?? project.raised_amount ?? 0));
        const target  = parseFloat(String(project.target ?? project.goal ?? 0));
        const pct     = target > 0 ? Math.min((raised / target) * 100, 100) : 0;
        const catName = typeof project.category === 'object' && project.category !== null
          ? (project.category as { name?: string }).name ?? 'Project'
          : 'Project';

        return (
          <div
            key={project.id}
            className={`w-card w-c${i}`}
            style={{ background: pal.bg, color: pal.text, animationDelay: `${0.1 + i * 0.1}s` }}
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="w-card-inner">
              <div className="w-card-top">
                <span style={{ color: pal.label, fontSize: 11 }}>{catName.toUpperCase()}</span>
                <div className="w-chip" style={{ background: pal.chip }} />
              </div>
              <div>
                <div className="w-progress" style={{ background: i === 2 ? `${PL}` : 'rgba(255,255,255,.15)' }}>
                  <div className="w-progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: i === 2
                        ? `linear-gradient(90deg, ${PD}, ${P})`
                        : 'rgba(255,255,255,.85)',
                    }}
                  />
                </div>
              </div>
              <div className="w-card-bottom">
                <div>
                  <span className="w-label" style={{ color: pal.label }}>Project</span>
                  <span className="w-value" style={{ color: pal.text, fontSize: 11 }}>{project.title}</span>
                </div>
                <div className="w-raised">
                  <span className="w-label" style={{ color: pal.label }}>Raised</span>
                  <span className="w-raised-num" style={{ color: pal.text }}>
                    {raised > 0 ? `EGP ${Math.round(raised).toLocaleString()}` : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* pocket */}
      <div className="w-pocket">
        <svg className="pocket-svg" viewBox="0 0 260 155" fill="none">
          <path
            d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 220 25 C 235 25, 240 10, 250 10 C 255 10, 260 10, 260 20 L 260 115 C 260 150, 242 155, 220 155 L 40 155 C 18 155, 0 150, 0 115 Z"
            fill={PDD}
          />
          <path
            d="M 8 22 C 8 16, 12 16, 14 16 C 22 16, 26 29, 40 29 L 220 29 C 234 29, 238 16, 246 16 C 248 16, 252 16, 252 22 L 252 115 C 252 146, 236 148, 220 148 L 40 148 C 24 148, 8 148, 8 115 Z"
            stroke="#1a5a8a"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
        </svg>
        <div className="w-pocket-content">
          <div style={{ position: 'relative', height: 24, width: '100%' }}>
            <div className="w-bal-stars">● ● ●</div>
            <div className="w-bal-real">{display}</div>
          </div>
          <div style={{ color: '#7dd3fc', fontSize: 11, fontWeight: 600 }}>Total Raised</div>
          <div className="w-eye-wrap">
            {/* eye-slash */}
            <svg className="w-eye w-eye-slash" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="3" x2="21" y2="21" />
            </svg>
            {/* eye-open */}
            <svg className="w-eye w-eye-open" style={{ opacity: 0 }} width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════ LATEST / FEATURED CARD ════════════════════ */
function LatestCard({
  project, index, navigate, featured = false,
}: {
  project: Project;
  index: number;
  navigate: ReturnType<typeof useNavigate>;
  featured?: boolean;
}) {
  const raised  = parseFloat(String(project.total_donations ?? project.raised_amount ?? 0));
  const target  = parseFloat(String(project.target ?? project.goal ?? 0));
  const pct     = target > 0 ? Math.min((raised / target) * 100, 100) : 0;
  const catName = typeof project.category === 'object' && project.category !== null
    ? (project.category as { name?: string }).name ?? ''
    : '';

  /* pick emoji from project title first letter */
  const emoji = PROJECT_EMOJIS[project.title?.charCodeAt(0) % PROJECT_EMOJIS.length] ?? '💙';

  return (
    <a
      className="latest-card"
      onClick={() => navigate(`/projects/${project.id}`)}
      style={{ animationDelay: `${index * .07}s`, animation: 'fadeUp .4s ease both', cursor: 'pointer' }}
    >
      {/* thumbnail */}
      <div
        className="latest-thumb"
        style={{
          background: featured
            ? `linear-gradient(135deg, ${PD}, ${P}, ${PC})`
            : `linear-gradient(135deg, ${THUMB_GRADS[index % THUMB_GRADS.length]})`,
        }}
      >
        <div className="latest-thumb-shimmer" />
        <span style={{ fontSize: 38, position: 'relative', zIndex: 1 }}>{emoji}</span>
        {featured && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(8px)',
            borderRadius: 100, padding: '3px 10px',
            fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '.5px',
          }}>
            ⭐ FEATURED
          </div>
        )}
      </div>

      <div className="latest-body">
        {catName && <span className="latest-tag">{catName}</span>}
        <p className="latest-title">{project.title}</p>

        {/* progress */}
        <div className="latest-prog-track">
          <div className="latest-prog-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="latest-meta">
          <span>{Math.round(pct)}% funded</span>
          <span className="latest-raised">
            {raised > 0 ? `EGP ${Math.round(raised).toLocaleString()}` : 'Be the first!'}
          </span>
        </div>
      </div>
    </a>
  );
}

/* ─── Thumb gradients ─── */
const THUMB_GRADS = [
  `${PD}, ${P}`, `${P}, ${PC}`, `#1e40af, ${P}`,
  `${PDD}, ${PD}`, `#0e7490, ${PC}`,
];

const PROJECT_EMOJIS = ['🌱','💡','🏥','🎓','🌊','🎨','🏗️','🤝','🌍','💻','🐾','🍀','❤️','🚀','🌟'];

/* ════════════════════ SECTION HEADING ════════════════════ */
function SectionHead({ emoji, title, sub }: { emoji: string; title: string; sub?: string }) {
  return (
    <div className="section-head">
      <span className="section-emoji">{emoji}</span>
      <div>
        <h2 style={{ fontSize: 'clamp(1.2rem,3vw,1.7rem)', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.1 }}>
          {title}
        </h2>
        {sub && <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0', fontWeight: 500 }}>{sub}</p>}
      </div>
      <div className="section-head-line" />
    </div>
  );
}

/* ════════════════════ EMPTY SLOT ════════════════════ */
function EmptySlot({ label }: { label: string }) {
  return (
    <div style={{
      padding: '32px 24px', borderRadius: 18,
      border: '1.5px dashed #d1d5db', background: '#fff',
      textAlign: 'center', color: '#9ca3af', fontSize: 13,
    }}>
      {label}
    </div>
  );
}

/* ════════════════════ PAGE LOADER ════════════════════ */
function PageLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '60px 0' }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${PL}`, borderTopColor: P, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>Loading Fundly…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}