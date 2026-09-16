import { projects, getProjectPath } from "@/entities/project"
import { PORTFOLIO_CATEGORIES } from "@/entities/site"
import { useState } from "react"
import { Link } from "wouter"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Marquee, MarqueeItem } from "@/shared/ui/Marquee"
import { cn } from "@/shared/lib/utils"
import { PortfolioProjectSlide } from "./PortfolioProjectSlide"

export const ProjectComponent = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const activeCat = PORTFOLIO_CATEGORIES.find((c) => c.id === activeCategory)
  const filteredProjects = activeCat ? projects.filter((p) => (activeCat.projects as readonly string[]).includes(p.title)) : projects

  const toggleCategory = (id: string) => {
    setActiveCategory((prev) => (prev === id ? null : id))
  }

  return (
    <section id="portfolio" className="portfolio-section section-padding section-glow relative overflow-hidden">
      <div className="portfolio-section__glow" aria-hidden />

      <div className="container relative z-10 mb-8 md:mb-12">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="portfolio-section__header">
          <p className="portfolio-section__eyebrow">Portfolio</p>
          <h2 className="portfolio-section__title hero-headline">Selected Works</h2>
          <p className="portfolio-section__subtitle">카테고리를 선택하면 아래 프로젝트가 필터됩니다 </p>
          <div className="portfolio-section__header-line" aria-hidden />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="portfolio-filters" role="tablist" aria-label="프로젝트 카테고리">
          <button type="button" role="tab" aria-selected={!activeCategory} onClick={() => setActiveCategory(null)} className={cn("portfolio-filter", !activeCategory && "portfolio-filter--active")}>
            All
          </button>
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button key={cat.id} type="button" role="tab" aria-selected={activeCategory === cat.id} onClick={() => toggleCategory(cat.id)} className={cn("portfolio-filter", activeCategory === cat.id && "portfolio-filter--active")}>
              {cat.label}
            </button>
          ))}
        </motion.div>
      </div>

      <div className="portfolio-marquee-wrap portfolio-marquee-wrap--primary relative z-10 mb-4 md:mb-6 py-3">
        <Marquee speed="portfolio" pauseOnHover>
          {projects.map((project, index) => (
            <MarqueeItem key={project.slug} separator={false} nowrap={false} className="px-2 md:px-3">
              <PortfolioProjectSlide project={project} index={index} />
            </MarqueeItem>
          ))}
        </Marquee>
      </div>

      <div className="portfolio-marquee-wrap portfolio-marquee-wrap--ghost relative z-10 mb-16 md:mb-24 opacity-35 pointer-events-none hidden md:block">
        <Marquee speed="portfolio" reverse>
          {projects.map((project) => (
            <MarqueeItem key={`ghost-${project.slug}`} separator={false} nowrap={false} className="px-2 md:px-3">
              <div className="portfolio-slide portfolio-slide--ghost" aria-hidden>
                <div className="portfolio-slide__preview min-h-[120px]">
                  <div className="portfolio-slide__preview-img opacity-30" style={{ backgroundImage: `url(${project.thumbnail})` }} />
                </div>
              </div>
            </MarqueeItem>
          ))}
        </Marquee>
      </div>

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="portfolio-projects-head">
          <span className="portfolio-projects-head__line" aria-hidden />
          <p className="portfolio-projects-head__label">{activeCategory ? `${activeCat?.label ?? ""} · ${filteredProjects.length} works` : `All · ${filteredProjects.length} works`}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {filteredProjects.map((project, index) => (
            <Link key={project.slug} href={getProjectPath(project.slug)}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} whileHover={{ y: -4 }} className="portfolio-project-card group text-left cursor-pointer">
                <span className="portfolio-project-card__num">{String(index + 1).padStart(2, "0")}</span>
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full group-hover:scale-105 transition-transform duration-700" />
                  <div className="portfolio-project-card__overlay" />
                  <div className="portfolio-project-card__view">View project</div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h4 className="text-xl md:text-2xl font-bold group-hover:text-pearl-accent transition-colors">{project.title}</h4>
                    <ArrowUpRight className="w-5 h-5 shrink-0 text-pearl-accent opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{project.description}</p>
                  {project.period ? <p className="text-[10px] tracking-[0.2em] uppercase text-pearl-accent/60 mt-4">{project.period}</p> : null}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
