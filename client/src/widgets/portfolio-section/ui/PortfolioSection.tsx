import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { projects, getProjectPath } from "@/entities/project";
const filters = [
  { id: "all", label: "All works" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
];
export const ProjectComponent = () => {
  const [category, setCategory] = useState("all");
  const filtered = projects.filter(
    (project) => category === "all" || project.type === category,
  );
  return (
    <section id="portfolio" className="works-section section-space">
      <div className="page-width">
        <div className="section-heading">
          <span className="small-label">02 / Selected works</span>
          <span className="small-label">
            A selection of web & mobile projects
          </span>
        </div>
        <div className="works-heading">
          <h2 className="serif-section-title">
            Selected <em>Works</em>
            <sup>({String(projects.length).padStart(2, "0")})</sup>
          </h2>
          <div
            className="work-filters"
            role="group"
            aria-label="프로젝트 카테고리"
          >
            {filters.map((filter) => (
              <button
                type="button"
                key={filter.id}
                aria-pressed={category === filter.id}
                onClick={() => setCategory(filter.id)}
                className={category === filter.id ? "is-active" : ""}
              >
                {filter.label}
                <span>
                  {filter.id === "all"
                    ? projects.length
                    : projects.filter((project) => project.type === filter.id)
                        .length}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="works-grid" aria-live="polite">
          {filtered.map((project) => {
            const index = projects.indexOf(project);
            return (
              <article
                key={project.slug}
                id={`work-${project.slug}`}
                className={`work-card work-card--${project.slug}`}
              >
                <Link
                  href={getProjectPath(project.slug)}
                  className="work-card-link"
                  aria-label={`${project.title} 프로젝트 자세히 보기`}
                >
                  <div className="work-image">
                    <img
                      src={project.thumbnail}
                      alt={`${project.title} 서비스 미리보기`}
                      loading="lazy"
                    />
                    <span className="work-view">
                      View project <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <div className="work-info">
                    <div className="work-meta small-label">
                      <span>
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {project.type === "web"
                          ? "Web Development"
                          : "Mobile Development"}
                      </span>
                      <span>
                        {project.period?.replace(" - ing", " — Present") ??
                          "Web Project"}
                      </span>
                    </div>
                    <div className="work-title-row">
                      <h3>{project.title}</h3>
                      <ArrowUpRight size={27} strokeWidth={1} />
                    </div>
                    <p>{project.description}</p>
                    <div className="work-tags">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
        <p className="works-endnote small-label">
          <span>Every project is a new perspective.</span>
          <span>계속해서 쌓아가는, 더 나은 경험의 기록.</span>
        </p>
      </div>
    </section>
  );
};
