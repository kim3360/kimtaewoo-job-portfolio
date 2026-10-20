export function PortfolioOrbit() {
  return (
    <div className="portfolio-orbit" aria-hidden="true">
      <svg viewBox="0 0 600 600" fill="none">
        <circle
          cx="300"
          cy="300"
          r="254"
          stroke="#e7e7e7"
          strokeDasharray="2 8"
        />
        <circle cx="300" cy="300" r="219" stroke="#d8d8d8" />
        <ellipse
          cx="300"
          cy="300"
          rx="264"
          ry="106"
          transform="rotate(-34 300 300)"
          stroke="#bcbcbc"
        />
        <ellipse
          cx="300"
          cy="300"
          rx="264"
          ry="106"
          transform="rotate(34 300 300)"
          stroke="#d1d1d1"
        />
        <g stroke="currentColor" strokeWidth="1.7">
          {[0, 45, 90, 135].map((angle) => (
            <path
              key={angle}
              d="M300 116V256M300 344V484"
              transform={`rotate(${angle} 300 300)`}
            />
          ))}
        </g>
        <circle cx="300" cy="300" r="19" stroke="#d1d1d1" />
        <circle cx="300" cy="300" r="3" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.4">
          {[0, 60, 120].map((angle) => (
            <path
              key={angle}
              d="M486 143V160M486 172V189"
              transform={`rotate(${angle} 486 166)`}
            />
          ))}
        </g>
        <circle cx="138" cy="477" r="12" stroke="#d1d1d1" />
        <circle cx="138" cy="477" r="5" fill="currentColor" />
        <path
          d="M84 140V158M75 149H93M504 444V462M495 453H513"
          stroke="#d1d1d1"
        />
      </svg>
    </div>
  );
}
