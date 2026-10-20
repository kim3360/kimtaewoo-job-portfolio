import { useEffect } from "react";
import { PortfolioMarks } from "@/shared/ui/PortfolioMarks";

type HomeLandingProps = {
  onComplete: () => void;
};

export function HomeLanding({ onComplete }: HomeLandingProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const skipOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onComplete();
    };
    window.addEventListener("keydown", skipOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", skipOnEscape);
    };
  }, [onComplete]);

  return (
    <div className="landing-intro" aria-hidden="true">
      <div
        className="landing-intro__content page-width"
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) onComplete();
        }}
      >
        <div className="cover-topline small-label">
          <span>A collection of selected works</span>
          <span>Web & Mobile Development</span>
        </div>
        <div className="cover-title-group">
          <p className="cover-kicker">김태우의 기록, 그리고 다음</p>
          <p className="cover-title">Portfolio</p>
          <PortfolioMarks />
        </div>
      </div>
    </div>
  );
}
