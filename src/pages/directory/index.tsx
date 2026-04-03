import { useState, useMemo, useRef } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import { useTranslation } from "next-i18next/pages";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  MapPin,
  Globe,
  SearchX,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { organizations } from "@/services/mockData/organizations";
import { filterOrganizations } from "@/services/api";
import type { Organisation } from "@/types/organization";

const DRC_PROVINCES = [
  "Bas-Uele", "Équateur", "Haut-Katanga", "Haut-Lomami", "Haut-Uélé",
  "Ituri", "Kasaï", "Kasaï Central", "Kasaï Oriental", "Kinshasa",
  "Kongo Central", "Kwango", "Kwilu", "Lomami", "Lualaba", "Mai-Ndombe",
  "Maniema", "Mongala", "Nord Kivu", "Nord-Ubangi", "Sankuru",
  "Sud Kivu", "Sud-Ubangi", "Tanganyika", "Tshopo", "Tshuapa",
];

const SECTORS = [
  "Santé", "Éducation", "WASH", "Protection", "Urgence", "Nutrition",
  "AME/Abri", "Sécurité Alimentaire", "Psychosocial", "Environnement", "Jeunesse",
];

// ─── Logo with initials fallback ──────────────────────────────────────────────

function OrgLogo({ src, name, width, height }: {
  src: string; name: string; width: number; height: number;
}) {
  const [errored, setErrored] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();

  if (errored) {
    return (
      <div
        className="rounded-xl bg-primary flex items-center justify-center flex-shrink-0"
        style={{ width, height }}
      >
        <span className="text-white font-bold text-sm tracking-tight">{initials}</span>
      </div>
    );
  }
  return (
    <Image
      src={src} alt={name} width={width} height={height}
      className="object-contain"
      onError={() => setErrored(true)}
    />
  );
}

// ─── NGO Card ────────────────────────────────────────────────────────────────

function OrgCard({ org, onExpand }: { org: Organisation; onExpand: (org: Organisation) => void }) {
  const { t } = useTranslation("directory");
  const visibleSectors = org.sectors.slice(0, 3);
  const extraCount = org.sectors.length - 3;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 hover:border-primary/20 transition-all duration-200 h-full flex flex-col">
      {/* Top row — Logo + Verified badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center" style={{ width: 80, height: 60 }}>
          <OrgLogo src={org.logo_url} name={org.acronym} width={80} height={60} />
        </div>
        {org.verified && (
          <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs rounded-full px-3 py-1 font-medium whitespace-nowrap">
            <CheckCircle size={12} />
            {t("verified")}
          </span>
        )}
      </div>

      {/* Name */}
      <div className="mt-4">
        <p className="text-base font-bold text-gray-900 leading-tight">{org.full_name}</p>
        <p className="text-sm text-primary font-semibold mt-0.5">{org.acronym}</p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 mt-3">
        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-500">{org.city}, {org.province_primary}</span>
      </div>

      {/* Description — clamped */}
      <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
        {org.description_fr}
      </p>

      {/* Sectors */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {visibleSectors.map((s) => (
          <span key={s} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">
            {s}
          </span>
        ))}
        {extraCount > 0 && (
          <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full">
            +{extraCount}
          </span>
        )}
      </div>

      {/* Provinces covered */}
      <div className="flex items-center gap-1.5 mt-3">
        <Globe size={12} className="text-gray-400" />
        <span className="text-xs text-gray-400">
          {t("active_in", { count: org.provinces_covered.length })}
        </span>
      </div>

      {/* Divider + Footer */}
      <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={() => onExpand(org)}
          className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
        >
          {t("view_profile")} →
        </button>
      </div>
    </div>
  );
}

// ─── Photo Slider (inside modal) ─────────────────────────────────────────────

function PhotoSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const go = (next: number, dir: number) => { setDirection(dir); setCurrent(next); };
  const prev = () => go((current - 1 + images.length) % images.length, -1);
  const next = () => go((current + 1) % images.length, 1);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-100 h-56 select-none">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
          className="absolute inset-0"
        >
          {imgErrors[current] ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">Photo {current + 1}</span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[current]}
              alt={`Photo ${current + 1}`}
              className="w-full h-full object-cover"
              onError={() => setImgErrors((p) => ({ ...p, [current]: true }))}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button onClick={prev} aria-label="Précédent"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow transition-all">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} aria-label="Suivant"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow transition-all">
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
        {images.map((_, i) => (
          <button key={i} onClick={() => go(i, i > current ? 1 : -1)}
            aria-label={`Photo ${i + 1}`}
            className={`rounded-full transition-all duration-200 ${
              i === current ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Counter badge */}
      <div className="absolute top-2.5 right-3 z-10 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
        {current + 1}/{images.length}
      </div>
    </div>
  );
}

// ─── Logos Slider (inside modal) ─────────────────────────────────────────────

function LogosSlider({ logos }: { logos: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" });

  return (
    <div className="relative">
      <button onClick={() => scroll("left")} aria-label="Gauche"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full p-1.5 shadow -translate-x-3 transition-all">
        <ChevronLeft size={15} />
      </button>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {logos.map((logo, i) => (
          <div key={i}
            className="flex-shrink-0 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ width: 110, height: 64 }}>
            {errors[i] ? (
              <span className="text-xs text-gray-400">Partenaire</span>
            ) : (
              <Image src={logo} alt={`Partenaire ${i + 1}`} width={90} height={50}
                className="object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                onError={() => setErrors((p) => ({ ...p, [i]: true }))}
              />
            )}
          </div>
        ))}
      </div>

      <button onClick={() => scroll("right")} aria-label="Droite"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full p-1.5 shadow translate-x-3 transition-all">
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ─── Expanded Card Modal ──────────────────────────────────────────────────────

function ExpandedCard({ org, onClose }: { org: Organisation; onClose: () => void }) {
  const { t } = useTranslation("directory");

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Card */}
        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <OrgLogo src={org.logo_url} name={org.acronym} width={48} height={36} />
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">{org.acronym}</p>
                {org.verified && (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-medium mt-0.5">
                    <CheckCircle size={11} />
                    {t("verified")}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-6">
            {/* Photo slider — shown when images are available */}
            {org.images && org.images.length > 0 && (
              <PhotoSlider images={org.images} />
            )}

            {/* Full name + location */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">{org.full_name}</h2>
              <div className="flex items-center gap-1.5 mt-2">
                <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-500">{org.city}, {org.province_primary} — RD Congo</span>
              </div>
            </div>

            {/* Description — full, no clamp */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                À propos
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{org.description_fr}</p>
            </div>

            {/* Mission */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Mission
              </p>
              <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-primary/40 pl-3">
                {org.mission_fr}
              </p>
            </div>

            {/* All sectors */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {t("sectors")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {org.sectors.map((s) => (
                  <span key={s} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Provinces */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {t("intervention_zones")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {org.provinces_covered.map((p) => (
                  <span key={p} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{org.stats.projects_completed}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("projects_completed")}</p>
              </div>
              <div className="text-center border-x border-gray-200">
                <p className="text-lg font-bold text-primary">
                  {org.stats.people_helped.toLocaleString("fr-FR")}+
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{t("people_helped")}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{org.stats.partners_count}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("partners")}</p>
              </div>
            </div>

            {/* Partner logos slider — shown when logos are available */}
            {org.partner_logos && org.partner_logos.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Nos partenaires
                </p>
                <LogosSlider logos={org.partner_logos} />
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            {org.website ? (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                Profil complet
                <ArrowRight size={15} />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
              >
                Site non disponible
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DirectoryPage() {
  const { t } = useTranslation("directory");

  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState("");
  const [expandedOrg, setExpandedOrg] = useState<Organisation | null>(null);

  const hasFilters = query || province || sector || status;

  const filtered = useMemo(
    () => filterOrganizations(organizations, query, province, sector, status),
    [query, province, sector, status]
  );

  const resetFilters = () => {
    setQuery(""); setProvince(""); setSector(""); setStatus("");
  };

  return (
    <>
      <Head>
        <title>Répertoire ONG — ToGETHER Networking</title>
        <meta name="description" content="ToGETHER Networking RDCongo connecte les acteurs humanitaires locaux pour renforcer la collaboration et le leadership local en République Démocratique du Congo." />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#006e8c] to-[#00536b] pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{t("title")}</h1>
                <p className="mt-3 text-white/80 max-w-2xl leading-relaxed">{t("subtitle")}</p>
              </div>
              <div className="flex flex-wrap gap-6 lg:flex-shrink-0">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-white/70 text-xs mt-0.5">{t("stat_verified")}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">10</p>
                  <p className="text-white/70 text-xs mt-0.5">{t("stat_provinces")}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">∞</p>
                  <p className="text-white/70 text-xs mt-0.5">{t("stat_access")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="sticky top-16 z-30 bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative">
                  <select value={province} onChange={(e) => setProvince(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer transition-colors">
                    <option value="">{t("all_provinces")}</option>
                    {DRC_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select value={sector} onChange={(e) => setSector(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer transition-colors">
                    <option value="">{t("all_sectors")}</option>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer transition-colors">
                    <option value="">{t("all_statuses")}</option>
                    <option value="active">{t("status_verified")}</option>
                    <option value="pending">{t("status_pending")}</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {hasFilters && (
                  <button onClick={resetFilters} className="text-sm text-primary font-medium hover:underline whitespace-nowrap">
                    {t("reset_filters")}
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              {filtered.length === 1
                ? t("results_count_one", { count: filtered.length })
                : t("results_count_other", { count: filtered.length })}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <SearchX size={64} className="text-gray-300 mb-5" />
              <p className="text-lg font-medium text-gray-700">{t("no_results")}</p>
              <p className="text-sm text-gray-500 mt-1">{t("no_results_hint")}</p>
              <button onClick={resetFilters}
                className="mt-6 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                {t("reset_filters")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((org) => (
                <OrgCard key={org.id} org={org} onExpand={setExpandedOrg} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Expanded card modal */}
      {expandedOrg && (
        <ExpandedCard org={expandedOrg} onClose={() => setExpandedOrg(null)} />
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "fr", ["common", "directory"])),
    },
  };
};
