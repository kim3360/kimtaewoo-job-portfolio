import { useCallback, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { HomeLanding } from "@/widgets/home-landing";
import { PortfolioSection } from "@/widgets/portfolio-section";
import { CoverLetterSection } from "@/widgets/cover-letter-section";
import { ContactSection } from "@/widgets/contact-section";
import { profile, activities, awards, internships } from "@/entities/profile";
import { education } from "@/entities/education";
import { landingSkillGroups } from "@/entities/skill";
import { projects } from "@/entities/project";
import "./reference-portfolio.css";

function ResumeTimeline({
  title,
  label,
  items,
}: {
  title: string;
  label: string;
  items: readonly { period: string; title: string; subtitle: string }[];
}) {
  return (
    <section className="resume-timeline-group" aria-label={label}>
      <h3>
        {title} <span>{label}</span>
      </h3>
      <ol className="resume-timeline">
        {items.map((item) => (
          <li className="resume-timeline-item" key={item.title}>
            <span className="resume-timeline-period">{item.period}</span>
            <div className="resume-timeline-content">
              <h4>{item.title}</h4>
              <p>{item.subtitle}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="about-section page-width section-space">
      <div className="about-screen">
        <div className="about-layout">
          <div className="about-intro">
            <p className="reference-eyebrow">TAEWOO / DEVELOPER PORTFOLIO</p>
            <h1>
              <span className="about-greeting">
                화면과 데이터의 흐름을 연결하는
              </span>
              <strong>
                프론트엔드 개발자
                <br />
                김태우입니다.
              </strong>
            </h1>
            <p className="reference-hero-description">{profile.bioShort}</p>
            <p className="reference-hero-meta">
              React · TypeScript · React Native{" "}
              <span>UI · API 연동 · 상태 관리</span>
            </p>
            <div className="about-actions">
              <a href="#portfolio" className="about-primary-action">
                프로젝트 살펴보기 <ArrowDown size={17} />
              </a>
              <a
                href={`mailto:${profile.contact.email}`}
                className="reference-outline-action"
              >
                채용·협업 문의 <ArrowUpRight size={17} />
              </a>
            </div>
            <dl className="about-highlights">
              <div>
                <dt>Web & Mobile</dt>
                <dd>
                  사용자와 만나는 화면<span>React · React Native</span>
                </dd>
              </div>
              <div>
                <dt>
                  Selected Projects / {String(projects.length).padStart(2, "0")}
                </dt>
                <dd>
                  팀으로 만든 서비스<span>UI부터 데이터 흐름까지</span>
                </dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>
                  엠클라우독 인턴십<span>모바일개발팀 · React Native</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="about-signoff">
          <p>작은 디테일이 만드는, 더 나은 경험.</p>
          <a href="#career" className="text-link">
            조금 더 알아보기 <ArrowDown size={14} />
          </a>
        </div>
      </div>
      <div id="career" className="resume-grid">
        <header className="reference-section-header">
          <p className="reference-eyebrow">Experience & Education</p>
          <h2>
            배우고, 만들고,
            <br />
            함께 성장한 기록.
          </h2>
        </header>
        <div className="resume-history">
          <ResumeTimeline
            title="Education"
            label="학력"
            items={education.map((item) => ({
              period: item.period,
              title: item.school,
              subtitle: item.degree,
            }))}
          />
          <ResumeTimeline
            title="Experience"
            label="실무 경험"
            items={internships}
          />
          <ResumeTimeline title="Activities" label="활동" items={activities} />
        </div>
      </div>
    </section>
  );
}
function AwardsSection() {
  return (
    <section
      id="awards"
      className="awards-section page-width section-space"
      aria-labelledby="awards-title"
    >
      <p className="reference-eyebrow">Awards</p>
      <h2 id="awards-title">함께 쌓은 경험.</h2>
      <ul className="awards-list">
        {awards.map((item) => (
          <li className="award-row" key={item.title}>
            <span className="award-period">{item.period}</span>
            <div className="award-content">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
            <span className="award-honor">{item.honor}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
function SkillsSection() {
  return (
    <section id="skills" className="skills-section page-width section-space">
      <header className="reference-section-header">
        <p className="reference-eyebrow">Engineering & Collaboration</p>
        <h2>
          사용자를 위한 화면,
          <br />
          함께 다듬는 완성도.
        </h2>
      </header>
      <div className="reference-capabilities">
        {[
          {
            label: "01 / INTERFACE",
            title: "웹과 모바일의 사용자 경험",
            description:
              "디자인 의도를 컴포넌트로 옮기고, 웹과 모바일에서 자연스럽게 이어지는 화면을 만듭니다.",
            tags: ["React", "TypeScript", "React Native", "Tailwind CSS"],
          },
          {
            label: "02 / STATE & DATA",
            title: "안정적으로 이어지는 데이터",
            description:
              "서버와 클라이언트 상태를 나누고, API 연동부터 로딩·오류 처리까지 사용자의 흐름 안에서 연결합니다.",
            tags: ["TanStack Query", "Zustand", "REST API", "Zod"],
          },
          {
            label: "03 / TEAM & QUALITY",
            title: "협업으로 높이는 완성도",
            description:
              "기획·디자인·백엔드와 화면과 API의 접점을 맞추고, 코드 리뷰와 피드백으로 제품을 개선합니다.",
            tags: ["GitHub", "Figma", "Storybook", "Code Review"],
          },
        ].map((item) => (
          <article key={item.label}>
            <p className="reference-card-label">{item.label}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <ul>
              {item.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <details className="reference-stack-details">
        <summary>기술 스택 전체 보기</summary>
        <div className="reference-stack-grid">
          {landingSkillGroups.map((group) => (
            <div key={group.label}>
              <h3>{group.label}</h3>
              <p>{group.skills.join(" · ")}</p>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
export function HomePage() {
  const [isIntroVisible, setIsIntroVisible] = useState(
    () =>
      !window.location.hash &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const completeIntro = useCallback(() => setIsIntroVisible(false), []);

  return (
    <>
      {isIntroVisible && <HomeLanding onComplete={completeIntro} />}
      <div
        id="home"
        className={`home-content sidebar-layout reference-portfolio ${isIntroVisible ? "home-content--waiting" : "home-content--ready"}`}
        inert={isIntroVisible}
        aria-hidden={isIntroVisible ? true : undefined}
      >
        <a className="skip-link" href="#main-content">
          본문 바로가기
        </a>
        <Header />
        <div className="sidebar-content">
          <main id="main-content">
            <AboutSection />
            <PortfolioSection />
            <SkillsSection />
            <AwardsSection />
            <CoverLetterSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
