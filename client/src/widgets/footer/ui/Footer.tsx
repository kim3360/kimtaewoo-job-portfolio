import { ArrowUp } from "lucide-react";
export default function Footer() {
  return (
    <footer className="editorial-footer page-width">
      <span className="small-label">
        © {new Date().getFullYear()} Taewoo Kim
      </span>
      <span className="footer-note small-label">
        Designed with care. Developed with purpose.
      </span>
      <a
        className="text-link"
        href="#"
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        Back to top <ArrowUp size={14} />
      </a>
    </footer>
  );
}
