import { useNavigate } from 'react-router-dom';
import type { Category } from '../../../types/project.types';
import type { ExtendedProject } from '../types/home.types';
import { CARD_PALETTES, PDD, PL, PD, P } from '../styles/homeStyles';

function getProjectImage(project: ExtendedProject): string | null {
  if (project.images && project.images.length > 0) {
    const firstImage = project.images[0];
    if (firstImage && firstImage.image) {
      return firstImage.image;
    }
  }
  return null;
}

// Star rating component for wallet cards
function StarRatingSmall({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} style={{ color: '#fbbf24', fontSize: 8 }}>★</span>
      ))}
      {hasHalfStar && (
        <span style={{ color: '#fbbf24', fontSize: 8 }}>½</span>
      )}
    </div>
  );
}

export function CategoryWallet({
  category,
  projects,
  totalRaised,
  index,
}: {
  category: Category;
  projects: ExtendedProject[];
  totalRaised: number;
  index: number;
}) {
  const navigate = useNavigate();
  const display = totalRaised > 0 ? `EGP ${Math.round(totalRaised).toLocaleString()}` : 'EGP 0';

  return (
    <div className="fundly-wallet" style={{ animationDelay: `${index * .1}s` }}>
      <div className="wallet-back" />

      {projects.slice(0, 3).map((project: ExtendedProject, i: number) => {
        const pal = CARD_PALETTES[i % CARD_PALETTES.length];
        const raised = project.total_donations || 0;
        const target = project.target || 1;
        const progress = project.progress || 0;
        const imageUrl = getProjectImage(project);
        const rating = project.average_rating || 0;

        return (
          <div
            key={project.id}
            className={`w-card w-c${i}`}
            style={{ background: pal.bg, color: pal.text, animationDelay: `${0.1 + i * 0.1}s` }}
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={project.title}
                className="w-card-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="w-card-inner">
              <div className="w-card-top">
                <span style={{ color: pal.label, fontSize: 11 }}>{category.name.toUpperCase()}</span>
                <StarRatingSmall rating={rating} />
              </div>
              <div>
                <div className="w-progress" style={{ background: i === 2 ? `${PL}` : 'rgba(255,255,255,.15)' }}>
                  <div className="w-progress-fill"
                    style={{
                      width: `${progress}%`,
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
              <div style={{ fontSize: 9, marginTop: 4, color: pal.label }}>
                {Math.round(progress)}% of EGP {Math.round(target).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}

      <div className="w-pocket">
        <svg className="pocket-svg" viewBox="0 0 280 170" fill="none">
          <path
            d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 240 25 C 255 25, 260 10, 270 10 C 275 10, 280 10, 280 20 L 280 125 C 280 160, 262 165, 240 165 L 40 165 C 18 165, 0 160, 0 125 Z"
            fill={PDD}
          />
          <path
            d="M 8 22 C 8 16, 12 16, 14 16 C 22 16, 26 29, 40 29 L 240 29 C 254 29, 258 16, 266 16 C 268 16, 272 16, 272 22 L 272 125 C 272 156, 256 158, 240 158 L 40 158 C 24 158, 8 158, 8 125 Z"
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
          <div style={{ color: '#7dd3fc', fontSize: 11, fontWeight: 600 }}>{category.name}</div>
          <div style={{ color: '#7dd3fc', fontSize: 10, opacity: 0.8 }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} • Total raised
          </div>
          <div className="w-eye-wrap">
            <svg className="w-eye w-eye-slash" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="3" x2="21" y2="21" />
            </svg>
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