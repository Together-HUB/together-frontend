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
  { id: "securite_alimentaire", label: "Sécurité Alimentaire", subs: [] },
  { id: "sante", label: "Santé", subs: [] },
  { id: "nutrition", label: "Nutrition", subs: [] },
  {
    id: "ame_abris",
    label: "Abris/AME",
    subs: [
      { id: "cccm", label: "CCCM (Camp Coordination Camp Management)" },
      { id: "teum", label: "TEUM (Transfert des Especes a Usage Multiple)" },
      { id: "aha", label: "AHA (Action Humanitaire Anticipative)" },
      { id: "ltp", label: "LTP (Logement, Terre et Propriété)" },
    ],
  },
  {
    id: "protection",
    label: "Protection",
    subs: [
      { id: "vbg", label: "VBG (Violences Basées sur le Genre)" },
      { id: "enfant", label: "Enfant" },
    ],
  },
  { id: "wash", label: "WaSH", subs: [] },
  { id: "logistique", label: "Logistique", subs: [] },
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

function getParentSector(subId: string): SectorNode | null {
  for (const sector of SECTOR_TREE) {
    if (sector.subs.some((s) => s.id === subId)) return sector;
  }
  return null;
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

  const toggleLeaf = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const toggleSub = (subId: string, parentId: string) => {
    const sector = SECTOR_TREE.find((s) => s.id === parentId);
    if (value.includes(subId)) {
      const next = value.filter((v) => v !== subId);
      const otherSubsSelected = sector?.subs.some((s) => s.id !== subId && next.includes(s.id));
      onChange(otherSubsSelected ? next : next.filter((v) => v !== parentId));
    } else {
      const next = [...value];
      if (!next.includes(parentId)) next.unshift(parentId);
      next.push(subId);
      onChange(next);
    }
  };

  const removeChip = (id: string) => {
    const sector = SECTOR_TREE.find((s) => s.id === id);
    if (sector && sector.subs.length > 0) {
      const subIds = new Set(sector.subs.map((s) => s.id));
      onChange(value.filter((v) => v !== id && !subIds.has(v)));
    } else {
      const parent = getParentSector(id);
      if (parent) {
        toggleSub(id, parent.id);
      } else {
        toggleLeaf(id);
      }
    }
  };

  return (
    <div>
      <div className={`border rounded-xl overflow-hidden ${error ? "border-accent" : "border-gray-200"}`}>
        <div className="p-2 flex flex-col gap-1.5">
          {SECTOR_TREE.map((sector) => {
            const isExpanded = expanded.has(sector.id);
            const isParentSelected = value.includes(sector.id);
            const hasSubs = sector.subs.length > 0;

            return (
              <div key={sector.id}>
                {hasSubs ? (
                  <button
                    type="button"
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-all ${
                      isParentSelected
                        ? "bg-primary/10 border-primary"
                        : "bg-white border-gray-200 hover:border-primary/40"
                    }`}
                    onClick={() => toggleExpand(sector.id)}
                  >
                    <span className={`text-sm font-medium ${isParentSelected ? "text-primary" : "text-gray-900"}`}>
                      {sector.label}
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleLeaf(sector.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg border text-left transition-all ${
                      isParentSelected
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
                              onChange={() => toggleSub(sub.id, sector.id)}
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
                onClick={() => removeChip(id)}
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
