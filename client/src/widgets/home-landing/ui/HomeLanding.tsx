import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TimelineRow } from "@/shared/ui/TimelineRow";
import { profile, activities, awards, internships } from "@/entities/profile";
import { education } from "@/entities/education";
import { getSkillIcon, landingSkillGroups } from "@/entities/skill";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { IdBadge } from "./IdBadge";

function LandingSectionHead({ children }: { children: ReactNode }) {
  return <h2 className="landing-section-head">{children}</h2>;
}

export function HomeLanding() {
  return (
    <section id="home" className="landing-screen relative flex flex-col pt-14 md:pt-16">
      <div className="container landing-layout flex-1 flex flex-col min-h-0 py-3 md:py-4 relative z-10">
        <div className="landing-columns flex-1 min-h-0">
          {/* 좌측 */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="landing-col landing-col--left min-h-0"
          >
            <h1 className="landing-career-title shrink-0">CAREER</h1>
            <div className="landing-badge-wrap shrink-0">
              <IdBadge />
            </div>
            <section className="landing-about-panel flex-1 min-h-0 flex flex-col">
              <LandingSectionHead>About Me</LandingSectionHead>
              <div className="flex-1 min-h-0 overflow-y-auto landing-panel__scroll">
                <p className="landing-about text-xs md:text-sm text-foreground/85 leading-[1.8] whitespace-pre-line">
                  {profile.aboutFrontend}
                </p>
              </div>
            </section>
          </motion.aside>

          {/* 중앙+우측: Education | Activities + Skills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="landing-col landing-col--split min-h-0"
          >
            <div className="landing-stack landing-stack--left">
              <section className="landing-block landing-block--edu">
                <LandingSectionHead>Education</LandingSectionHead>
                <div className="landing-timeline">
                  {education.map((edu, i) => (
                    <TimelineRow
                      key={edu.school}
                      compact
                      period={edu.period.replace(" ~ ", " – ")}
                      title={edu.school}
                      subtitle={edu.degree}
                      isLast={i === education.length - 1}
                    />
                  ))}
                </div>
              </section>

              <section className="landing-block landing-block--act">
                <LandingSectionHead>Activities</LandingSectionHead>
                <div className="landing-timeline landing-timeline--activities">
                  {activities.map((item, i) => (
                    <TimelineRow
                      key={item.title}
                      compact
                      period={item.period}
                      title={item.title}
                      subtitle={item.subtitle}
                      isLast={i === activities.length - 1}
                    />
                  ))}
                </div>
              </section>
            </div>

            <div className="landing-stack landing-stack--right">
              <section className="landing-block landing-block--intern">
                <LandingSectionHead>Internship</LandingSectionHead>
                <div className="landing-timeline landing-timeline--activities">
                  {internships.map((item, i) => (
                    <TimelineRow
                      key={item.title}
                      compact
                      period={item.period}
                      title={item.title}
                      subtitle={item.subtitle}
                      isLast={i === internships.length - 1}
                    />
                  ))}
                </div>
              </section>

              <section className="landing-block landing-block--awards">
                <LandingSectionHead>Awards</LandingSectionHead>
                <div className="landing-timeline">
                  {awards.map((item, i) => (
                    <TimelineRow
                      key={item.title}
                      compact
                      period={item.period}
                      title={item.title}
                      subtitle={item.subtitle}
                      isLast={i === awards.length - 1}
                    />
                  ))}
                </div>
              </section>
            </div>

            <section className="landing-block landing-block--skills">
              <LandingSectionHead>Skills</LandingSectionHead>
              <div className="landing-skills">
                {landingSkillGroups.map((group) => (
                  <div key={group.label} className="landing-skill-group">
                    <p className="landing-skill-group__label">{group.label}</p>
                    <div className="landing-skill-group__icons">
                      {group.skills.map((skill) => {
                        const { Icon, color } = getSkillIcon(skill);
                        return (
                          <Tooltip key={skill}>
                            <TooltipTrigger asChild>
                              <span
                                className="landing-skill-icon"
                                style={{ color }}
                                aria-label={skill}
                              >
                                <Icon />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={6}
                              className="landing-skill-tooltip !animate-none"
                            >
                              <span className="landing-skill-tooltip__pill">
                                <span className="landing-skill-tooltip__text">{skill}</span>
                              </span>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
