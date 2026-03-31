import { useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

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
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register/ngo" className="px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-primary-light transition-colors shadow-lg">
              {t("cta.btn1")}
            </Link>
            <Link href="/register/partner" className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary transition-colors">
              {t("cta.btn2")}
            </Link>
          </div>
          <p className="text-primary-light/70 text-sm">{t("cta.trust")}</p>
        </motion.div>
      </div>
    </section>
  );
}
