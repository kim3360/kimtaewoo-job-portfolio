import { useState } from "react";
import { Link } from "wouter";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { projects, getProjectPath } from "@/entities/project";

const filters = [
  { id: "all", label: "전체" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
];

export const ProjectComponent = () => {
  const [category, setCategory] = useState("all");
  const filtered = projects.filter(
    (project) => category === "all" || project.type === category,
  );
  return (
    <section id="portfolio" className="reference-projects section-space">
      <div className="page-width">
        <header className="reference-section-header reference-project-header">
          <div>
            <p className="reference-eyebrow">
              Projects / {String(projects.length).padStart(2, "0")}
            </p>
            <h2>
              아이디어에서,
              <br />
              사용자의 경험까지.
            </h2>
          </div>
          <p>
            웹과 모바일로 구현한 다섯 가지 서비스.
            <br />
            프로젝트의 핵심 기능과 직접 맡은 구현을 소개합니다.
          </p>
        </header>
        <div className="reference-project-tools">
          <nav
            className="reference-project-nav"
            aria-label="프로젝트 빠른 이동"
          >
            {filtered.map((project) => (
              <a key={project.slug} href={`#work-${project.slug}`}>
                <span>
                  {String(projects.indexOf(project) + 1).padStart(2, "0")}
                </span>
                {project.title}
                <ArrowDown size={13} />
              </a>
            ))}
          </nav>
          <div
            className="reference-filters"
            role="group"
            aria-label="프로젝트 카테고리"
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                aria-pressed={category === filter.id}
                onClick={() => setCategory(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div aria-live="polite" className="reference-project-list">
          {filtered.map((project) => (
            <article
              id={`work-${project.slug}`}
              key={project.slug}
              className="reference-project"
            >
              <Link
                href={getProjectPath(project.slug)}
                className="reference-project-image"
                aria-label={`${project.title} 프로젝트 자세히 보기`}
              >
                <div className="reference-project-visual">
                  <img
                    src={project.thumbnail}
                    alt={`${project.title} 서비스 미리보기`}
                    loading="lazy"
                  />
                </div>
                <span className="reference-project-preview-link">
                  상세보기 <ArrowUpRight size={17} />
                </span>
              </Link>
              <div className="reference-project-body">
                <div className="reference-project-meta">
                  <span>
                    PROJECT{" "}
                    {String(projects.indexOf(project) + 1).padStart(2, "0")}
                  </span>
                  <span>
                    {project.period?.replace(" - ing", " — Present") ??
                      "Web Project"}
                  </span>
                </div>
                <h3>
                  <Link href={getProjectPath(project.slug)}>
                    {project.title}
                  </Link>
                </h3>
                <p className="reference-project-role">
                  {project.type === "mobile"
                    ? "Mobile Application"
                    : "Web Application"}
                  <span>ROLE</span>Frontend Developer
                </p>
                <p className="reference-project-description">
                  {project.description}
                </p>
                <dl className="reference-project-facts">
                  {project.features?.length ? (
                    <div>
                      <dt>핵심 기능</dt>
                      <dd>
                        {project.features
                          .slice(0, 2)
                          .map((feature) => feature.title)
                          .join(" · ")}
                      </dd>
                    </div>
                  ) : null}
                  {project.responsibilities?.length ? (
                    <div>
                      <dt>담당 구현</dt>
                      <dd>{project.responsibilities.slice(0, 2).join(". ")}</dd>
                    </div>
                  ) : null}
                </dl>
                <ul className="reference-project-tags">
                  {project.tags.slice(0, 6).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {project.achievements?.length ? (
                  <details className="reference-project-details">
                    <summary>{project.title} 구현·개선 기록</summary>
                    <ul>
                      {project.achievements.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </details>
                ) : null}
                <div className="reference-project-links">
                  <Link href={getProjectPath(project.slug)}>
                    프로젝트 상세 <ArrowUpRight size={15} />
                  </Link>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub <ArrowUpRight size={15} />
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      서비스 보기 <ArrowUpRight size={15} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
