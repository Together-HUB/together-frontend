import { useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import { motion, useInView } from "framer-motion";

export default function LandingCTA() {
  const { t } = useTranslation("landing");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-gradient-to-r from-primary to-primary-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-2xl leading-tight">
            {t("cta.title")}
          </h2>
          <p className="text-primary-light text-lg max-w-xl leading-relaxed">
            {t("cta.subtitle")}
          </p>

          {/* Join Us banner */}
          <div className="mt-2 flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-white/30" />
              <span className="text-white/60 text-xs uppercase tracking-widest font-medium">
                {t("cta.join_movement")}
              </span>
              <span className="h-px w-12 bg-white/30" />
            </div>
            <div className="px-10 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
              <p className="text-white text-2xl font-extrabold tracking-wide">
                {t("cta.join_us")}
              </p>
              <p className="text-primary-light/80 text-sm mt-1">
                {t("cta.tagline")}
              </p>
            </div>
          </div>

          <p className="text-primary-light/70 text-sm">{t("cta.trust")}</p>
        </motion.div>
      </div>
    </section>
  );
}
