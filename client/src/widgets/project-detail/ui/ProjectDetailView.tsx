import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FileDown,
} from "lucide-react";
import { projects, getProjectPath } from "@/entities/project";
import type { ProjectBase } from "@/entities/project";

export function ProjectDetailView({ project }: { project: ProjectBase }) {
  const [imageIndex, setImageIndex] = useState(0);
  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const details = project.details;
  const moveImage = (direction: number) =>
    setImageIndex(
      (current) =>
        (current + direction + project.image.length) % project.image.length,
    );

  return (
    <article className="case-study page-width">
      <a href="/#portfolio" className="text-link case-back">
        <ArrowLeft size={15} /> All selected works
      </a>
      <header className="case-heading">
        <p className="case-eyebrow small-label">
          PROJECT {String(projectIndex + 1).padStart(2, "0")} /{" "}
          {project.type === "web" ? "WEB DEVELOPMENT" : "MOBILE DEVELOPMENT"}
        </p>
        <h1 className="case-title">{project.title}</h1>
        <p className="case-description">{project.description}</p>
        <dl className="case-metadata">
          <div>
            <dt>PERIOD</dt>
            <dd>{project.period?.replace(" - ing", " — Present") ?? "—"}</dd>
          </div>
          <div>
            <dt>TEAM</dt>
            <dd>{project.members ?? "팀 프로젝트"}</dd>
          </div>
          <div>
            <dt>TECH STACK</dt>
            <dd>{project.tags.join(" · ")}</dd>
          </div>
        </dl>
        <div className="case-links">
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live website <ArrowUpRight size={15} />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository <ArrowUpRight size={15} />
            </a>
          )}
          {project.pdf && (
            <a href={project.pdf} className="text-link" download>
              Project PDF <FileDown size={15} />
            </a>
          )}
        </div>
      </header>
      {project.image.length > 0 && (
        <figure className="case-gallery">
          <img
            src={project.image[imageIndex]}
            alt={`${project.title} 프로젝트 화면 ${imageIndex + 1}`}
          />
          <figcaption className="case-gallery-controls">
            <span className="small-label" aria-live="polite">
              {String(imageIndex + 1).padStart(2, "0")} /{" "}
              {String(project.image.length).padStart(2, "0")}
            </span>
            {project.image.length > 1 && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => moveImage(-1)}
                  aria-label="이전 이미지"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(1)}
                  aria-label="다음 이미지"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </figcaption>
        </figure>
      )}
      <section className="case-section">
        <h2>
          <span>01 / OVERVIEW</span>프로젝트 소개
        </h2>
        <p>{project.Projectdescription ?? project.description}</p>
      </section>
      {project.features && (
        <section className="case-section">
          <h2>
            <span>02 / FEATURES</span>주요 기능
          </h2>
          <div className="case-feature-grid">
            {project.features.map((feature) => (
              <div key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {project.responsibilities && (
        <section className="case-section">
          <h2>
            <span>03 / CONTRIBUTION</span>담당 업무
          </h2>
          <ul>
            {project.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {project.achievements && (
        <section className="case-section">
          <h2>
            <span>04 / ACHIEVEMENTS</span>결과와 성과
          </h2>
          <ul>
            {project.achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {details && (
        <section className="case-section">
          <h2>
            <span>05 / PROBLEM SOLVING</span>문제를 해결하는 과정
          </h2>
          <div className="case-feature-grid">
            {Object.entries(details).map(([title, content]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{content}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <nav className="case-next" aria-label="다음 프로젝트">
        <div>
          <p className="small-label mb-3">NEXT PROJECT</p>
          <h2>{nextProject.title}</h2>
        </div>
        <Link href={getProjectPath(nextProject.slug)} className="text-link">
          Explore project <ArrowRight size={18} />
        </Link>
      </nav>
    </article>
  );
}
