import { cn } from "@/shared/lib/utils";

interface TimelineRowProps {
  period: string;
  title: string;
  subtitle?: string;
  isLast?: boolean;
  compact?: boolean;
}

export function TimelineRow({
  period,
  title,
  subtitle,
  isLast = false,
  compact = false,
}: TimelineRowProps) {
  return (
    <div
      className={cn(
        "timeline-row",
        compact && "timeline-row--compact",
        !isLast && "border-b border-border/40"
      )}
    >
      <p className="timeline-row__period">{period}</p>
      <div className="timeline-row__content">
        <p className="timeline-row__title">{title}</p>
        {subtitle && <p className="timeline-row__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
