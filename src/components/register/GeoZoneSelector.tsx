import { useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { drcGeography, type Province, type Territoire } from "@/data/drcGeography";

// Encoding: "P:Province", "T:Province:Territoire", "Z:Province:Territoire:Zone"
const pKey = (province: string) => `P:${province}`;
const tKeyOf = (province: string, territoire: string) => `T:${province}:${territoire}`;
const zKeyOf = (province: string, territoire: string, zone: string) =>
  `Z:${province}:${territoire}:${zone}`;

function parseValue(value: string[]) {
  const provinces = new Set<string>();
  const territoires = new Set<string>();
  const zones = new Set<string>();
  value.forEach((v) => {
    if (v.startsWith("P:")) provinces.add(v.slice(2));
    else if (v.startsWith("T:")) territoires.add(v.slice(2));
    else if (v.startsWith("Z:")) zones.add(v.slice(2));
  });
  return { provinces, territoires, zones };
}

function computeFlat(
  provinces: Set<string>,
  territoires: Set<string>,
  zones: Set<string>,
): string[] {
  return [
    ...Array.from(provinces).map(pKey),
    ...Array.from(territoires).map((t) => `T:${t}`),
    ...Array.from(zones).map((z) => `Z:${z}`),
  ];
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-gray-900 rounded-sm px-0.5 not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface GeoZoneSelectorProps {
  value: string[];
  onChange: (zones: string[]) => void;
  error?: string;
}

export default function GeoZoneSelector({ value, onChange, error }: GeoZoneSelectorProps) {
  const [search, setSearch] = useState("");

  const { provinces: selProvinces, territoires: selTerritoires, zones: selZones } = useMemo(
    () => parseValue(value),
    [value],
  );

  const isSearching = search.trim().length > 0;
  const q = search.trim().toLowerCase();

  // ─── Toggle handlers ───────────────────────────────────────────────────────

  const toggleProvince = (p: Province) => {
    const newP = new Set(selProvinces);
    const newT = new Set(selTerritoires);
    const newZ = new Set(selZones);

    if (newP.has(p.name)) {
      newP.delete(p.name);
      Array.from(newT).forEach((t) => {
        if (t.startsWith(`${p.name}:`)) newT.delete(t);
      });
      Array.from(newZ).forEach((z) => {
        if (z.startsWith(`${p.name}:`)) newZ.delete(z);
      });
    } else {
      newP.add(p.name);
    }
    onChange(computeFlat(newP, newT, newZ));
  };

  const toggleTerritoire = (p: Province, t: Territoire) => {
    const key = `${p.name}:${t.name}`;
    const newP = new Set(selProvinces);
    const newT = new Set(selTerritoires);
    const newZ = new Set(selZones);

    if (newT.has(key)) {
      newT.delete(key);
      Array.from(newZ).forEach((z) => {
        if (z.startsWith(`${key}:`)) newZ.delete(z);
      });
    } else {
      newT.add(key);
      newP.add(p.name);
    }
    onChange(computeFlat(newP, newT, newZ));
  };

  const toggleZone = (p: Province, t: Territoire, zone: string) => {
    const zk = zKeyOf(p.name, t.name, zone).slice(2); // strip "Z:"
    const tk = tKeyOf(p.name, t.name).slice(2); // strip "T:"
    const newP = new Set(selProvinces);
    const newT = new Set(selTerritoires);
    const newZ = new Set(selZones);

    if (newZ.has(zk)) {
      newZ.delete(zk);
    } else {
      newZ.add(zk);
      newT.add(tk);
      newP.add(p.name);
    }
    onChange(computeFlat(newP, newT, newZ));
  };

  const selectAllForProvince = (p: Province) => {
    const newP = new Set(selProvinces);
    const newT = new Set(selTerritoires);
    const newZ = new Set(selZones);

    newP.add(p.name);
    p.territoires.forEach((t) => {
      newT.add(`${p.name}:${t.name}`);
      t.zones_de_sante.forEach((z) => newZ.add(`${p.name}:${t.name}:${z}`));
    });
    onChange(computeFlat(newP, newT, newZ));
  };

  const selectAllForTerritoire = (p: Province, t: Territoire) => {
    const newP = new Set(selProvinces);
    const newT = new Set(selTerritoires);
    const newZ = new Set(selZones);

    newP.add(p.name);
    newT.add(`${p.name}:${t.name}`);
    t.zones_de_sante.forEach((z) => newZ.add(`${p.name}:${t.name}:${z}`));
    onChange(computeFlat(newP, newT, newZ));
  };

  // ─── Visibility helpers ────────────────────────────────────────────────────

  const showProvince = (p: Province): boolean => {
    if (!isSearching) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.territoires.some(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.zones_de_sante.some((z) => z.toLowerCase().includes(q)),
      )
    );
  };

  const showTerritoire = (p: Province, t: Territoire): boolean => {
    if (isSearching) {
      return (
        p.name.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.zones_de_sante.some((z) => z.toLowerCase().includes(q))
      );
    }
    return selProvinces.has(p.name);
  };

  const showZone = (p: Province, t: Territoire, zone: string): boolean => {
    if (isSearching) {
      return (
        p.name.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        zone.toLowerCase().includes(q)
      );
    }
    return selTerritoires.has(`${p.name}:${t.name}`);
  };

  // ─── Pills grouping ────────────────────────────────────────────────────────

  const pillGroups = useMemo(() => {
    type TerritoireGroup = { name: string; zones: string[] };
    type ProvinceGroup = {
      province: string;
      provinceSel: boolean;
      territoires: TerritoireGroup[];
    };

    const provinceNames = new Set<string>();
    Array.from(selProvinces).forEach((name) => provinceNames.add(name));
    Array.from(selTerritoires).forEach((tk) => {
      const parts = tk.split(":");
      if (parts[0]) provinceNames.add(parts[0]);
    });
    Array.from(selZones).forEach((zk) => {
      const parts = zk.split(":");
      if (parts[0]) provinceNames.add(parts[0]);
    });

    const groups: ProvinceGroup[] = [];
    Array.from(provinceNames).forEach((provinceName) => {
      const tNames = new Set<string>();
      Array.from(selTerritoires)
        .filter((tk) => tk.startsWith(`${provinceName}:`))
        .forEach((tk) => {
          const parts = tk.split(":");
          if (parts[1]) tNames.add(parts[1]);
        });
      Array.from(selZones)
        .filter((zk) => zk.startsWith(`${provinceName}:`))
        .forEach((zk) => {
          const parts = zk.split(":");
          if (parts[1]) tNames.add(parts[1]);
        });

      const tItems: TerritoireGroup[] = Array.from(tNames).map((tName) => {
        const zones = Array.from(selZones)
          .filter((zk) => zk.startsWith(`${provinceName}:${tName}:`))
          .map((zk) => zk.split(":")[2] ?? "");
        return { name: tName, zones };
      });

      groups.push({ province: provinceName, provinceSel: selProvinces.has(provinceName), territoires: tItems });
    });
    return groups;
  }, [selProvinces, selTerritoires, selZones]);

  const totalSelected = selProvinces.size + selTerritoires.size + selZones.size;

  return (
    <div>
      <div className={`border rounded-xl overflow-hidden ${error ? "border-accent" : "border-gray-200"}`}>
        {/* Search */}
        <div className="p-2 border-b border-gray-100">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une province, territoire ou zone de santé..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:border-primary outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Hierarchy */}
        <div className="max-h-48 overflow-y-auto p-2 flex flex-col gap-0.5">
          {/* Province level descriptor */}
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-2 pt-1 pb-0.5 select-none">
            Province
          </p>
          {drcGeography.provinces.map((province) => {
            if (!showProvince(province)) return null;
            const isProvinceSelected = selProvinces.has(province.name);
            const hasTerritoiresVisible =
              isSearching
                ? province.territoires.some((t) => showTerritoire(province, t))
                : isProvinceSelected;

            return (
              <div key={province.name}>
                {/* Province row */}
                <div className="flex items-center gap-1 hover:bg-gray-50 rounded-lg px-2 py-1.5 group">
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-[#007FFF] cursor-pointer flex-shrink-0"
                      checked={isProvinceSelected}
                      onChange={() => toggleProvince(province)}
                    />
                    <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 truncate">
                      <Highlight text={province.name} query={search.trim()} />
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => selectAllForProvince(province)}
                    className="flex-shrink-0 text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                  >
                    Tout sélectionner
                  </button>
                </div>

                {/* Territories */}
                <AnimatePresence initial={false}>
                  {hasTerritoiresVisible && (
                    <motion.div
                      key="territories"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 ml-4 border-l-2 border-primary/30">
                        {/* Territoire level descriptor */}
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-2 pt-1 pb-0.5 select-none">
                          Territoire
                        </p>
                        {province.territoires.map((territoire) => {
                          if (!showTerritoire(province, territoire)) return null;
                          const isTerritoireSelected = selTerritoires.has(
                            `${province.name}:${territoire.name}`,
                          );
                          const hasZonesVisible =
                            isSearching
                              ? territoire.zones_de_sante.some((z) =>
                                  showZone(province, territoire, z),
                                )
                              : isTerritoireSelected;

                          return (
                            <div key={territoire.name}>
                              {/* Territoire row */}
                              <div className="flex items-center gap-1 hover:bg-gray-50 rounded-lg px-2 py-1.5 group/t">
                                <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                                  <input
                                    type="checkbox"
                                    className="w-3.5 h-3.5 rounded accent-[#007FFF] cursor-pointer flex-shrink-0"
                                    checked={isTerritoireSelected}
                                    onChange={() => toggleTerritoire(province, territoire)}
                                  />
                                  <span className="text-sm text-gray-700 group-hover/t:text-gray-900 truncate">
                                    <Highlight text={territoire.name} query={search.trim()} />
                                  </span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => selectAllForTerritoire(province, territoire)}
                                  className="flex-shrink-0 text-xs text-primary hover:underline opacity-0 group-hover/t:opacity-100 transition-opacity whitespace-nowrap"
                                >
                                  Tout sélectionner
                                </button>
                              </div>

                              {/* Zones de santé */}
                              <AnimatePresence initial={false}>
                                {hasZonesVisible && (
                                  <motion.div
                                    key="zones"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pl-4 ml-4 border-l-2 border-primary/20">
                                      {/* Zone de santé level descriptor */}
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-2 pt-1 pb-0.5 select-none">
                                        Zone de santé
                                      </p>
                                      {territoire.zones_de_sante.map((zone) => {
                                        if (!showZone(province, territoire, zone)) return null;
                                        const isZoneSelected = selZones.has(
                                          `${province.name}:${territoire.name}:${zone}`,
                                        );
                                        return (
                                          <label
                                            key={zone}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 group/z"
                                          >
                                            <input
                                              type="checkbox"
                                              className="w-3 h-3 rounded accent-[#007FFF] cursor-pointer flex-shrink-0"
                                              checked={isZoneSelected}
                                              onChange={() =>
                                                toggleZone(province, territoire, zone)
                                              }
                                            />
                                            <span className="text-xs text-gray-600 group-hover/z:text-gray-800 truncate">
                                              <Highlight text={zone} query={search.trim()} />
                                            </span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {isSearching &&
            drcGeography.provinces.every((p) => !showProvince(p)) && (
              <p className="text-xs text-gray-400 text-center py-4">
                Aucun résultat trouvé
              </p>
            )}
        </div>
      </div>

      {/* Pills */}
      {totalSelected > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {pillGroups.map((group) => (
            <div key={group.province} className="contents">
              {group.provinceSel && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-primary text-white">
                  {group.province}
                  <button
                    type="button"
                    onClick={() => {
                      const p = drcGeography.provinces.find(
                        (pr) => pr.name === group.province,
                      );
                      if (p) toggleProvince(p);
                    }}
                    className="hover:opacity-70 transition-opacity ml-0.5"
                    aria-label="Retirer"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {group.territoires.map((t) => (
                <div key={t.name} className="contents">
                  {selTerritoires.has(`${group.province}:${t.name}`) && (
                    <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">
                      {t.name}
                      <button
                        type="button"
                        onClick={() => {
                          const p = drcGeography.provinces.find(
                            (pr) => pr.name === group.province,
                          );
                          const terr = p?.territoires.find((tt) => tt.name === t.name);
                          if (p && terr) toggleTerritoire(p, terr);
                        }}
                        className="hover:opacity-70 transition-opacity ml-0.5"
                        aria-label="Retirer"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {t.zones.map((zone) => (
                    <span
                      key={zone}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary"
                    >
                      {zone}
                      <button
                        type="button"
                        onClick={() => {
                          const p = drcGeography.provinces.find(
                            (pr) => pr.name === group.province,
                          );
                          const terr = p?.territoires.find((tt) => tt.name === t.name);
                          if (p && terr) toggleZone(p, terr, zone);
                        }}
                        className="hover:opacity-70 transition-opacity ml-0.5"
                        aria-label="Retirer"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-accent text-xs mt-1">{error}</p>}
    </div>
  );
}
