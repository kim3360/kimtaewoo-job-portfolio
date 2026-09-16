import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type PortfolioCategory = {
  id: string;
  label: string;
  description: string;
};

interface PortfolioCategorySlideProps {
  category: PortfolioCategory;
  thumbnail: string;
  index: number;
  projectCount: number;
  isActive: boolean;
  arrowDirection: "left" | "right";
  onSelect: () => void;
}

export function PortfolioCategorySlide({
  category,
  thumbnail,
  index,
  projectCount,
  isActive,
  arrowDirection,
  onSelect,
}: PortfolioCategorySlideProps) {
  const Arrow = arrowDirection === "right" ? ArrowRight : ArrowLeft;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={cn(
        "portfolio-slide group text-left shrink-0",
        isActive && "portfolio-slide--active"
      )}
    >
      <span className="portfolio-slide__watermark" aria-hidden>
        {category.label[0]}
      </span>
      <span className="portfolio-slide__shine" aria-hidden />

      <div className="portfolio-slide__preview">
        <div
          className="portfolio-slide__preview-img"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
        <div className="portfolio-slide__preview-overlay" />
        <div className="portfolio-slide__preview-meta">
          <span className="portfolio-slide__index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="portfolio-slide__count">
            {projectCount} project{projectCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="portfolio-slide__body">
        <div className="portfolio-slide__title-wrap">
          <h3 className="portfolio-slide__title">{category.label}</h3>
          {isActive && (
            <span className="portfolio-slide__active-badge">Selected</span>
          )}
        </div>

        <div
          className={cn(
            "portfolio-slide__journey",
            arrowDirection === "left" && "portfolio-slide__journey--reverse"
          )}
        >
          {arrowDirection === "left" && (
            <span className="portfolio-slide__arrow-btn" aria-hidden>
              <Arrow className="w-3.5 h-3.5" />
            </span>
          )}
          <p className="portfolio-slide__journey-text">{category.description}</p>
          <span className="portfolio-slide__journey-line" aria-hidden />
          {arrowDirection === "right" && (
            <span className="portfolio-slide__arrow-btn" aria-hidden>
              <Arrow className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
