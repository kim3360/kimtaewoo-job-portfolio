import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  stackIntro,
  stackCategories,
  stackPrimary,
  getSkillIcon,
} from "@/entities/skill";
import { scrollToSection } from "@/shared/lib/scrollTo";

function splitTags(tags: string) {
  return tags.split(" · ").map((t) => t.trim());
}

function StackCard({
  name,
  subtitle,
  index,
}: {
  name: (typeof stackPrimary)[number]["name"];
  subtitle: string;
  index: number;
}) {
  const { Icon, color } = getSkillIcon(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.06 * index }}
      whileHover={{ y: -4 }}
      className="fields-stack-card"
    >
      <span
        className="fields-stack-card__icon"
        style={{
          color,
          backgroundColor: `${color}18`,
          boxShadow: `0 0 24px ${color}20`,
        }}
        aria-hidden
      >
        <Icon className="w-6 h-6" />
      </span>
      <p className="fields-stack-card__name">{name}</p>
      <p className="fields-stack-card__sub">{subtitle}</p>
    </motion.div>
  );
}

export function FieldsSection() {
  return (
    <section
      id="skills"
      className="fields-section section-padding section-glow relative overflow-hidden"
    >
      <div className="fields-section__glow" aria-hidden />
      <div className="fields-section__noise" aria-hidden />

      <div className="container relative z-10">
        <div className="fields-section__inner">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="fields-section__header"
          >
            <div className="fields-section__eyebrow-row">
              <p className="fields-section__eyebrow">{stackIntro.eyebrow}</p>
              <span className="fields-section__count badge-pulse">Frontend</span>
            </div>
            <h2 className="fields-section__lead hero-headline">{stackIntro.lead}</h2>
            <p className="fields-section__summary">{stackIntro.summary}</p>
            <div className="fields-section__header-line" aria-hidden />
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="fields-section__primary"
          >
            <p className="fields-section__primary-label">주요 스택</p>
            <div className="fields-stack-grid">
              {stackPrimary.map((tool, i) => (
                <StackCard
                  key={tool.name}
                  name={tool.name}
                  subtitle={tool.subtitle}
                  index={i}
                />
              ))}
            </div>
          </motion.div>

          <div className="fields-section__body">
            <div className="fields-section__grid">
              {stackCategories.map((category, catIndex) => (
                <motion.article
                  key={category.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.08 * catIndex }}
                  whileHover={{ y: -4 }}
                  className="fields-section__card"
                >
                  <div className="fields-section__card-shine" aria-hidden />

                  <div className="fields-section__group-head">
                    <span className="fields-section__group-num">
                      {String(catIndex + 1).padStart(2, "0")}
                    </span>
                    <h3 className="fields-section__group-title">{category.title}</h3>
                  </div>

                  <ul className="fields-section__list">
                    {category.items.map((item, i) => (
                      <motion.li
                        key={item.headline}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.05 * i }}
                        className="fields-section__item"
                      >
                        <p className="fields-section__item-headline">{item.headline}</p>
                        <div className="fields-section__tags">
                          {splitTags(item.tags).map((tag) => (
                            <span key={tag} className="fields-tag-chip">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>

          <motion.footer
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="fields-section__footer"
          >
            <p className="fields-section__footer-note">
              프로젝트에서 어떻게 쓰였는지는 아래 포트폴리오에서 확인할 수 있어요.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection("#portfolio")}
              className="fields-nav"
              aria-label="포트폴리오로 이동"
            >
              <span className="fields-nav__line" aria-hidden />
              <span className="fields-nav__btn">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="fields-nav__label">View Projects</span>
            </button>
          </motion.footer>
        </div>
      </div>
    </section>
  );
}
