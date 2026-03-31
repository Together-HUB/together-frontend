import { useTranslation } from "next-i18next/pages";
import { motion } from "framer-motion";
import { Shield, DollarSign, Users } from "lucide-react";

export default function LandingHero() {
  const { t } = useTranslation("landing");

  return (
    <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
      {/* Deep purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black" />

      {/* Radial glow at top-left */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full bg-primary/25 blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-dark/20 blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          {/* Badge */}
          <div className="inline-flex self-start">
            <span className="px-4 py-1.5 rounded-full border border-white/20 text-primary-light text-sm font-medium bg-white/5 backdrop-blur-sm">
              {t("hero.badge")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t("hero.headline")}
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-primary-light font-light max-w-lg leading-relaxed">
            {t("hero.subheadline")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-primary-light transition-colors shadow-lg">
              {t("hero.cta_join")}
            </button>
            <button className="px-6 py-3 border-2 border-white text-white font-medium rounded-xl hover:bg-white hover:text-primary transition-colors">
              {t("hero.cta_explore")}
            </button>
          </div>

          {/* Trust line */}
          <p className="text-primary-light text-sm">{t("hero.trust")}</p>
        </motion.div>

        {/* Right — Floating Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0 },
          }}
          className="bg-black/75 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col gap-5 w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold text-base">
              {t("hero.dashboard.title")}
            </span>
            <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {t("hero.dashboard.online")}
            </span>
          </div>

          {/* Stat Rows */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <Shield size={18} className="text-primary flex-shrink-0" />
              <span className="text-white text-sm font-medium">
                {t("hero.dashboard.stat1")}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <DollarSign size={18} className="text-accent flex-shrink-0" />
              <span className="text-white text-sm font-medium">
                {t("hero.dashboard.stat2")}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <Users size={18} className="text-green-400 flex-shrink-0" />
              <span className="text-white text-sm font-medium">
                {t("hero.dashboard.stat3")}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Opportunities */}
          <div>
            <p className="text-gray text-xs uppercase tracking-widest mb-3">
              {t("hero.dashboard.opportunities")}
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-white text-sm font-medium">
                  {t("hero.dashboard.opp1_title")}
                </p>
                <p className="text-gray text-xs mt-0.5">
                  {t("hero.dashboard.opp1_deadline")}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-white text-sm font-medium">
                  {t("hero.dashboard.opp2_title")}
                </p>
                <p className="text-gray text-xs mt-0.5">
                  {t("hero.dashboard.opp2_deadline")}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            {t("hero.dashboard.see_all")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
