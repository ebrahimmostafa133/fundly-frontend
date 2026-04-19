//import { P, PC, PD } from '../styles/homeStyles';

export function GooeySearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="gooey-wrap">
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

      <div className="gooey-bg-layer">
        <div className="g-blob g-blob-1" />
        <div className="g-blob g-blob-2" />
        <div className="g-blob g-blob-3" />
        <div className="g-bridge" />
      </div>

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