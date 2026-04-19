import { useNavigate } from 'react-router-dom';
import { PD } from '../styles/homeStyles';
import type { ExtendedProject } from '../types/home.types';

function getProjectImage(project: ExtendedProject): string | null {
  if (project.images && project.images.length > 0) {
    const firstImage = project.images[0];
    if (firstImage && firstImage.image) {
      return firstImage.image;
    }
  }
  return null;
}

// Star rating component
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} style={{ color: '#fbbf24', fontSize: 12 }}>★</span>
      ))}
      {hasHalfStar && (
        <span style={{ color: '#fbbf24', fontSize: 12 }}>½</span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} style={{ color: '#d1d5db', fontSize: 12 }}>☆</span>
      ))}
      <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 4 }}>
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

export function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: ExtendedProject;
  index: number;
  featured?: boolean;
}) {
  const navigate = useNavigate();
  
  // Use progress directly from API (it's already a percentage)
  const progress = project.progress || project.calculated_progress || 0;
  const raised = project.total_donations || 0;
  const target = project.target || 1;
  const category = project.category?.name || '';
  const rating = project.average_rating || 0;
  const donationCount = project.donations_count || 0;
  const imageUrl = getProjectImage(project);
  const fallbackImage = `https://placehold.co/400x300/${PD.replace('#', '')}/ffffff?text=${encodeURIComponent(project.title?.slice(0, 20) || 'Project')}`;

  return (
    <div
      className="latest-card"
      onClick={() => navigate(`/projects/${project.id}`)}
      style={{ animationDelay: `${index * .07}s`, animation: 'fadeUp .4s ease both', cursor: 'pointer' }}
    >
      <div className="latest-thumb">
        <img 
          src={imageUrl || fallbackImage}
          alt={project.title}
          className="latest-thumb-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="latest-thumb-shimmer" />
        {featured && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            borderRadius: 100, padding: '3px 10px',
            fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '.5px',
            zIndex: 2,
          }}>
            ⭐ FEATURED
          </div>
        )}
      </div>

      <div className="latest-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          {category && <span className="latest-tag">{category}</span>}
          <StarRating rating={rating} />
        </div>
        <p className="latest-title">{project.title}</p>

        <div className="latest-prog-track">
          <div className="latest-prog-fill" style={{ width: `${Math.min(Math.round(progress), 100)}%` }} />
        </div>
        <div className="latest-meta">
          <span>{Math.round(progress)}% funded</span>
          <span className="latest-raised">
            {raised > 0 ? `EGP ${Math.round(raised).toLocaleString()}` : 'Be the first!'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9ca3af', marginTop: 6 }}>
          <span>Target: EGP {Math.round(target).toLocaleString()}</span>
          <span>{donationCount} donation{donationCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}