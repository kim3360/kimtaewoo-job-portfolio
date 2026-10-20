import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
const navItems = [
  { label: "About", href: "/#about" },
  { label: "Works", href: "/#portfolio" },
  { label: "Letter", href: "/#cover-letter" },
];
export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="editorial-header">
      <nav className="page-width header-inner" aria-label="메인 메뉴">
        <a href="/" className="wordmark" aria-label="김태우 포트폴리오 홈">
          taewoo<span className="wordmark-star">✳</span>
        </a>
        <span className="header-caption small-label">
          Frontend Developer
          <br />
          Based in South Korea
        </span>
        <div className="desktop-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="header-link">
              {item.label}
            </a>
          ))}
          <a href="/#contactme" className="header-contact">
            Let’s talk <ArrowUpRight size={15} />
          </a>
        </div>
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>
      {isMenuOpen && (
        <nav id="mobile-menu" className="mobile-nav" aria-label="모바일 메뉴">
          {[...navItems, { label: "Let’s talk ↗", href: "/#contactme" }].map(
            (item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
