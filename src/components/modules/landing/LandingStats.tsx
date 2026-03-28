import { useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import { motion, useInView } from "framer-motion";

export default function LandingStats() {
  const { t } = useTranslation("landing");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  const stats = [
    { value: "247", label: t("stats.ong") },
    { value: "1,200+", label: t("stats.projects") },
    { value: "2M+", label: t("stats.people") },
    { value: "26", label: t("stats.provinces") },
  ];

  return (
    <section ref={ref} className="w-full bg-white py-12 border-y border-primary-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-1"
            >
              <span className="text-4xl font-bold text-primary">{stat.value}</span>
              <span className="text-xs text-gray uppercase tracking-widest font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
