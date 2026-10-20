import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "@/entities/profile";

const sections = [
  { id: "about", label: "Introduction" },
  { id: "career", label: "Experience" },
  { id: "portfolio", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "cover-letter", label: "Letter" },
  { id: "contactme", label: "Contact" },
];

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    if (location !== "/") {
      setActiveSection("portfolio");
      return;
    }
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      let current = "about";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (
          element &&
          element.getBoundingClientRect().top <= window.innerHeight * 0.3
        )
          current = section.id;
      }
      setActiveSection(current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateActiveSection);
    };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [location]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <aside className="profile-sidebar" aria-label="프로필 및 페이지 탐색">
      <div className="sidebar-mobile-bar">
        <a
          href="/#about"
          className="sidebar-mobile-identity"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src="/assets/profile-id.png" alt="" />
          <span>
            <strong>{profile.name}</strong>
            <span>Frontend Developer</span>
          </span>
        </a>
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="profile-sidebar-body"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div
        id="profile-sidebar-body"
        className={`profile-sidebar-body ${isMenuOpen ? "profile-sidebar-body--open" : ""}`}
      >
        <div className="sidebar-profile">
          <a
            className="sidebar-portrait"
            href="/#about"
            aria-label="김태우 소개로 이동"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src="/assets/profile-id.png"
              alt={`${profile.name} 증명사진`}
            />
          </a>
          <p className="sidebar-eyebrow">TAEWOO / PORTFOLIO</p>
          <h2>{profile.name}</h2>
          <p className="sidebar-role">Frontend Developer</p>
        </div>
        <div className="sidebar-contact">
          <span className="sidebar-eyebrow">EMAIL</span>
          <a className="sidebar-email" href={`mailto:${profile.contact.email}`}>
            {profile.contact.email}
          </a>
          <div className="sidebar-socials">
            <a
              href={`https://github.com/${profile.contact.github.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
            <a href="/#contactme" onClick={() => setIsMenuOpen(false)}>
              Contact <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <nav className="sidebar-navigation" aria-label="포트폴리오 섹션">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`/#${section.id}`}
              onClick={() => setIsMenuOpen(false)}
              aria-current={
                activeSection === section.id ? "location" : undefined
              }
            >
              <span className="sidebar-nav-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{section.label}</span>
              <span className="sidebar-nav-line" aria-hidden="true" />
            </a>
          ))}
        </nav>
        <p className="sidebar-colophon">
          © {new Date().getFullYear()} Taewoo Kim
        </p>
      </div>
    </aside>
  );
}
