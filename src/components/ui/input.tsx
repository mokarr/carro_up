import { type ComponentProps } from "react";

type InputBaseProps = {
  label?: string;
  error?: string;
  className?: string;
};

type InputAsInput = InputBaseProps &
  Omit<ComponentProps<"input">, keyof InputBaseProps> & {
    multiline?: false;
  };

type InputAsTextarea = InputBaseProps &
  Omit<ComponentProps<"textarea">, keyof InputBaseProps> & {
    multiline: true;
  };

type InputProps = InputAsInput | InputAsTextarea;

export function Input(props: InputProps) {
  const { label, error, className = "", multiline, ...rest } = props;

  const fieldClasses = [
    "w-full rounded-lg bg-card border px-4 py-2.5 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors duration-200",
    error ? "border-accent" : "border-border",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          className={`${fieldClasses} min-h-[120px] resize-y`}
          {...(rest as Omit<ComponentProps<"textarea">, keyof InputBaseProps>)}
        />
      ) : (
        <input
          className={fieldClasses}
          {...(rest as Omit<ComponentProps<"input">, keyof InputBaseProps>)}
        />
      )}
      {error && <p className="text-sm text-accent">{error}</p>}
    </div>
  );
}
