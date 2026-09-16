import { scrollToSection } from "@/shared/lib/scrollTo"
import { motion } from "framer-motion"

const links = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#services" },
  { label: "Projects", href: "#portfolio" },
  { label: "Letter", href: "#cover-letter" },
  { label: "Contact", href: "#contactme" },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-border/60 py-12 md:py-14 bg-background/50 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pearl-accent/30 to-transparent" />
      <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} <span className="text-foreground">김태우</span>
          <span className="text-pearl-accent/60"> · </span>
          Frontend Developer
        </motion.p>
        <nav className="flex flex-wrap items-center justify-center gap-8">
          {links.map((item) => (
            <button key={item.href} onClick={() => scrollToSection(item.href)} className="nav-link">
              {item.label}
            </button>
          ))}
          <button onClick={() => scrollToSection("#contactme")} className="text-[11px] font-bold tracking-[0.25em] uppercase text-pearl-accent hover:opacity-80 transition-opacity">
            Get In Touch →
          </button>
        </nav>
      </div>
    </footer>
  )
}
