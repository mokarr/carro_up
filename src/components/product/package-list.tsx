type PackageListProps = {
  items: string[];
};

export function PackageList({ items }: PackageListProps) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-text-primary">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
