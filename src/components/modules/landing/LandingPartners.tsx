import { useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import { motion, useInView } from "framer-motion";

const PARTNER_KEYS = ["partner1", "partner2", "partner3", "partner4", "partner5", "partner6"];

export default function LandingPartners() {
  const { t } = useTranslation("landing");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-primary uppercase tracking-widest mb-10">
          {t("partners.label")}
        </p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-12"
        >
          {PARTNER_KEYS.map((key) => (
            <div
              key={key}
              className="rounded-lg bg-gray-100 w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-default"
            >
              <span className="text-xs text-gray-400 font-medium text-center px-2">
                {t(`partners.${key}`)}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
