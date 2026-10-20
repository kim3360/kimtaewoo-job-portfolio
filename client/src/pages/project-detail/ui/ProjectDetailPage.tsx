import { useRoute } from "wouter";
import { findProjectBySlug } from "@/entities/project";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { ProjectDetailView } from "@/widgets/project-detail";
import { NotFoundPage } from "@/pages/not-found";

export function ProjectDetailPage() {
  const [, params] = useRoute("/projects/:slug");
  const project = findProjectBySlug(params?.slug ?? "");
  if (!project) return <NotFoundPage />;
  return (
    <div className="sidebar-layout">
      <a className="skip-link" href="#main-content">
        본문 바로가기
      </a>
      <Header />
      <div className="sidebar-content">
        <main id="main-content">
          <ProjectDetailView key={project.slug} project={project} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
