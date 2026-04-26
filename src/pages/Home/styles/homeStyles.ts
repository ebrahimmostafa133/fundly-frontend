/* ─── Theme ─── */
export const P   = '#10b981'; // primary 500
export const PD  = '#059669'; // primary 600
export const PDD = '#047857'; // primary 700
export const PL  = '#ecfdf5'; // primary 50
export const PC  = '#34d399'; // primary 400

export const CARD_PALETTES = [
  { bg: PD,  text: '#fff', chip: 'rgba(255,255,255,0.2)',  label: 'rgba(255,255,255,0.65)' },
  { bg: P,   text: '#fff', chip: 'rgba(255,255,255,0.2)',  label: 'rgba(255,255,255,0.65)' },
  { bg: '#fff', text: PDD, chip: 'rgba(0,63,107,0.08)', label: '#6b91aa' },
];

export const CAT_EMOJIS = ['🌱','💡','🏥','🎓','🌊','🎨','🏗️','🤝','🌍','💻','🐾','🍀'];

export const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes floatBob{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

  @keyframes blobFloat {
    0%   { border-radius:40% 60% 70% 30%/40% 50% 60% 50%; transform:translate(0,0); }
    50%  { border-radius:60% 40% 50% 50%/30% 60% 40% 70%; transform:translate(5px,-5px); }
    100% { border-radius:50% 50% 30% 70%/60% 40% 60% 40%; transform:translate(-5px,5px); }
  }

  @keyframes slideIntoPocket {
    0%   { transform:translateY(-100px); opacity:0; }
    100% { transform:translateY(0);      opacity:1; }
  }

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

  .fundly-wallet {
    position:relative; width:280px; height:240px;
    cursor:pointer; perspective:1000px;
    display:flex; justify-content:center; align-items:flex-end;
    transition:transform .4s ease;
  }
  .fundly-wallet:hover { transform:translateY(-6px); }
  .wallet-back {
    position:absolute; bottom:0; width:280px; height:210px;
    background:${PDD};
    border-radius:22px 22px 60px 60px; z-index:5;
    box-shadow:inset 0 25px 35px rgba(0,0,0,.4), inset 0 5px 15px rgba(0,0,0,.5);
  }

  .w-card {
    position:absolute; width:264px; height:150px; left:8px;
    border-radius:16px; padding:16px; color:#fff;
    box-shadow:inset 0 1px 1px rgba(255,255,255,.3), 0 -4px 15px rgba(0,0,0,.1);
    transition:transform .6s cubic-bezier(.34,1.56,.64,1);
    animation:slideIntoPocket .8s cubic-bezier(.2,.8,.2,1) backwards;
    cursor:pointer;
    overflow:hidden;
  }
  .w-card-img {
    position:absolute; top:0; left:0; width:100%; height:100%;
    object-fit:cover; opacity:0.15; z-index:0;
  }
  .w-card-inner { 
    position:relative; z-index:1;
    display:flex; flex-direction:column; justify-content:space-between; 
    height:100%; 
  }
  .w-card-top   { display:flex; justify-content:space-between; align-items:center; font-size:12px; text-transform:uppercase; letter-spacing:1px; font-weight:700; }
  .w-chip       { width:30px; height:22px; background:rgba(255,255,255,.2); border-radius:4px; border:1px solid rgba(255,255,255,.15); }
  .w-card-bottom{ display:flex; justify-content:space-between; align-items:flex-end; }
  .w-label      { font-size:7px; opacity:.7; text-transform:uppercase; margin-bottom:2px; display:block; }
  .w-value      { font-size:11px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px; }
  .w-raised     { text-align:right; }
  .w-raised-num { font-size:14px; font-weight:800; letter-spacing:-.5px; }

  .w-c0 { background:${PD}; bottom:100px; z-index:10; animation-delay:.1s; }
  .w-c1 { background:${P};  bottom:72px; z-index:20; animation-delay:.2s; }
  .w-c2 { background:#fff; color:${PDD}; bottom:44px; z-index:30; animation-delay:.3s; }
  .w-c2 .w-chip { background:rgba(0,63,107,.06); }

  .fundly-wallet:hover .w-c0 { transform:translateY(-82px) rotate(-4deg); }
  .fundly-wallet:hover .w-c1 { transform:translateY(-54px) rotate(2.5deg); }
  .fundly-wallet:hover .w-c2 { transform:translateY(-20px); }

  .w-card:hover { z-index:100 !important; transition-delay:0s !important; }
  .fundly-wallet:hover .w-c0:hover { transform:translateY(-68px) scale(1.05) rotate(0); }
  .fundly-wallet:hover .w-c1:hover { transform:translateY(-80px) scale(1.05) rotate(0); }
  .fundly-wallet:hover .w-c2:hover { transform:translateY(-70px) scale(1.05) rotate(0); }

  .w-pocket { position:absolute; bottom:0; width:280px; height:170px; z-index:40; filter:drop-shadow(0 15px 25px rgba(0,40,80,.4)); }
  .w-pocket-content {
    position:absolute; top:48px; width:100%; text-align:center; z-index:50;
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

  .w-progress { height:3px; border-radius:2px; background:rgba(255,255,255,.2); margin-top:4px; overflow:hidden; }
  .w-progress-fill { height:100%; border-radius:2px; background:rgba(255,255,255,.8); }

  .cat-pill {
    display:inline-flex; align-items:center; gap:8px;
    padding:10px 18px; border-radius:100px;
    border:1.5px solid ${P}33; background:#fff;
    font-size:13px; font-weight:600; color:${PD};
    cursor:pointer;
    transition:all .2s ease;
    box-shadow:0 2px 8px ${P}12;
  }
  .cat-pill:hover {
    background:${P}; color:#fff; border-color:${P};
    transform:translateY(-2px);
    box-shadow:0 8px 20px ${P}30;
  }
  .cat-pill-active {
    background:${P}; color:#fff; border-color:${P};
  }

  .latest-card {
    background:#fff; border-radius:18px;
    border:1.5px solid #e5e7eb;
    overflow:hidden; cursor:pointer;
    transition:transform .28s cubic-bezier(.34,1.56,.64,1), box-shadow .28s ease;
    display:block;
  }
  .latest-card:hover {
    transform:translateY(-6px) scale(1.018);
    box-shadow:0 20px 48px ${P}20;
    border-color:${P}55;
  }
  .latest-thumb {
    height:160px; position:relative; overflow:hidden;
    background:#f0f9ff;
  }
  .latest-thumb-img {
    width:100%; height:100%; object-fit:cover;
    transition:transform .3s ease;
  }
  .latest-card:hover .latest-thumb-img {
    transform:scale(1.05);
  }
  .latest-thumb-shimmer {
    position:absolute; inset:0;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
    background-size:200% 100%;
    animation:shimmer 2.5s ease infinite;
    pointer-events:none;
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

  .section-head {
    display:flex; align-items:center; gap:12px; margin-bottom:24px;
  }
  .section-head-line { flex:1; height:1.5px; background:linear-gradient(90deg,${P}44,transparent); }
  .section-emoji { font-size:22px; animation:floatBob 3s ease-in-out infinite; }

  .category-wallet-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));
    gap:30px;
    margin-top:20px;
  }
`;