export function SectionHead({ emoji, title, sub }: { emoji: string; title: string; sub?: string }) {
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