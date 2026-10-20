import { profile } from "@/entities/profile";

const BADGE_IMAGE = "/assets/profile-id.png";

export function IdBadge() {
  return (
    <div className="id-badge" aria-label={`${profile.name} 프로필`}>
      <div className="id-badge__hanger" aria-hidden>
        <span className="id-badge__strap-glow" />
        <span className="id-badge__strap" />
        <span className="id-badge__clip">
          <span className="id-badge__clip-hole" />
        </span>
      </div>

      <div className="id-badge__swing">
        <div className="id-badge__card">
          <div className="id-badge__photo-wrap">
            <img
              src={BADGE_IMAGE}
              alt={`${profile.name} 증명사진`}
              className="id-badge__photo"
            />
            <span className="id-badge__gloss" aria-hidden />
          </div>
          <div className="id-badge__footer">
            <p className="id-badge__name">{profile.name}</p>
            <p className="id-badge__role">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
