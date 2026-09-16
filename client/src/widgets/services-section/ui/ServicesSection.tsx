import { SectionHeading } from "@/shared/ui/SectionHeading"
import { Marquee, MarqueeItem } from "@/shared/ui/Marquee"
import { SERVICES } from "@/entities/site"

export const SkillComponent = () => {
  return (
    <section id="services" className="section-padding">
      <div className="container mb-10 md:mb-14">
        <SectionHeading subtitle="Creative" title="Services" />
      </div>

      <div className="border-y border-border/80 py-6 md:py-8 mb-4 marquee-fade relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pearl-accent/[0.02] via-transparent to-purple-500/[0.02] pointer-events-none" />
        <Marquee speed="normal" pauseOnHover>
          {SERVICES.map((service) => (
            <MarqueeItem key={service} className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-foreground px-2 md:px-4 hover:text-pearl-accent transition-colors duration-300" separator>
              {service}
            </MarqueeItem>
          ))}
        </Marquee>
      </div>

      <div className="border-b border-border/80 py-6 md:py-8 marquee-fade">
        <Marquee speed="normal" reverse pauseOnHover>
          {SERVICES.map((service) => (
            <MarqueeItem key={`rev-${service}`} className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-foreground/30 px-2 md:px-4" separator>
              {service}
            </MarqueeItem>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
