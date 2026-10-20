import { useCallback, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { HomeLanding } from "@/widgets/home-landing";
import { PortfolioSection } from "@/widgets/portfolio-section";
import { CoverLetterSection } from "@/widgets/cover-letter-section";
import { ContactSection } from "@/widgets/contact-section";
import { profile, activities, awards, internships } from "@/entities/profile";
import { education } from "@/entities/education";
import { landingSkillGroups } from "@/entities/skill";
import { projects, getProjectPath } from "@/entities/project";
import { PortfolioMarks } from "@/shared/ui/PortfolioMarks";
function AboutSection() {
  return (
    <section id="about" className="about-section page-width section-space">
      <div className="section-heading">
        <span className="small-label">01 / About me</span>
        <span className="small-label">A little about who I am</span>
      </div>
      <div className="about-layout">
        <div className="about-intro">
          <PortfolioMarks className="marks-small" />
          <h1>
            안녕하세요,
            <br />
            <strong>
              프론트엔드 개발자
              <br />
              김태우
            </strong>
            입니다.
          </h1>
          <p>{profile.bioShort}</p>
          <a href={`mailto:${profile.contact.email}`} className="text-link">
            {profile.contact.email} <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="about-index">
          <div className="index-heading small-label">
            <span>Selected project index</span>
            <span>({String(projects.length).padStart(2, "0")})</span>
          </div>
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={getProjectPath(project.slug)}
              className="index-row"
            >
              <span className="index-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{project.title}</span>
              <span className="index-category">
                {project.type === "web"
                  ? "Web Development"
                  : "Mobile Development"}
              </span>
              <ArrowUpRight size={17} strokeWidth={1.2} />
            </Link>
          ))}
          <p className="index-note">
            아이디어를 화면으로, 화면을 일상의 경험으로.
          </p>
        </div>
      </div>
      <div className="resume-grid">
        <div className="resume-column">
          <h3>
            Education <span>학력</span>
          </h3>
          {education.map((item) => (
            <div className="resume-item" key={item.school}>
              <span className="resume-period">{item.period}</span>
              <h4>{item.school}</h4>
              <p>{item.degree}</p>
            </div>
          ))}
          <h3 className="resume-subheading">
            Experience <span>실무 경험</span>
          </h3>
          {internships.map((item) => (
            <div className="resume-item" key={item.title}>
              <span className="resume-period">{item.period}</span>
              <h4>{item.title}</h4>
              <p>{item.subtitle}</p>
            </div>
          ))}
        </div>
        <div className="resume-column">
          <h3>
            Activities <span>활동</span>
          </h3>
          {activities.map((item) => (
            <div className="resume-item" key={item.title}>
              <span className="resume-period">{item.period}</span>
              <h4>{item.title}</h4>
              <p>{item.subtitle}</p>
            </div>
          ))}
        </div>
        <div className="resume-column">
          <h3>
            Awards <span>수상</span>
          </h3>
          {awards.map((item) => (
            <div className="resume-item" key={item.title}>
              <span className="resume-period">{item.period}</span>
              <h4>{item.title}</h4>
              <p>{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function SkillsSection() {
  return (
    <section id="skills" className="skills-section page-width section-space">
      <div className="section-heading">
        <span className="small-label">03 / Capabilities</span>
        <span className="small-label">Tools for better experiences</span>
      </div>
      <div className="skills-layout">
        <div>
          <h2 className="serif-section-title">
            Thoughtfully
            <br />
            <em>developed.</em>
          </h2>
          <p className="section-description">
            보이는 화면부터 보이지 않는 데이터의 흐름까지,
            <br />
            제품의 완성도를 함께 고민합니다.
          </p>
        </div>
        <div className="skills-list">
          {landingSkillGroups.map((group, index) => (
            <div className="skill-row" key={group.label}>
              <span className="small-label">0{index + 1}</span>
              <h3>{group.label}</h3>
              <p>{group.skills.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>
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
        className={`home-content ${isIntroVisible ? "home-content--waiting" : "home-content--ready"}`}
        inert={isIntroVisible}
        aria-hidden={isIntroVisible ? true : undefined}
      >
        <a className="skip-link" href="#main-content">
          본문 바로가기
        </a>
        <Header />
        <main id="main-content">
          <AboutSection />
          <PortfolioSection />
          <SkillsSection />
          <CoverLetterSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
