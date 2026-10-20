export function PortfolioMarks({ className = "" }: { className?: string }) {
  return (
    <span className={`portfolio-marks ${className}`} aria-hidden="true">
      <svg viewBox="0 0 80 80" fill="none">
        {[0, 45, 90, 135].map((a) => (
          <path
            key={a}
            d="M40 3V32M40 48V77"
            transform={`rotate(${a} 40 40)`}
          />
        ))}
      </svg>
      <svg viewBox="0 0 80 80" fill="none">
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M40 3V30" transform={`rotate(${i * 15} 40 40)`} />
        ))}
      </svg>
      <svg viewBox="0 0 80 80" fill="none">
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d="M40 4V13" transform={`rotate(${i * 22.5} 40 40)`} />
        ))}
      </svg>
    </span>
  );
}
