import { useRoute } from "wouter";
import { findProjectBySlug } from "@/entities/project";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { DecorativeBackground } from "@/widgets/page-decor";
import { ProjectDetailView } from "@/widgets/project-detail";
import { NotFoundPage } from "@/pages/not-found";

export function ProjectDetailPage() {
  const [, params] = useRoute("/projects/:slug");
  const project = findProjectBySlug(params?.slug ?? "");

  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <DecorativeBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <ProjectDetailView project={project} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
