
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
  className?: string;
  delay?: number;
}

export const FeatureCard = ({
  title,
  description,
  icon: Icon,
  color = "bg-blue-50",
  onClick,
  className,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={cn(
        "feature-card cursor-pointer group",
        className
      )}
    >
      <div className={cn("feature-icon-wrapper mb-4", color)}>
        <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:translate-x-0.5 transition-transform duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm">
        {description}
      </p>
    </motion.div>
  );
};
