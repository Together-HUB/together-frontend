import { useState, useRef } from "react";
import Head from "next/head";
import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Award,
  Star,
  Building,
  Globe,
  Phone,
  Mail,
  Eye,
  Target,
  Heart,
  TrendingUp,
  Leaf,
  Shield,
  Lock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { organizations } from "@/services/mockData/organizations";

const org = organizations.find((o) => o.id === "org_001")!;

// ─── Simple image with fallback (explicit width/height) ───────────────────────

function ImgFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackText = "ADSSE",
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className ?? ""}`}>
        <span className="text-gray-400 text-sm font-medium">{fallbackText}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setErrored(true)}
      priority={priority}
    />
  );
}

// ─── Photo Slider ─────────────────────────────────────────────────────────────

function PhotoSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const go = (next: number, dir: number) => {
    setDirection(dir);
    setCurrent(next);
  };
  const prev = () => go((current - 1 + images.length) % images.length, -1);
  const next = () => go((current + 1) % images.length, 1);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-100 h-[420px] md:h-[520px] select-none">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
          className="absolute inset-0"
        >
          {imgError[current] ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400 text-sm">Photo ADSSE {current + 1}</span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[current]}
              alt={`Activités ADSSE ${current + 1}`}
              className="w-full h-full object-cover"
              onError={() => setImgError((prev) => ({ ...prev, [current]: true }))}
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        aria-label="Photo précédente"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Photo suivante"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > current ? 1 : -1)}
            aria-label={`Photo ${i + 1}`}
            className={`transition-all duration-200 rounded-full ${
              i === current
                ? "w-6 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-4 right-4 z-10 bg-black/40 text-white text-xs font-medium px-2.5 py-1 rounded-full">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}

// ─── Map image ────────────────────────────────────────────────────────────────

function MapImg({ src }: { src: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-gray-400 text-sm">Carte ADSSE</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Carte des zones d'intervention ADSSE"
      className="w-full h-full object-cover"
      onError={() => setErrored(true)}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ADSSEProfilePage() {
  return (
    <>
      <Head>
        <title>ADSSE — ToGETHER Networking RDCongo</title>
        <meta
          name="description"
          content="ToGETHER Networking RDCongo connecte les acteurs humanitaires locaux pour renforcer la collaboration et le leadership local en République Démocratique du Congo."
        />
      </Head>

      <Navbar />

      {/* Back link */}
      <div className="pt-20 pb-0 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Link
            href="/directory"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Retour au répertoire
          </Link>
        </div>
      </div>

      {/* ── SECTION 1 — HERO ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-primary to-primary-dark pt-6 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left column */}
            <div>
              {/* Breadcrumb */}
              <p className="text-white/60 text-sm mb-6">
                <Link href="/directory" className="hover:text-white transition-colors">
                  Répertoire
                </Link>
                {" / "}
                <span className="text-white">ADSSE</span>
              </p>

              {/* Logo */}
              <div className="bg-white rounded-2xl p-4 shadow-lg inline-block mb-6">
                <ImgFallback
                  src="/logos/adsse.png"
                  alt="ADSSE"
                  width={160}
                  height={100}
                  className="object-contain"
                  priority
                />
              </div>

              {/* Name */}
              <h1 className="text-2xl font-bold text-white leading-tight max-w-lg">
                {org.full_name}
              </h1>
              <div className="bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full inline-block mt-3">
                {org.acronym}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="flex items-center gap-1.5 bg-green-400/20 text-green-200 rounded-full px-3 py-1 text-xs font-medium">
                  <CheckCircle size={12} />
                  Organisation vérifiée
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 text-white/80 rounded-full px-3 py-1 text-xs">
                  <Calendar size={12} />
                  Fondée le {org.founded_date}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 text-white/80 rounded-full px-3 py-1 text-xs">
                  <MapPin size={12} />
                  {org.founded_city}, {org.founded_province} → Kinshasa
                </span>
              </div>
            </div>

            {/* Right column — experience */}
            <div className="hidden lg:flex flex-col items-end">
              <div className="text-right">
                <p className="text-8xl font-black text-white/20 leading-none select-none">
                  {org.experience_years}+
                </p>
                <p className="text-white text-lg -mt-2">ans d&apos;expérience</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20 mt-4 max-w-sm text-left">
                <Star size={20} className="text-amber-400 mb-3" />
                <p className="text-white font-medium text-sm leading-relaxed">
                  {org.experience_badge}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — STATS BAR ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x lg:divide-gray-100">
            <div className="flex flex-col items-center text-center">
              <Users size={18} className="text-primary mb-1" />
              <p className="text-3xl font-bold text-primary">12,780,000+</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Personnes assistées</p>
            </div>
            <div className="flex flex-col items-center text-center lg:pl-6">
              <Users size={18} className="text-primary mb-1" />
              <p className="text-3xl font-bold text-primary">{org.staff_count}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Membres du personnel</p>
            </div>
            <div className="flex flex-col items-center text-center lg:pl-6">
              <Briefcase size={18} className="text-primary mb-1" />
              <p className="text-3xl font-bold text-primary">{org.offices_count}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Bureaux en RDC</p>
            </div>
            <div className="flex flex-col items-center text-center lg:pl-6">
              <Award size={18} className="text-primary mb-1" />
              <p className="text-3xl font-bold text-primary">{org.experience_years}+</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Années d&apos;expérience</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — PRÉSENTATION ──────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Main text */}
            <div className="lg:col-span-3">
              <p className="text-xs text-primary uppercase tracking-widest font-semibold">
                QUI SOMMES-NOUS ?
              </p>
              <div className="w-12 h-1 bg-primary rounded mt-2 mb-6" />
              <p className="text-gray-700 leading-relaxed text-base">{org.description}</p>
            </div>

            {/* Info card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="font-semibold text-gray-900 mb-5">Informations clés</p>
                <div className="space-y-4">
                  {[
                    { icon: <Building size={15} />, label: "Fondée", value: `${org.founded_date}, ${org.founded_city}` },
                    { icon: <MapPin size={15} />, label: "Siège social", value: org.headquarters },
                    { icon: <Globe size={15} />, label: "Site web", value: org.website, isLink: true },
                    { icon: <Phone size={15} />, label: "Téléphone", value: org.contact_phone },
                    { icon: <Mail size={15} />, label: "Email", value: org.contact_email_1 },
                    { icon: <Mail size={15} />, label: "Email 2", value: org.contact_email_2 },
                    { icon: <CheckCircle size={15} />, label: "Statut", value: "Vérifiée ✓", isStatus: true },
                  ].map(({ icon, label, value, isLink, isStatus }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="text-gray-400 flex-shrink-0 mt-0.5">{icon}</div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        {isLink ? (
                          <a href={value as string} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all">
                            {(value as string).replace(/^https?:\/\//, "")}
                          </a>
                        ) : isStatus ? (
                          <p className="text-sm font-medium text-green-600">{value}</p>
                        ) : (
                          <p className="text-sm text-gray-700 break-words">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-5 pt-5">
                  <Link
                    href="/register/ngo"
                    className="block w-full bg-primary text-white rounded-xl py-3 text-center font-semibold text-sm hover:bg-primary-dark transition-colors"
                  >
                    S&apos;inscrire sur la plateforme
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — VISION & MISSION ──────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest font-semibold">
              NOTRE MISSION
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Ce qui nous guide au quotidien
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto leading-relaxed">
              Depuis 1997, ADSSE œuvre pour le développement communautaire et la protection de l&apos;environnement en RDC.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision card */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white h-full flex flex-col">
              <Eye size={40} className="text-white/60 mb-4" />
              <p className="text-xs font-bold tracking-widest text-white/60 uppercase mb-3">
                VISION
              </p>
              <p className="text-xl font-medium leading-relaxed flex-1">{org.vision}</p>
            </div>

            {/* Mission list */}
            <div className="flex flex-col">
              <Target size={40} className="text-primary mb-4" />
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">
                MISSION
              </p>
              <div className="space-y-4">
                {org.mission_points?.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex-shrink-0 flex items-center justify-center">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — DOMAINS & VALUES ──────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Domains */}
            <div>
              <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-2">
                NOS DOMAINES D&apos;INTERVENTION
              </p>
              <h3 className="font-bold text-xl text-gray-900 mb-6">Domaines d&apos;intervention</h3>
              <div className="space-y-4">
                {[
                  { icon: <Heart size={18} className="text-primary" />, text: org.domains?.[0] },
                  { icon: <TrendingUp size={18} className="text-primary" />, text: org.domains?.[1] },
                  { icon: <Leaf size={18} className="text-primary" />, text: org.domains?.[2] },
                ].map(({ icon, text }, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-primary flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 mt-0.5">{icon}</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Values */}
            <div>
              <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-2">
                NOS VALEURS
              </p>
              <h3 className="font-bold text-xl text-gray-900 mb-6">Nos valeurs</h3>
              <div className="space-y-4">
                {[
                  { icon: <Shield size={18} className="text-primary" />, text: org.values?.[0] },
                  { icon: <Eye size={18} className="text-primary" />, text: org.values?.[1] },
                  { icon: <Leaf size={18} className="text-primary" />, text: org.values?.[2] },
                  { icon: <Lock size={18} className="text-primary" />, text: org.values?.[3] },
                ].map(({ icon, text }, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4"
                  >
                    <div className="bg-primary/10 rounded-lg p-2.5 flex-shrink-0">{icon}</div>
                    <p className="text-sm text-gray-700 leading-relaxed mt-1">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — PHOTO GALLERY ─────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-2">
            NOS ACTIVITÉS SUR LE TERRAIN
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-10">L&apos;ADSSE en action</h2>

          {org.images && org.images.length > 0 && (
            <PhotoSlider images={org.images} />
          )}
        </div>
      </section>

      {/* ── SECTION 7 — MAP ───────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Map */}
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl overflow-hidden shadow-lg h-96 bg-gray-100">
                <MapImg src={org.map_image ?? ""} />
              </div>
              <p className="text-sm text-gray-500 italic mt-3">
                Zone d&apos;intervention principale — Province de l&apos;Ituri (zone pilote ToGETHER Networking)
              </p>
            </div>

            {/* Province coverage */}
            <div className="lg:col-span-2">
              <h3 className="font-bold text-xl text-gray-900 mb-2">Zones d&apos;intervention</h3>
              <p className="text-sm text-gray-500 mb-6">
                L&apos;ADSSE est active dans 10 provinces de la RDC, avec l&apos;Ituri comme zone pilote du programme ToGETHER.
              </p>
              <div className="flex flex-wrap gap-2">
                {org.provinces_covered.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full font-medium"
                  >
                    <MapPin size={11} />
                    {p}
                  </span>
                ))}
              </div>

              {/* Experience callout */}
              <div className="bg-primary rounded-2xl p-6 text-white mt-8">
                <Star size={32} className="text-white/70 mb-3" />
                <p className="text-5xl font-black leading-none">{org.experience_years}+</p>
                <p className="text-lg mt-1">ans d&apos;expérience</p>
                <p className="text-white/70 text-sm mt-1">dans le travail communautaire en RDC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8 — PARTNERS ──────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest font-semibold">
              NOS PARTENAIRES
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Ils nous font confiance</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
              ADSSE collabore avec des partenaires nationaux et internationaux pour maximiser son impact humanitaire en RDC.
            </p>
          </div>
          {org.partner_logos && org.partner_logos.length > 0 && (
            <LogosSlider logos={org.partner_logos} />
          )}
        </div>
      </section>

      {/* ── SECTION 9 — CONTACT & CTA ─────────────────────────────────────── */}
      <section
        className="py-20 text-white"
        style={{ background: "linear-gradient(135deg, #006e8c 0%, #1A1A1A 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact */}
            <div>
              <p className="text-xs text-white/60 uppercase tracking-widest font-semibold">
                NOUS CONTACTER
              </p>
              <h2 className="text-3xl font-bold text-white mt-2 mb-8">Travaillons ensemble</h2>
              <div className="space-y-5">
                {[
                  { icon: <Phone size={18} />, text: org.contact_phone, sub: null },
                  { icon: <Mail size={18} />, text: org.contact_email_1, sub: null },
                  { icon: <Mail size={18} />, text: org.contact_email_2, sub: null },
                  { icon: <MapPin size={18} />, text: org.headquarters, sub: null },
                ].map(({ icon, text }, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="bg-white/10 rounded-xl p-3 flex-shrink-0">{icon}</div>
                    <p className={`font-medium text-white leading-relaxed mt-2 ${i >= 2 ? "text-sm text-white/80" : ""}`}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-3">Rejoindre le réseau</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6 flex-1">
                Vous représentez l&apos;ADSSE ou une organisation similaire ? Inscrivez-vous sur ToGETHER Networking pour accéder aux opportunités de financement, de coordination et de visibilité.
              </p>
              <div className="space-y-3">
                <Link
                  href="/register/ngo"
                  className="block w-full py-3 text-center bg-white text-primary font-semibold rounded-xl hover:bg-primary-light transition-colors"
                >
                  S&apos;inscrire comme ONG
                </Link>
                <Link
                  href="/directory"
                  className="block w-full py-3 text-center bg-transparent border border-white/40 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  En savoir plus sur la plateforme
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile padding for sticky bar */}
      <div className="lg:hidden h-16" />
      <Footer />

      {/* ── STICKY MOBILE BOTTOM BAR ──────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
        <Link
          href="/directory"
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 text-center hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft size={14} />
          Répertoire
        </Link>
        <Link
          href="/register/ngo"
          className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold text-center hover:bg-primary-dark transition-colors"
        >
          S&apos;inscrire
        </Link>
      </div>
    </>
  );
}

// ─── Logos Slider ─────────────────────────────────────────────────────────────

function LogosSlider({ logos }: { logos: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Défiler vers la gauche"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full p-2 shadow-md -translate-x-4 transition-all"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {logos.map((logo, i) => (
          <div
            key={i}
            className="flex-shrink-0 bg-gray-50 rounded-xl p-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ width: 160, height: 90 }}
          >
            {errors[i] ? (
              <span className="text-xs text-gray-400">Partenaire {i + 1}</span>
            ) : (
              <Image
                src={logo}
                alt={`Partenaire ADSSE ${i + 1}`}
                width={120}
                height={60}
                className="object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                onError={() => setErrors((prev) => ({ ...prev, [i]: true }))}
              />
            )}
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Défiler vers la droite"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full p-2 shadow-md translate-x-4 transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "fr", ["common", "directory"])),
    },
  };
};
