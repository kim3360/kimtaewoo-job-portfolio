import { motion } from "framer-motion"
import { coverLetterIntro, coverLetterItems } from "@/entities/profile"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion"

export function CoverLetterSection() {
  return (
    <section
      id="cover-letter"
      className="cover-letter-section section-padding section-glow relative overflow-hidden"
    >
      <div className="cover-letter-section__glow" aria-hidden />
      <div className="fields-section__noise cover-letter-section__noise" aria-hidden />

      <div className="container relative z-10">
        <div className="cover-letter-section__inner">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="cover-letter-section__header"
          >
            <p className="cover-letter-section__eyebrow">{coverLetterIntro.eyebrow}</p>
            <h2 className="cover-letter-section__lead hero-headline">{coverLetterIntro.lead}</h2>
            <p className="cover-letter-section__summary">{coverLetterIntro.summary}</p>
            <div className="cover-letter-section__header-line" aria-hidden />
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="cover-letter-section__panel"
          >
            <Accordion type="single" collapsible className="cover-letter-section__accordion">
              {coverLetterItems.map((item, index) => (
                <AccordionItem
                  key={item.title}
                  value={`letter-${index}`}
                  className="cover-letter-section__item"
                >
                  <AccordionTrigger className="cover-letter-section__trigger group hover:no-underline">
                    <span className="flex min-w-0 flex-1 items-center gap-5 md:gap-8">
                      <span className="cover-letter-section__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="cover-letter-section__title">{item.title}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="cover-letter-section__content">
                    <p className="cover-letter-section__body">{item.body}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
