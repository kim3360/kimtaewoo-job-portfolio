import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Github,
  Users,
} from "lucide-react";
import { projects, getProjectPath } from "@/entities/project";
import type { ProjectBase } from "@/entities/project";
import { getSkillIcon } from "@/entities/skill";
import "./project-detail.css";

export function ProjectDetailView({ project }: { project: ProjectBase }) {
  const [imageIndex, setImageIndex] = useState(0);
  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const period = project.period?.replace(" - ing", " — Present");
  const moveImage = (direction: number) =>
    setImageIndex(
      (current) =>
        (current + direction + project.image.length) % project.image.length,
    );

  return (
    <article className="case-study page-width">
      <a href="/#portfolio" className="case-back">
        <ArrowLeft size={15} /> Portfolio로 돌아가기
      </a>
      <header className="case-heading">
        {project.logo && (
          <img
            className="case-logo"
            src={project.logo}
            alt={`${project.title} 로고`}
          />
        )}
        <div>
          <p className="case-eyebrow">
            Project {String(projectIndex + 1).padStart(2, "0")}
          </p>
          <h1 className="case-title">{project.title}</h1>
          {period && <p className="case-period">{period}</p>}
        </div>
      </header>
      {project.image.length > 0 && (
        <figure
          className="case-gallery"
          aria-label={`${project.title} 프로젝트 이미지`}
        >
          <div className="case-gallery-stage">
            <img
              src={project.image[imageIndex]}
              alt={`${project.title} 프로젝트 화면 ${imageIndex + 1}`}
            />
            {project.image.length > 1 && (
              <>
                <button
                  className="case-gallery-arrow case-gallery-arrow--previous"
                  type="button"
                  onClick={() => moveImage(-1)}
                  aria-label="이전 이미지"
                >
                  <ChevronLeft size={21} />
                </button>
                <button
                  className="case-gallery-arrow case-gallery-arrow--next"
                  type="button"
                  onClick={() => moveImage(1)}
                  aria-label="다음 이미지"
                >
                  <ChevronRight size={21} />
                </button>
              </>
            )}
          </div>
          <figcaption className="case-gallery-controls">
            <span className="case-gallery-count" aria-live="polite">
              {String(imageIndex + 1).padStart(2, "0")}{" "}
              <span>/ {String(project.image.length).padStart(2, "0")}</span>
            </span>
            {project.image.length > 1 && (
              <div
                className="case-gallery-dots"
                aria-label="프로젝트 이미지 선택"
              >
                {project.image.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    aria-label={`프로젝트 이미지 ${index + 1} 보기`}
                    aria-pressed={imageIndex === index}
                  >
                    <span />
                  </button>
                ))}
              </div>
            )}
          </figcaption>
        </figure>
      )}
      <div className="case-content-layout">
        <div className="case-main">
          <section className="case-section case-overview">
            <h2>프로젝트 설명</h2>
            <p>{project.Projectdescription ?? project.description}</p>
          </section>
          {!!project.features?.length && (
            <section className="case-section">
              <h2>주요 기능</h2>
              <div className="case-feature-grid">
                {project.features.map((feature) => (
                  <div className="case-feature" key={feature.title}>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {!!project.responsibilities?.length && (
            <section className="case-section">
              <h2>담당 업무</h2>
              <ul className="case-contributions">
                {project.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          {!!project.achievements?.length && (
            <section className="case-section">
              <h2>성과</h2>
              <ul className="case-result-list">
                {project.achievements.map((item) => (
                  <li key={item}>
                    <Check size={17} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {project.details && (
            <section className="case-section">
              <h2>트러블 슈팅</h2>
              <div className="case-troubleshooting">
                <div className="case-problem-column">
                  <section>
                    <h3>Problem</h3>
                    <p>{project.details.Problem}</p>
                  </section>
                  <section>
                    <h3>Cause</h3>
                    <p>{project.details.Cause}</p>
                  </section>
                </div>
                <div className="case-solution-column">
                  <section>
                    <h3>Solution</h3>
                    <p>{project.details.Solution}</p>
                  </section>
                  <section>
                    <h3>Result</h3>
                    <p>{project.details.Result}</p>
                  </section>
                </div>
              </div>
            </section>
          )}
        </div>
        <aside className="case-info" aria-label="프로젝트 정보">
          <section className="case-tech">
            <h2>기술 스택</h2>
            <ul>
              {project.tags.map((tag) => {
                const { Icon } = getSkillIcon(tag);
                return (
                  <li key={tag}>
                    <span aria-hidden="true">
                      <Icon style={{ width: 17, height: 17 }} />
                    </span>
                    {tag}
                  </li>
                );
              })}
            </ul>
          </section>
          <dl className="case-metadata">
            {project.members && (
              <div>
                <dt>참여인원</dt>
                <dd>
                  <Users size={16} aria-hidden="true" />
                  <span>{project.members}</span>
                </dd>
              </div>
            )}
            {period && (
              <div>
                <dt>기간</dt>
                <dd>
                  <CalendarDays size={16} aria-hidden="true" />
                  <span>{period}</span>
                </dd>
              </div>
            )}
            <div>
              <dt>담당 역할</dt>
              <dd>Frontend Developer</dd>
            </div>
          </dl>
          <div className="case-links">
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
              >
                라이브 데모 <ArrowUpRight size={16} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} /> GitHub <ArrowUpRight size={16} />
              </a>
            )}
            {project.pdf && (
              <a href={project.pdf} download>
                프로젝트 PDF <FileDown size={16} />
              </a>
            )}
          </div>
        </aside>
      </div>
      <Link
        href={getProjectPath(nextProject.slug)}
        className="case-next"
        aria-label={`다음 프로젝트 ${nextProject.title} 보기`}
      >
        <div>
          <p>NEXT PROJECT</p>
          <h2>{nextProject.title}</h2>
        </div>
        <ArrowRight size={24} />
      </Link>
    </article>
  );
}
