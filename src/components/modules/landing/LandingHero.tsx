import { useTranslation } from "next-i18next/pages";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Shield, Users, MapPin } from "lucide-react";

export default function LandingHero() {
  const { t } = useTranslation("landing");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/drc.png"
        alt="République Démocratique du Congo"
        fill
        priority
        className="object-cover object-center scale-105"
        sizes="100vw"
      />

      {/* Layer 1 — deep dark gradient from left (text side) to right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/70 to-black/30" />

      {/* Layer 2 — warm tint rising from the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 via-transparent to-transparent" />

      {/* Layer 3 — top vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Layer 4 — subtle blue glow behind text */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl -translate-x-1/2 pointer-events-none" />

      {/* Decorative vertical line accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/60 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          {/* Location badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/8 backdrop-blur-sm"
          >
            <MapPin size={12} className="text-primary-light" />
            <span className="text-primary-light text-sm font-medium">{t("hero.badge")}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            {t("hero.headline")}
          </motion.h1>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary-light origin-left"
          />

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg sm:text-xl text-white/75 font-light max-w-lg leading-relaxed"
          >
            {t("hero.subheadline")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/directory"
              className="px-7 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5"
            >
              {t("hero.cta_explore")}
            </Link>
            <Link
              href="/register/ngo"
              className="px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-0.5"
            >
              {t("hero.cta_join") ?? "Rejoindre le réseau"}
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-white/50 text-sm"
          >
            {t("hero.trust")}
          </motion.p>
        </motion.div>

        {/* Right — Floating Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: 0.4 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0 },
          }}
          className="w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto"
        >
          {/* Glow ring behind card */}
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl scale-110 pointer-events-none" />

          <div className="relative bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-2xl overflow-hidden">
            {/* Card top accent bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-primary via-primary-light to-transparent" />

            <div className="p-6 flex flex-col gap-5">
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
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition-colors">
                  <Shield size={18} className="text-primary-light flex-shrink-0" />
                  <span className="text-white text-sm font-medium">
                    {t("hero.dashboard.stat1")}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition-colors">
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
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
                  {t("hero.dashboard.opportunities")}
                </p>
                <div className="flex flex-col gap-2.5">
                  <div className="p-3 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition-colors">
                    <p className="text-white text-sm font-medium">
                      {t("hero.dashboard.opp1_title")}
                    </p>
                    <p className="text-white/45 text-xs mt-0.5">
                      {t("hero.dashboard.opp1_deadline")}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition-colors">
                    <p className="text-white text-sm font-medium">
                      {t("hero.dashboard.opp2_title")}
                    </p>
                    <p className="text-white/45 text-xs mt-0.5">
                      {t("hero.dashboard.opp2_deadline")}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                {t("hero.dashboard.see_all")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
    </section>
  );
}
