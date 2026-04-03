import { useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import { motion, useInView } from "framer-motion";

const PROVINCES = [
  "Ituri", "Nord Kivu", "Sud Kivu", "Kinshasa",
  "Maniema", "Tanganyika", "Haut-Katanga",
  "Kasaï Central", "Kasaï", "Haut-Uélé",
  "Nord-Ubangi", "Sud-Ubangi", "Haut-Lomami", "Équateur",
];

export default function LandingStats() {
  const { t } = useTranslation("landing");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  const stats = [
    { value: "5", label: t("stats.ong") },
    { value: "12,780,000+", label: t("stats.projects") },
    { value: "14", label: t("stats.people") },
    { value: "27", label: t("stats.provinces") },
  ];

  return (
    <section ref={ref} className="w-full bg-white py-14 border-t border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col items-center text-center gap-1 ${
                i < stats.length - 1 ? "lg:border-r lg:border-gray-200" : ""
              }`}
            >
              <span className="text-4xl font-bold text-primary">{stat.value}</span>
              <span className="text-xs text-gray uppercase tracking-widest font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Province Pills */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-xs text-gray uppercase tracking-wide">
            {t("stats.provinces_label")}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {PROVINCES.map((province) => (
              <span
                key={province}
                className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
              >
                {province}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
