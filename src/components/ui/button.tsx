"use client";

import { Link } from "@/i18n/routing";
import { type ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentProps<"button">, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentProps<typeof Link>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-transparent border border-border text-text-primary hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-lg",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    ...rest
  } = props;

  const classes = [
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 cursor-pointer",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, ...linkProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkProps} />
    );
  }

  const { variant: _v, size: _s, className: _c, href: _h, ...buttonProps } = props as ButtonAsButton;
  return <button className={classes} {...buttonProps} />;
}
