import { cn } from "@/shared/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: "slow" | "normal" | "fast" | "portfolio";
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className,
  reverse = false,
  speed = "normal",
  pauseOnHover = false,
}: MarqueeProps) {
  const speedClass = {
    slow: "animate-marquee-slow",
    normal: "animate-marquee",
    fast: "animate-marquee-fast",
    portfolio: "animate-marquee-portfolio",
  }[speed];

  return (
    <div
      className={cn(
        "overflow-hidden select-none",
        pauseOnHover && "group",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max items-center",
          speedClass,
          reverse && "animate-marquee-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

export function MarqueeItem({
  children,
  className,
  separator = true,
  nowrap = true,
}: {
  children: React.ReactNode
  className?: string
  separator?: boolean
  nowrap?: boolean
}) {
  return (
    <span className={cn("flex shrink-0 items-center", className)}>
      {nowrap ? <span className="whitespace-nowrap">{children}</span> : children}
      {separator && (
        <span className="mx-6 md:mx-10 text-muted-foreground/40" aria-hidden>
          •
        </span>
      )}
    </span>
  )
}
