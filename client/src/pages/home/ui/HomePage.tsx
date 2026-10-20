import { useCallback, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SiReact, SiTypescript } from "react-icons/si";
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
import { PortfolioMarks } from "@/shared/ui/PortfolioMarks";
import { PortfolioOrbit } from "@/shared/ui/PortfolioOrbit";

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
            <div className="about-kicker">
              <PortfolioMarks className="marks-small" />
              <span>Code with care.</span>
            </div>
            <h1>
              <span className="about-greeting">안녕하세요,</span>
              <strong>
                프론트엔드 개발자
                <br />
                <span className="about-name">김태우</span>입니다
                <span className="about-period">.</span>
              </strong>
            </h1>
            <p>{profile.bioShort}</p>
            <div className="about-tech" aria-label="주요 기술">
              {[
                { name: "React", Icon: SiReact },
                { name: "TypeScript", Icon: SiTypescript },
                { name: "React Native", Icon: SiReact },
              ].map(({ name, Icon }) => {
                return (
                  <span key={name}>
                    <span aria-hidden="true">
                      <Icon />
                    </span>
                    {name}
                  </span>
                );
              })}
            </div>
            <div className="about-actions">
              <a href="#portfolio" className="about-primary-action">
                프로젝트 살펴보기 <ArrowUpRight size={17} />
              </a>
              <a href={`mailto:${profile.contact.email}`} className="text-link">
                함께 이야기해요 <ArrowUpRight size={15} />
              </a>
            </div>
            <dl className="about-highlights">
              <div>
                <dt>Selected projects</dt>
                <dd>
                  {String(projects.length).padStart(2, "0")}
                  <span>개의 프로젝트</span>
                </dd>
              </div>
              <div>
                <dt>Awards</dt>
                <dd>
                  {String(awards.length).padStart(2, "0")}
                  <span>번의 수상</span>
                </dd>
              </div>
              <div>
                <dt>Development</dt>
                <dd className="about-platforms">
                  Web <span>&</span> App
                </dd>
              </div>
            </dl>
          </div>
          <PortfolioOrbit />
        </div>
        <div className="about-signoff">
          <p>작은 디테일이 만드는, 더 나은 경험.</p>
          <a href="#career" className="text-link">
            조금 더 알아보기 <ArrowDown size={14} />
          </a>
        </div>
      </div>
      <div id="career" className="resume-grid">
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
      <p className="awards-eyebrow">Awards</p>
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
        className={`home-content sidebar-layout ${isIntroVisible ? "home-content--waiting" : "home-content--ready"}`}
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
