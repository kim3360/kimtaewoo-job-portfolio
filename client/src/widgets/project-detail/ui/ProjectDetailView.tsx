import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Github,
  Users,
} from "lucide-react";
import type { ProjectBase } from "@/entities/project";
import { getSkillIcon } from "@/entities/skill";
import "./project-detail.css";

function formatTechnicalText(text: string) {
  return text
    .split(/(`[^`]+`)/g)
    .map((part, index) =>
      part.startsWith("`") ? (
        <code key={index}>{part.slice(1, -1)}</code>
      ) : (
        part
      ),
    );
}

export function ProjectDetailView({ project }: { project: ProjectBase }) {
  const [imageIndex, setImageIndex] = useState(0);
  const period = project.period?.replace(" - ing", " — Present");
  const troubleshooting =
    project.troubleshooting ?? (project.details ? [project.details] : []);
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
          {project.image.length > 1 && (
            <figcaption className="case-gallery-controls">
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
            </figcaption>
          )}
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
          {troubleshooting.map((detail, index) => {
            const TroubleshootingHeading = detail.title ? "h4" : "h3";
            return (
              <section className="case-section" key={detail.title ?? index}>
                {detail.title && (
                  <h3 className="case-troubleshooting-title">{detail.title}</h3>
                )}
                <div className="case-troubleshooting">
                  {[
                    { title: "문제", content: detail.Problem },
                    {
                      title: detail.title ? "원인 분석" : "원인",
                      content: detail.Cause,
                    },
                    {
                      title: "해결",
                      content: detail.Solution,
                      steps: detail.SolutionSteps,
                    },
                    { title: "결과", content: detail.Result },
                    ...(detail.Learning
                      ? [{ title: "배운 점", content: detail.Learning }]
                      : []),
                  ].map(({ title, content, steps }) => (
                    <section key={title}>
                      <TroubleshootingHeading>{title}</TroubleshootingHeading>
                      {content.split("\n\n").map((paragraph) => (
                        <p key={paragraph}>{formatTechnicalText(paragraph)}</p>
                      ))}
                      {steps?.length ? (
                        <ul className="case-troubleshooting-steps">
                          {steps.map((step) => (
                            <li key={step}>{formatTechnicalText(step)}</li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
                </div>
              </section>
            );
          })}
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
    </article>
  );
}
