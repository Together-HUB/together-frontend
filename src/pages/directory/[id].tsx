import { useState } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import { useTranslation } from "next-i18next/pages";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  Briefcase,
  Users,
  Map,
  Info,
  Lock,
  ExternalLink,
  Link2,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { organizations } from "@/services/mockData/organizations";
import type { Organisation } from "@/types/organization";

// ─── Logo with initials fallback ──────────────────────────────────────────────

function OrgLogo({
  src,
  name,
  width,
  height,
}: {
  src: string;
  name: string;
  width: number;
  height: number;
}) {
  const [errored, setErrored] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  if (errored) {
    return (
      <div
        className="rounded-xl bg-primary flex items-center justify-center flex-shrink-0"
        style={{ width, height }}
      >
        <span className="text-white font-bold text-lg tracking-tight">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={width}
      height={height}
      className="object-contain"
      onError={() => setErrored(true)}
    />
  );
}

// ─── Sector color dots ────────────────────────────────────────────────────────

function sectorColor(sector: string): string {
  const s = sector.toLowerCase();
  if (s.includes("santé") || s.includes("sante")) return "bg-green-500";
  if (s.includes("wash") || s.includes("eau") || s.includes("eha")) return "bg-blue-500";
  if (s.includes("protection") || s.includes("enfant")) return "bg-orange-500";
  if (s.includes("éducation") || s.includes("education")) return "bg-yellow-500";
  if (s.includes("urgence")) return "bg-red-500";
  if (s.includes("nutrition")) return "bg-emerald-500";
  if (s.includes("psycho") || s.includes("mental") || s.includes("pss")) return "bg-purple-500";
  if (s.includes("environnement")) return "bg-teal-500";
  if (s.includes("abri") || s.includes("ame")) return "bg-amber-500";
  if (s.includes("alimentaire")) return "bg-lime-500";
  return "bg-primary";
}

// ─── Coming soon tab wrapper ──────────────────────────────────────────────────

function ComingSoonTab({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  const { t } = useTranslation("directory");
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 border-b-2 border-transparent opacity-70 cursor-not-allowed"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((v) => !v)}
        type="button"
      >
        {icon}
        <span>{label}</span>
        <Lock size={12} className="text-gray-300" />
      </button>
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap z-10 shadow-lg">
          {t("coming_soon_tooltip")}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  org: Organisation;
}

export default function OrgProfilePage({ org }: Props) {
  const { t } = useTranslation("directory");
  const [territoriesOpen, setTerritoriesOpen] = useState(false);

  const visibleSectors = org.sectors.slice(0, 4);
  const extraSectors = org.sectors.length - 4;

  return (
    <>
      <Head>
        <title>{org.acronym} — ToGETHER Networking RDCongo</title>
        <meta name="description" content="ToGETHER Networking RDCongo connecte les acteurs humanitaires locaux pour renforcer la collaboration et le leadership local en République Démocratique du Congo." />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        {/* Back navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            href="/directory"
            className="text-sm text-primary hover:underline font-medium"
          >
            {t("back_to_directory")}
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white shadow-sm mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <p className="text-sm text-gray-400 mb-6">
              <Link href="/directory" className="hover:text-primary transition-colors">
                {t("breadcrumb_directory")}
              </Link>
              {" → "}
              <span className="text-gray-600">{org.name}</span>
            </p>

            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Logo */}
              <div className="rounded-xl border border-gray-100 shadow-sm p-4 bg-white flex-shrink-0 flex items-center justify-center">
                <OrgLogo src={org.logo_url} name={org.acronym} width={160} height={120} />
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900">{org.acronym}</h1>
                <p className="text-lg text-gray-500 font-normal mt-1">{org.full_name}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {org.verified && (
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 rounded-full px-3 py-1 text-sm font-medium">
                      <CheckCircle size={14} />
                      {t("verified_org")}
                    </span>
                  )}
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                    {t("member_since")} {org.founded}
                  </span>
                  <span className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm font-medium">
                    {org.province_primary}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 mt-3">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500">
                    {org.city}, {org.province_primary} — RD Congo
                  </span>
                </div>

                {/* Sector pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {visibleSectors.map((s) => (
                    <span
                      key={s}
                      className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium"
                    >
                      {s}
                    </span>
                  ))}
                  {extraSectors > 0 && (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full">
                      +{extraSectors}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick contact card */}
              <div className="bg-primary/5 rounded-xl p-5 min-w-[220px] w-full lg:w-auto flex-shrink-0">
                <p className="font-semibold text-gray-900 mb-4">{t("contact")}</p>
                <div className="flex flex-col gap-3">
                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-primary hover:underline"
                    >
                      <Globe size={15} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{org.website.replace(/^https?:\/\//, "")}</span>
                    </a>
                  )}
                  {org.contact_email && (
                    <a
                      href={`mailto:${org.contact_email}`}
                      className="flex items-center gap-2.5 text-sm text-primary hover:underline"
                    >
                      <Mail size={15} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{org.contact_email}</span>
                    </a>
                  )}
                  {org.contact_phone && (
                    <a
                      href={`tel:${org.contact_phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2.5 text-sm text-primary hover:underline"
                    >
                      <Phone size={15} className="text-gray-400 flex-shrink-0" />
                      <span>{org.contact_phone}</span>
                    </a>
                  )}
                  {org.social?.twitter && (
                    <a
                      href={org.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-primary hover:underline"
                    >
                      <Link2 size={15} className="text-gray-400 flex-shrink-0" />
                      <span>Twitter / X</span>
                    </a>
                  )}
                  {org.social?.facebook && (
                    <a
                      href={org.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-primary hover:underline"
                    >
                      <Link2 size={15} className="text-gray-400 flex-shrink-0" />
                      <span>Facebook</span>
                    </a>
                  )}
                  <button
                    type="button"
                    className="mt-1 w-full py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                  >
                    {t("view_on_map")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-50 border-y border-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center gap-1">
                <Briefcase size={20} className="text-primary" />
                <p className="text-2xl font-bold text-primary">
                  {org.stats.projects_completed}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {t("projects_completed")}
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Users size={20} className="text-primary" />
                <p className="text-2xl font-bold text-primary">
                  {org.stats.people_helped.toLocaleString("fr-FR")}+
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {t("people_helped")}
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Users size={20} className="text-primary" />
                <p className="text-2xl font-bold text-primary">
                  {org.stats.partners_count}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {t("partners")}
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Map size={20} className="text-primary" />
                <p className="text-2xl font-bold text-primary">
                  {org.provinces_covered.length}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {t("active_provinces")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* Tab bar */}
          <div className="border-b border-gray-200 flex gap-0 overflow-x-auto">
            {/* Active tab: Aperçu */}
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary whitespace-nowrap"
            >
              <Info size={15} />
              {t("about")}
            </button>

            <ComingSoonTab
              label={t("members")}
              icon={<Users size={15} />}
            />
            <ComingSoonTab
              label={t("funding")}
              icon={<Briefcase size={15} />}
            />
            <ComingSoonTab
              label={t("network")}
              icon={<Globe size={15} />}
            />
          </div>

          {/* Tab content — Aperçu */}
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-10">
                {/* À propos */}
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    À propos
                  </h2>
                  <div className="text-gray-600 leading-relaxed space-y-3">
                    {org.description_fr.split(". ").reduce<string[][]>((acc, sentence, i) => {
                      const paraIndex = Math.floor(i / 3);
                      if (!acc[paraIndex]) acc[paraIndex] = [];
                      acc[paraIndex].push(sentence);
                      return acc;
                    }, []).map((para, i) => (
                      <p key={i}>{para.join(". ").trim()}{para[para.length - 1].endsWith(".") ? "" : "."}</p>
                    ))}
                  </div>
                </section>

                {/* Mission */}
                <section>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                    <Target size={18} className="text-primary" />
                    {t("mission")}
                  </h2>
                  <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 leading-relaxed">
                    {org.mission_fr}
                  </blockquote>
                </section>

                {/* Zones d'intervention */}
                <section>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                    <MapPin size={18} className="text-primary" />
                    {t("intervention_zones")}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {org.provinces_covered.map((p) => (
                      <span
                        key={p}
                        className="bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  {org.territories_sud_kivu && org.territories_sud_kivu.length > 0 && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setTerritoriesOpen((v) => !v)}
                        className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                      >
                        {t("see_territories")}
                        {territoriesOpen ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>
                      {territoriesOpen && (
                        <ul className="mt-3 space-y-1.5">
                          {org.territories_sud_kivu.map((territory) => (
                            <li
                              key={territory}
                              className="text-sm text-gray-600 pl-3 border-l-2 border-primary/30"
                            >
                              {territory}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </section>

                {/* Secteurs d'intervention */}
                <section>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                    <Info size={18} className="text-primary" />
                    {t("sectors")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {org.sectors.map((sector) => (
                      <div
                        key={sector}
                        className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3"
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${sectorColor(sector)}`}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {sector}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Informations clés */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">{t("key_info")}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm text-gray-500 flex-shrink-0">{t("founded")}</span>
                      <span className="text-sm font-medium text-gray-900">{org.founded}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm text-gray-500 flex-shrink-0">{t("headquarters")}</span>
                      <span className="text-sm font-medium text-gray-900 text-right">
                        {org.headquarters ?? `${org.city}, ${org.province_primary}`}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm text-gray-500 flex-shrink-0">{t("status_label")}</span>
                      <span className="flex items-center gap-1 text-sm font-medium text-green-700">
                        <CheckCircle size={13} />
                        {t("verified")}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm text-gray-500 flex-shrink-0">{t("last_updated")}</span>
                      <span className="text-sm font-medium text-gray-900">2026</span>
                    </div>
                  </div>
                </div>

                {/* Ressources en ligne */}
                {(org.website || org.social?.twitter || org.social?.facebook) && (
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">{t("online_resources")}</h3>
                    <div className="space-y-2">
                      {org.website && (
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <Globe size={15} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-primary group-hover:underline flex-1 truncate">
                            {org.website.replace(/^https?:\/\//, "")}
                          </span>
                          <ExternalLink size={12} className="text-gray-300" />
                        </a>
                      )}
                      {org.social?.twitter && (
                        <a
                          href={org.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <Link2 size={15} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-primary group-hover:underline flex-1">
                            Twitter / X
                          </span>
                          <ExternalLink size={12} className="text-gray-300" />
                        </a>
                      )}
                      {org.social?.facebook && (
                        <a
                          href={org.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <Link2 size={15} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-primary group-hover:underline flex-1">
                            Facebook
                          </span>
                          <ExternalLink size={12} className="text-gray-300" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA — Faire partie du réseau */}
                <div className="bg-gradient-to-br from-[#006e8c] to-[#00536b] rounded-xl p-5 text-white">
                  <h3 className="font-semibold text-white mb-2">{t("join_network")}</h3>
                  <p className="text-sm font-medium text-white/90 mb-1">{t("join_prompt")}</p>
                  <p className="text-sm text-white/70 mb-4 leading-relaxed">
                    {t("join_description")}
                  </p>
                  <Link
                    href="/register/ngo"
                    className="block w-full py-2.5 text-center bg-white text-primary font-semibold text-sm rounded-lg hover:bg-white/90 transition-colors"
                  >
                    {t("register_now")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// org_001 has its own dedicated page at /directory/org_001.tsx
const DEDICATED_PAGES = new Set(["org_001"]);

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = organizations
    .filter((org) => !DEDICATED_PAGES.has(org.id))
    .map((org) => ({ params: { id: org.id } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const id = params?.id as string;
  const org = organizations.find((o) => o.id === id);

  if (!org) {
    return { redirect: { destination: "/directory", permanent: false } };
  }

  return {
    props: {
      org,
      ...(await serverSideTranslations(locale ?? "fr", ["common", "directory"])),
    },
  };
};
