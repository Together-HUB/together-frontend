import { useState } from "react";
import { ChevronRight, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SubSector {
  id: string;
  label: string;
}

interface SectorNode {
  id: string;
  label: string;
  subs: SubSector[];
}

const SECTOR_TREE: SectorNode[] = [
  {
    id: "securite_alimentaire",
    label: "Sécurité Alimentaire",
    subs: [{ id: "nutrition", label: "Nutrition" }],
  },
  {
    id: "protection",
    label: "Protection",
    subs: [
      { id: "vbg", label: "VBG (Violences Basées sur le Genre)" },
      { id: "enfant", label: "Enfant" },
    ],
  },
  {
    id: "ame_abris",
    label: "AME / Abris",
    subs: [
      { id: "cccm", label: "CCCM (Coordination et Gestion des Sites)" },
      { id: "teum", label: "TEUM (Tentes d'Urgence et Unités Mobiles)" },
      { id: "aha", label: "AHA (Assistance Humanitaire en Abris)" },
      { id: "ltp", label: "LTP (Logement, Terre et Propriété)" },
    ],
  },
  { id: "wash", label: "WASH", subs: [] },
  { id: "logistique", label: "Logistique", subs: [] },
  { id: "sante", label: "Santé", subs: [] },
];

function getLabelById(id: string): string {
  for (const sector of SECTOR_TREE) {
    if (sector.id === id) return sector.label;
    for (const sub of sector.subs) {
      if (sub.id === id) return sub.label;
    }
  }
  return id;
}

interface SectorTreeProps {
  value: string[];
  onChange: (sectors: string[]) => void;
  error?: string;
}

export default function SectorTree({ value, onChange, error }: SectorTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div>
      <div className={`border rounded-xl overflow-hidden ${error ? "border-accent" : "border-gray-200"}`}>
        <div className="p-2 flex flex-col gap-1.5">
          {SECTOR_TREE.map((sector) => {
            const isExpanded = expanded.has(sector.id);
            const isSelected = value.includes(sector.id);
            const hasSubs = sector.subs.length > 0;

            return (
              <div key={sector.id}>
                {hasSubs ? (
                  <div
                    className={`flex items-center rounded-lg border transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary"
                        : "bg-white border-gray-200 hover:border-primary/40"
                    }`}
                  >
                    <label
                      className="flex items-center gap-2 px-3 py-3 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded accent-[#007FFF] cursor-pointer flex-shrink-0"
                        checked={isSelected}
                        onChange={() => toggleSelect(sector.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </label>
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-between pr-4 py-3 text-left"
                      onClick={() => toggleExpand(sector.id)}
                    >
                      <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-gray-900"}`}>
                        {sector.label}
                      </span>
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleSelect(sector.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-white border-gray-200 text-gray-900 hover:border-primary/40"
                    }`}
                  >
                    <span className="text-sm font-medium">{sector.label}</span>
                  </button>
                )}

                <AnimatePresence initial={false}>
                  {hasSubs && isExpanded && (
                    <motion.div
                      key="subs"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 ml-4 mt-1 mb-1 border-l-2 border-primary/30 flex flex-col gap-1">
                        {sector.subs.map((sub) => (
                          <label
                            key={sub.id}
                            className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 group"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded accent-[#007FFF] cursor-pointer flex-shrink-0"
                              checked={value.includes(sub.id)}
                              onChange={() => toggleSelect(sub.id)}
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                              {sub.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary"
            >
              {getLabelById(id)}
              <button
                type="button"
                onClick={() => toggleSelect(id)}
                className="hover:opacity-70 transition-opacity ml-0.5"
                aria-label="Retirer"
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
