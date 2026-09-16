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

      <motion.div
        className="id-badge__swing"
        animate={{ rotate: [-4, 4, -4] }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "top center" }}
      >
        <motion.div
          className="id-badge__card"
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
