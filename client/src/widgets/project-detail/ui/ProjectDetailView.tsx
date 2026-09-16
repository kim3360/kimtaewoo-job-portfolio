import { useRef } from "react"
import { Link } from "wouter"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { ArrowLeft, Briefcase, CheckCircle2, ChevronLeft, ChevronRight, Clock, ExternalLink, FileDown, Github, Users } from "lucide-react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/autoplay"

import type { Project } from "@/entities/project/lib/projectRoutes"
import { getSkillIcon } from "@/entities/skill/lib/skillIcons"
import { Button } from "@/shared/ui/button"

type ProjectDetailViewProps = {
  project: Project
}

function isStructuredDetails(details: Project["details"]): details is { Problem: string; Cause: string; Solution: string; Result: string } {
  return typeof details === "object" && details !== null && "Problem" in details
}

function hasDetailsContent(details: Project["details"]): boolean {
  if (!details) return false
  if (typeof details === "string") return details.trim().length > 0
  return Object.values(details).some((value) => value.trim().length > 0)
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)

  return (
    <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="project-detail section-padding">
      <div className="container">
        <Link href="/#portfolio" className="project-detail__back inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-pearl-accent transition-colors mb-8 md:mb-10">
          <ArrowLeft className="w-4 h-4" />
          Portfolio로 돌아가기
        </Link>

        <header className="project-detail__header flex items-center gap-4 md:gap-5 mb-8 md:mb-10 pb-6 border-b border-border/60">
          {project.logo ? <img src={project.logo} alt={`${project.title} logo`} className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-contain" /> : null}
          <div>
            <p className="text-xs md:text-sm font-medium text-pearl-accent tracking-wide mb-1">Project</p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{project.title}</h1>
            {project.period ? <p className="text-sm text-muted-foreground mt-2">{project.period}</p> : null}
          </div>
        </header>

        {project.image.length > 0 ? (
          <div className="project-detail__gallery relative mb-10 md:mb-12">
            <style>{`
              .project-swiper .swiper-pagination-bullet {
                background: rgba(156, 163, 175, 0.5) !important;
                opacity: 1;
              }
              .project-swiper .swiper-pagination-bullet-active {
                background: var(--pearl-accent) !important;
              }
            `}</style>

            {project.image.length > 1 ? (
              <>
                <button ref={prevRef} type="button" aria-label="이전 이미지" className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/60 text-white shadow-lg backdrop-blur hover:bg-primary transition-all flex items-center justify-center">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button ref={nextRef} type="button" aria-label="다음 이미지" className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/60 text-white shadow-lg backdrop-blur hover:bg-primary transition-all flex items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            ) : null}

            {project.image.length === 1 ? (
              <div className="flex justify-center items-center">
                {project.type === "web" ? (
                  <div className="relative w-full max-w-[960px] xl:max-w-[1100px] aspect-[760/469] overflow-hidden rounded-xl shadow-inner border border-border/40">
                    <img src={project.image[0]} alt={`${project.title} - 이미지`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative w-[220px] h-[470px] md:w-[240px] md:h-[510px] rounded-[2rem] overflow-hidden bg-black shadow-inner border border-border/40">
                    <img src={project.image[0]} alt={`${project.title} - 이미지`} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                loop={project.image.length > 1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                    swiper.params.navigation.prevEl = prevRef.current
                    swiper.params.navigation.nextEl = nextRef.current
                  }
                }}
                pagination={project.type === "mobile" ? { clickable: true, dynamicBullets: true } : { clickable: true }}
                slidesPerView={1}
                spaceBetween={project.type === "web" ? 24 : 10}
                {...(project.type !== "web" && {
                  breakpoints: {
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    640: { slidesPerView: 2, spaceBetween: 15 },
                    1024: { slidesPerView: 3, spaceBetween: 20 },
                  },
                })}
                className={project.type === "web" ? "project-swiper project-swiper--web rounded-xl overflow-hidden" : "project-swiper h-[400px] md:h-[440px] lg:h-[480px] overflow-visible rounded-3xl"}
              >
                {project.image.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex justify-center items-center">
                      {project.type === "web" ? (
                        <div className="relative w-full max-w-[960px] xl:max-w-[1100px] aspect-[760/469] overflow-hidden rounded-xl shadow-inner border border-border/40">
                          <img src={img} alt={`${project.title} - 이미지 ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="relative w-[200px] h-[430px] md:w-[220px] md:h-[470px] rounded-[2rem] overflow-hidden bg-black shadow-inner">
                          <img src={img} alt={`${project.title} - 이미지 ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        ) : null}

        <div className="project-detail__body grid gap-10 md:gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="space-y-8 md:space-y-10 min-w-0">
            <section>
              <h2 className="text-lg md:text-xl font-semibold mb-3">프로젝트 설명</h2>
              <p className="text-muted-foreground leading-relaxed md:text-lg">{project.Projectdescription ?? project.description}</p>
            </section>

            {project.features && project.features.length > 0 ? (
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-4">주요 기능</h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li key={feature.title} className="rounded-xl border border-border/50 bg-muted/20 p-4 md:p-5">
                      <h3 className="text-sm md:text-base font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {project.responsibilities && project.responsibilities.length > 0 ? (
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-4">담당 업무</h2>
                <ul className="space-y-2.5">
                  {project.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-muted-foreground text-sm md:text-base leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-pearl-accent shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {project.achievements && project.achievements.length > 0 ? (
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-4">성과</h2>
                <ul className="space-y-2.5">
                  {project.achievements.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-muted-foreground text-sm md:text-base leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-pearl-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {hasDetailsContent(project.details) ? (
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-4">트러블 슈팅</h2>
                {isStructuredDetails(project.details) ? (
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-5 md:p-6 lg:p-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-pearl-accent">Problem</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">{project.details.Problem}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-pearl-accent">Cause</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">{project.details.Cause}</p>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-pearl-accent">Solution</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">{project.details.Solution}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-pearl-accent">Result</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">{project.details.Result}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-5 md:p-6">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">{project.details}</p>
                  </div>
                )}
              </section>
            ) : null}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <section>
              <h2 className="text-lg font-semibold mb-3">기술 스택</h2>
              <div className="flex flex-wrap gap-2.5">
                {project.tags.map((tag) => {
                  const { Icon, color } = getSkillIcon(tag)
                  return (
                    <div key={tag} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
                      <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
                      <span className="text-xs md:text-sm font-medium">{tag}</span>
                    </div>
                  )
                })}
              </div>
            </section>

            {(project.members || project.period || project.pdf) && (
              <section className="rounded-xl border border-border/50 p-5 space-y-4">
                {project.members ? (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">참여인원</h3>
                    <div className="flex items-start gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{project.members}</span>
                    </div>
                  </div>
                ) : null}
                {project.period ? (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">기간</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{project.period}</span>
                    </div>
                  </div>
                ) : null}
                {project.pdf ? (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">PDF</h3>
                    <a href={project.pdf} download className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                      <FileDown className="w-4 h-4" />
                      PDF 다운로드
                    </a>
                  </div>
                ) : null}
              </section>
            )}

            <div className="flex flex-col gap-3">
              {project.liveDemo ? (
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    라이브 데모
                  </Button>
                </a>
              ) : (
                <Button disabled className="w-full opacity-60">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  라이브 데모
                </Button>
              )}
              {project.github ? (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </motion.article>
  )
}
