import { X } from "lucide-react";

export const DRC_PROVINCES = [
  "Bas-Uele", "Équateur", "Haut-Katanga", "Haut-Lomami", "Haut-Uele",
  "Ituri", "Kasaï", "Kasaï Central", "Kasaï Oriental", "Kinshasa",
  "Kongo Central", "Kwango", "Kwilu", "Lomami", "Lualaba", "Mai-Ndombe",
  "Maniema", "Mongala", "Nord-Kivu", "Nord-Ubangi", "Sankuru",
  "Sud-Kivu", "Sud-Ubangi", "Tanganyika", "Tshopo", "Tshuapa",
];

interface ProvinceMultiSelectProps {
  value: string[];
  onChange: (provinces: string[]) => void;
  accentColor?: "primary" | "accent";
  error?: string;
}

export default function ProvinceMultiSelect({
  value,
  onChange,
  accentColor = "primary",
  error,
}: ProvinceMultiSelectProps) {
  const toggle = (p: string) => {
    if (value.includes(p)) {
      onChange(value.filter((x) => x !== p));
    } else {
      onChange([...value, p]);
    }
  };

  const pillBg = accentColor === "accent"
    ? "bg-accent/10 text-accent"
    : "bg-primary/10 text-primary";

  const checkColor = accentColor === "accent"
    ? "accent-[#A60F30]"
    : "accent-[#562BD6]";

  return (
    <div>
      <div
        className={`border rounded-xl overflow-hidden ${
          error ? "border-accent" : "border-gray-200"
        }`}
      >
        <div className="max-h-48 overflow-y-auto p-3 flex flex-col gap-1.5">
          {DRC_PROVINCES.map((province) => (
            <label
              key={province}
              className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 group"
            >
              <input
                type="checkbox"
                className={`w-4 h-4 rounded ${checkColor} cursor-pointer`}
                checked={value.includes(province)}
                onChange={() => toggle(province)}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {province}
              </span>
            </label>
          ))}
        </div>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((p) => (
            <span
              key={p}
              className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${pillBg}`}
            >
              {p}
              <button
                type="button"
                onClick={() => toggle(p)}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-accent text-xs mt-1">{error}</p>}
    </div>
  );
}
