import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  subtitle,
  title,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mb-12 md:mb-20", className)}
    >
      <p className="text-base md:text-lg font-medium text-pearl-accent/80 mb-2 md:mb-4 flex items-center gap-3">
        <span className="w-8 h-px bg-pearl-accent/50" />
        {subtitle}
      </p>
      <h2
        className={cn(
          "display-title text-[clamp(3.5rem,12vw,9rem)]",
          titleClassName
        )}
      >
        <span className="gradient-text">{title}</span>
      </h2>
    </motion.div>
  );
}
