import Image from "next/image";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  onClick?: () => void;
};

export function Card({
  children,
  className = "",
  interactive = false,
  imageSrc,
  imageAlt = "",
  onClick,
}: CardProps) {
  const classes = [
    "bg-card border border-border rounded-xl overflow-hidden transition-all duration-200",
    interactive &&
      "cursor-pointer hover:scale-[1.02] hover:border-accent",
    !interactive && "hover:border-border",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick}>
      {imageSrc && (
        <div className="relative w-full aspect-video">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      )}
      {children}
    </div>
  );
}
