import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Link } from "wouter"
import type { Project } from "@/entities/project"
import { getProjectPath } from "@/entities/project"

type PortfolioProjectSlideProps = {
  project: Project
  index: number
}

export function PortfolioProjectSlide({ project, index }: PortfolioProjectSlideProps) {
  const typeLabel = project.type === "mobile" ? "MOBILE" : "WEB"
  const journeyText = project.type === "mobile" ? "Explore my journey in Mobile" : "Explore my journey in Web"

  return (
    <Link href={getProjectPath(project.slug)} className="block">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="portfolio-slide group text-left shrink-0 cursor-pointer"
      >
        <span className="portfolio-slide__watermark" aria-hidden>
          {project.title[0]}
        </span>
        <span className="portfolio-slide__shine" aria-hidden />

        <div className="portfolio-slide__preview">
          <div className="portfolio-slide__preview-img" style={{ backgroundImage: `url(${project.thumbnail})` }} />
          <div className="portfolio-slide__preview-overlay" />
          <div className="portfolio-slide__preview-meta">
            <span className="portfolio-slide__index">{String(index + 1).padStart(2, "0")}</span>
            <span className="portfolio-slide__count">{typeLabel}</span>
          </div>
        </div>

        <div className="portfolio-slide__body">
          <h3 className="portfolio-slide__title portfolio-slide__title--project">{project.title}</h3>
          <p className="portfolio-slide__description">{project.description}</p>
          <div className="portfolio-slide__journey">
            <p className="portfolio-slide__journey-text">{journeyText}</p>
            <span className="portfolio-slide__journey-line" aria-hidden />
            <span className="portfolio-slide__arrow-btn" aria-hidden>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
