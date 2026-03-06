import { useTranslations } from "next-intl";

type SpecTableProps = {
  specs: Record<string, unknown>;
};

const specKeyToI18nKey: Record<string, string> = {
  display: "specDisplay",
  resolution: "specResolution",
  dimensions: "specDimensions",
  dashcam: "specDashcam",
  ram: "specRAM",
  brightness: "specBrightness",
  wireless: "specWireless",
  connections: "specConnections",
  power: "specPower",
  warranty: "specWarranty",
};

export function SpecTable({ specs }: SpecTableProps) {
  const tp = useTranslations("product");

  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value], index) => {
            const i18nKey = specKeyToI18nKey[key];
            const label = i18nKey ? tp(i18nKey) : key;

            let displayValue: string;
            if (typeof value === "boolean") {
              displayValue = value ? tp("yes") : tp("no");
            } else {
              displayValue = String(value);
            }

            return (
              <tr
                key={key}
                className={index % 2 === 0 ? "bg-card" : "bg-background"}
              >
                <th scope="row" className="px-4 py-2.5 text-left font-medium text-text-secondary">
                  {label}
                </th>
                <td className="px-4 py-2.5 text-right text-text-primary">
                  {displayValue}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
