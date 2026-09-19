import { motion } from "framer-motion";
import { profile } from "@/entities/profile";

const BADGE_IMAGE = "/assets/aboutme.jpeg";

export function IdBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.15 }}
      className="id-badge"
      aria-label={`${profile.name} 프로필`}
    >
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
              alt={profile.name}
              className="id-badge__photo"
            />
            <span className="id-badge__gloss" aria-hidden />
            <span className="id-badge__shine" aria-hidden />
          </div>
          <div className="id-badge__footer">
            <p className="id-badge__name">{profile.name}</p>
            <p className="id-badge__role">{profile.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
