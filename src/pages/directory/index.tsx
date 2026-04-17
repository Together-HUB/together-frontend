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
  Calendar,
  Mail,
  Users,
  Building2,
  Phone,
  Star,
  ExternalLink,
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
  const thumbRef = useRef<HTMLDivElement>(null);

  const go = (next: number, dir: number) => {
    setDirection(dir);
    setCurrent(next);
    // keep active thumbnail in view
    setTimeout(() => {
      const container = thumbRef.current;
      if (!container) return;
      const thumb = container.children[next] as HTMLElement | undefined;
      thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, 0);
  };
  const prev = () => go((current - 1 + images.length) % images.length, -1);
  const next = () => go((current + 1) % images.length, 1);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="space-y-2 select-none">
      {/* ── Main frame ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-950" style={{ height: 420 }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.32, 0, 0.67, 0] }}
            className="absolute inset-0"
          >
            {imgErrors[current] ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-950">
                <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-600 text-2xl">🖼</span>
                </div>
                <span className="text-gray-500 text-sm">Photo {current + 1}</span>
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
            {/* Bottom gradient for readability */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
            {/* Top gradient for counter readability */}
            <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <button onClick={prev} aria-label="Précédent"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2.5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} aria-label="Suivant"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2.5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95">
          <ChevronRight size={20} />
        </button>

        {/* Counter badge */}
        <div className="absolute top-3 left-3 z-10 bg-black/55 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wide">
          {current + 1} / {images.length}
        </div>

        {/* Dot indicators (compact, max 10 visible) */}
        {images.length <= 10 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => go(i, i > current ? 1 : -1)}
                aria-label={`Photo ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-5 h-1.5 bg-white shadow"
                    : "w-1.5 h-1.5 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnail filmstrip (only when many images) ── */}
      {images.length > 4 && (
        <div
          ref={thumbRef}
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? 1 : -1)}
              aria-label={`Aller à la photo ${i + 1}`}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ring-2 ${
                i === current
                  ? "ring-primary scale-105 shadow-md"
                  : "ring-transparent opacity-60 hover:opacity-90 hover:ring-gray-300"
              }`}
              style={{ width: 64, height: 44 }}
            >
              {imgErrors[i] ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">{i + 1}</span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={`Miniature ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => setImgErrors((p) => ({ ...p, [i]: true }))}
                />
              )}
            </button>
          ))}
        </div>
      )}
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

// ─── Map Image (with fallback) ────────────────────────────────────────────────

function MapImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) return null;
  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full object-contain max-h-64"
        onError={() => setErrored(true)}
      />
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
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Card */}
        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Sticky header ── */}
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

          {/* ── Body ── */}
          <div className="px-6 py-5 space-y-6">

            {/* Photo gallery */}
            {org.images && org.images.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Galerie photos · {org.images.length} images
                </p>
                <PhotoSlider images={org.images} />
              </div>
            )}

            {/* Full name + location + founding */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-snug">{org.full_name}</h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500">{org.city}, {org.province_primary} — RD Congo</span>
                </div>
                {org.founded_date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-500">
                      Créée le {org.founded_date}
                      {org.founded_city ? ` à ${org.founded_city}` : ""}
                      {org.founded_province ? `, ${org.founded_province}` : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Experience badge ── */}
            {org.experience_badge && (
              <div className="flex items-center gap-2.5 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3">
                <span className="text-primary text-lg font-black leading-none">
                  {org.experience_years ?? org.founded ? new Date().getFullYear() - org.founded : ""}+
                </span>
                <span className="text-sm text-primary/80 font-medium">{org.experience_badge}</span>
              </div>
            )}

            {/* ── Key facts strip ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Founded */}
              <div className="flex flex-col items-center gap-1.5 bg-primary/5 rounded-xl p-3 text-center">
                <Calendar size={16} className="text-primary" />
                <p className="text-base font-bold text-gray-900">{org.founded}</p>
                <p className="text-xs text-gray-500">Fondée</p>
              </div>

              {/* Staff */}
              {(org.staff_count || org.stats.staff_min) && (
                <div className="flex flex-col items-center gap-1.5 bg-accent/5 rounded-xl p-3 text-center">
                  <Users size={16} className="text-accent" />
                  <p className="text-base font-bold text-gray-900">
                    {org.stats.staff_min && org.stats.staff_max
                      ? `${org.stats.staff_min}–${org.stats.staff_max}`
                      : org.staff_count}
                  </p>
                  <p className="text-xs text-gray-500">Membres</p>
                </div>
              )}

              {/* Offices */}
              {org.offices_count && (
                <div className="flex flex-col items-center gap-1.5 bg-green-50 rounded-xl p-3 text-center">
                  <Building2 size={16} className="text-green-600" />
                  <p className="text-base font-bold text-gray-900">{org.offices_count}</p>
                  <p className="text-xs text-gray-500">Bureaux</p>
                </div>
              )}

              {/* Provinces */}
              <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-xl p-3 text-center">
                <Globe size={16} className="text-gray-500" />
                <p className="text-base font-bold text-gray-900">{org.provinces_covered.length}</p>
                <p className="text-xs text-gray-500">Provinces</p>
              </div>
            </div>

            {/* ── Contact info ── */}
            {(org.contact_email || org.contact_phone || org.website || org.social) && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Contact & Liens</p>

                {org.contact_email && (
                  <a
                    href={`mailto:${org.contact_email}`}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-primary transition-colors group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-primary/40 transition-colors">
                      <Mail size={13} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </span>
                    {org.contact_email}
                  </a>
                )}

                {org.contact_email_2 && org.contact_email_2 !== org.contact_email && (
                  <a
                    href={`mailto:${org.contact_email_2}`}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-primary transition-colors group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-primary/40 transition-colors">
                      <Mail size={13} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </span>
                    {org.contact_email_2}
                  </a>
                )}

                {org.contact_phone && (
                  <a
                    href={`tel:${org.contact_phone}`}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-primary transition-colors group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-primary/40 transition-colors">
                      <Phone size={13} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </span>
                    {org.contact_phone}
                  </a>
                )}

                {org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-primary transition-colors group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-primary/40 transition-colors">
                      <Globe size={13} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </span>
                    {org.website.replace(/^https?:\/\//, "")}
                  </a>
                )}

                {(org.social?.twitter || org.social?.facebook) && (
                  <div className="flex items-center gap-2 pt-1">
                    {org.social.twitter && (
                      <a
                        href={org.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-primary bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:border-primary/40 transition-all"
                      >
                        <ExternalLink size={12} />
                        Twitter / X
                      </a>
                    )}
                    {org.social.facebook && (
                      <a
                        href={org.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-primary bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:border-primary/40 transition-all"
                      >
                        <ExternalLink size={12} />
                        Facebook
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Headquarters note ── */}
            {org.headquarters && (
              <div className="flex items-start gap-2.5 text-sm text-gray-600">
                <Building2 size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <span>{org.headquarters}</span>
              </div>
            )}

            {/* ── About ── */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">À propos</p>
              <p className="text-sm text-gray-700 leading-relaxed">{org.description_fr}</p>
            </div>

            {/* ── Vision ── */}
            {org.vision && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Vision</p>
                <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-accent/40 pl-3">
                  {org.vision}
                </p>
              </div>
            )}

            {/* ── Mission ── */}
            {(org.mission_fr || (org.mission_points && org.mission_points.length > 0)) && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Mission</p>
                {org.mission_points && org.mission_points.length > 0 ? (
                  <ul className="space-y-2">
                    {org.mission_points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-primary/40 pl-3">
                    {org.mission_fr}
                  </p>
                )}
              </div>
            )}

            {/* ── Domains ── */}
            {org.domains && org.domains.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Domaines d&apos;intervention</p>
                <div className="space-y-2">
                  {org.domains.map((domain, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-1 w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xs">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed">{domain}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Values ── */}
            {org.values && org.values.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Valeurs</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {org.values.map((val, i) => (
                    <div key={i} className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                      <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                      <span className="text-xs text-gray-700 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Sectors ── */}
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

            {/* ── Provinces ── */}
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

            {/* ── Territories (Sud Kivu detail) ── */}
            {org.territories_sud_kivu && org.territories_sud_kivu.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Territoires couverts — Sud Kivu
                </p>
                <div className="space-y-1.5">
                  {org.territories_sud_kivu.map((territory) => (
                    <div key={territory} className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      <MapPin size={11} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      {territory}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Map image ── */}
            {org.map_image && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Carte des interventions
                </p>
                <MapImage src={org.map_image} alt={`Carte des interventions — ${org.acronym}`} />
              </div>
            )}

            {/* ── Operational offices ── */}
            {org.operational_offices && org.operational_offices.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Bureaux opérationnels
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {org.operational_offices.map((office) => (
                    <div key={office} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                      {office}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Impact stats ── */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Impact</p>
              <div className="grid grid-cols-3 gap-3 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10">
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{org.stats.projects_completed}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t("projects_completed")}</p>
                </div>
                <div className="text-center border-x border-primary/10">
                  <p className="text-xl font-bold text-primary">
                    {org.stats.people_helped >= 1000000
                      ? `${(org.stats.people_helped / 1000000).toFixed(1)}M`
                      : org.stats.people_helped.toLocaleString("fr-FR")}+
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t("people_helped")}</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{org.stats.partners_count}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t("partners")}</p>
                </div>
              </div>
              {org.impact_note && (
                <p className="text-xs text-gray-500 leading-relaxed mt-2.5 pl-1 italic">{org.impact_note}</p>
              )}
              {org.team_note && (
                <div className="flex items-center gap-2 mt-2.5 pl-1">
                  <Users size={12} className="text-gray-400 flex-shrink-0" />
                  <p className="text-xs text-gray-500 italic">{org.team_note}</p>
                </div>
              )}
            </div>

            {/* ── Success stories ── */}
            {(() => {
              const stories = org.success_stories ?? (org.success_story ? [org.success_story] : []);
              if (stories.length === 0) return null;
              return (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={14} className="text-accent fill-accent" />
                    <p className="text-xs font-semibold text-accent uppercase tracking-wide">
                      {stories.length > 1 ? `Histoires de succès (${stories.length})` : "Histoire de succès"}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {stories.map((story, idx) => (
                      <div key={story.id ?? idx} className="border border-accent/20 bg-accent/5 rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 leading-snug flex-1">{story.title}</p>
                          <span className="text-xs bg-accent/10 text-accent font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                            {story.sector}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-gray-500">{story.period}</p>
                          {story.duration && (
                            <span className="text-xs text-gray-400">· {story.duration}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{story.description}</p>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="bg-white rounded-lg px-3 py-2 text-center border border-accent/10">
                            <p className="text-sm font-bold text-accent">{story.results.people_assisted.toLocaleString("fr-FR")}</p>
                            <p className="text-xs text-gray-500">Personnes assistées</p>
                          </div>
                          {story.results.funding_obtained && (
                            <div className="bg-white rounded-lg px-3 py-2 text-center border border-accent/10">
                              <p className="text-sm font-bold text-accent">{story.results.funding_obtained}</p>
                              <p className="text-xs text-gray-500">
                                {story.results.funding_source ? `Financé par ${story.results.funding_source}` : "Financement obtenu"}
                              </p>
                            </div>
                          )}
                          {story.results.households_reached && (
                            <div className="bg-white rounded-lg px-3 py-2 text-center border border-accent/10">
                              <p className="text-sm font-bold text-accent">{story.results.households_reached.toLocaleString("fr-FR")}</p>
                              <p className="text-xs text-gray-500">Ménages atteints</p>
                            </div>
                          )}
                          {story.results.villages_covered && (
                            <div className="bg-white rounded-lg px-3 py-2 text-center border border-accent/10">
                              <p className="text-sm font-bold text-accent">{story.results.villages_covered}</p>
                              <p className="text-xs text-gray-500">Villages couverts</p>
                            </div>
                          )}
                          {story.results.distributions && (
                            <div className="bg-white rounded-lg px-3 py-2 text-center border border-accent/10">
                              <p className="text-sm font-bold text-accent">{story.results.distributions}</p>
                              <p className="text-xs text-gray-500">Distributions</p>
                            </div>
                          )}
                        </div>
                        {(story.location ?? story.results.location) && (
                          <div className="flex items-center gap-1.5 pt-1">
                            <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                            <p className="text-xs text-gray-500">{story.location ?? story.results.location}</p>
                          </div>
                        )}
                        {story.results.beneficiary_profile && (
                          <p className="text-xs text-gray-500 italic">{story.results.beneficiary_profile}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── Partner logos ── */}
            {org.partner_logos && org.partner_logos.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Nos partenaires
                </p>
                <LogosSlider logos={org.partner_logos} />
              </div>
            )}
          </div>

          {/* ── Footer CTA ── */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            {org.contact_email ? (
              <a
                href={`mailto:${org.contact_email}`}
                className="flex-1 py-2.5 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={14} />
                Contacter
              </a>
            ) : null}
            {org.website ? (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                Site web
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
                  <p className="text-2xl font-bold text-white">7</p>
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
