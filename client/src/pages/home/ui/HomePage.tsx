import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { DecorativeBackground } from "@/widgets/page-decor";
import { HomeLanding } from "@/widgets/home-landing";
import { FieldsSection } from "@/widgets/fields-section";
import { PortfolioSection } from "@/widgets/portfolio-section";
import { ServicesSection } from "@/widgets/services-section";
import { ExperienceSection } from "@/widgets/experience-section";
import { CoverLetterSection } from "@/widgets/cover-letter-section";
import { ContactSection } from "@/widgets/contact-section";

export function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <DecorativeBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <HomeLanding />
          <FieldsSection />
          <PortfolioSection />
          <ServicesSection />
          <ExperienceSection />
          <CoverLetterSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
