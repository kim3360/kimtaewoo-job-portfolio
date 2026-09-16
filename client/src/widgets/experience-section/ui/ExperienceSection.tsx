import { SectionHeading } from "@/shared/ui/SectionHeading"
import { experiences } from "@/entities/experience"
import { education } from "@/entities/education"
import { motion } from "framer-motion"

type TimelineItem = {
  startYear: string
  endYear: string
  title: string
  company: string
  location?: string
  description: string
  tags: string[]
}

const parsePeriod = (period: string) => {
  const normalized = period.replace(/\./g, "").trim()
  if (period.includes("재학")) {
    const start = period.match(/\d{4}/)?.[0] ?? ""
    return { startYear: start, endYear: "now" }
  }
  const parts = period.split(/[~\-\–]/).map((p) => p.trim())
  const extractYear = (s: string) => s.match(/\d{4}/)?.[0] ?? s
  return {
    startYear: extractYear(parts[0] ?? ""),
    endYear: extractYear(parts[1] ?? "now"),
  }
}

const timelineItems: TimelineItem[] = [
  ...experiences.map((exp) => {
    const { startYear, endYear } = parsePeriod(exp.period)
    return {
      startYear,
      endYear,
      title: exp.title,
      company: exp.company,
      description: exp.description,
      tags: ["react native", "rest api", "mobile"],
    }
  }),
  ...education.map((edu) => {
    const { startYear, endYear } = parsePeriod(edu.period)
    return {
      startYear,
      endYear,
      title: edu.school,
      company: edu.degree,
      description: edu.description,
      tags: ["computer science", "web development"],
    }
  }),
]

export const ExperienceComponent = () => {
  return (
    <section id="experience" className="section-padding">
      <div className="container">
        <SectionHeading subtitle="Career & Education" title="Experience" />

        <div className="space-y-0">
          {timelineItems.map((item, index) => (
            <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: index * 0.05 }} className="grid md:grid-cols-[120px_1fr] gap-8 md:gap-16 py-12 md:py-16 border-t border-border/80 group relative card-shine">
              <div className="absolute left-0 top-12 bottom-12 w-px bg-gradient-to-b from-pearl-accent/0 via-pearl-accent/20 to-pearl-accent/0 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
              <div className="flex md:flex-col gap-2 text-sm font-semibold tracking-wider">
                <span className="text-pearl-accent/80">{item.startYear}</span>
                <span className="hidden md:block text-border">—</span>
                <span className="text-muted-foreground">
                  {item.endYear === "now" ? (
                    <span className="inline-flex items-center gap-1.5">
                      now
                      <span className="w-1.5 h-1.5 rounded-full bg-pearl-accent animate-pulse" />
                    </span>
                  ) : (
                    item.endYear
                  )}
                </span>
              </div>

              <div className="space-y-5 pl-0 md:pl-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 group-hover:gradient-text-static transition-all">{item.title}</h3>
                  <p className="text-muted-foreground font-medium">{item.company}</p>
                </div>
                <p className="text-muted-foreground leading-[1.75] max-w-3xl text-sm md:text-base">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
