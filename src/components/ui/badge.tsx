type BadgeVariant = "default" | "accent" | "success" | "warning";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-border text-text-secondary",
  accent: "bg-accent/20 text-accent",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
