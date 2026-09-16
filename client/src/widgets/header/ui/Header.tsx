import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { scrollToSection } from "@/shared/lib/scrollTo";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/entities/profile";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#portfolio" },
  { label: "Letter", href: "#cover-letter" },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (href: string) => {
    scrollToSection(href);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border/40" : ""
      }`}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-14 md:h-16">
          <button
            onClick={() => navigate("#home")}
            className="text-sm md:text-base font-bold tracking-[0.2em] uppercase hover:text-pearl-accent transition-colors"
          >
            {profile.nameEn}
          </button>

          <div className="hidden md:flex items-center gap-10 lg:gap-14">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="nav-link-simple"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1"
            aria-label="메뉴"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="container py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="nav-link-simple text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
