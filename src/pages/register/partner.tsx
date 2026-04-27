import { useState } from "react";
import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import { useTranslation } from "next-i18next/pages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
import {
  Building2, Handshake, User, CheckCircle, MessageCircle,
  Mail, Quote, Loader2, Check,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FileUploadZone from "@/components/register/FileUploadZone";
import SectorTree from "@/components/register/SectorTree";
import GeoZoneSelector from "@/components/register/GeoZoneSelector";
import TermsModal from "@/components/register/TermsModal";

// ─── Constants ────────────────────────────────────────────────────────────────

const ORG_TYPES = [
  { key: "bailleur" },
  { key: "ingo" },
  { key: "gov" },
  { key: "entreprise" },
  { key: "academique" },
  { key: "autre" },
] as const;

const PARTNERSHIP_TYPES = [
  { key: "financement" },
  { key: "technique" },
  { key: "plaidoyer" },
  { key: "recherche" },
  { key: "operationnel" },
  { key: "information" },
] as const;

const COUNTRIES = [
  "République Démocratique du Congo",
  "France", "Belgique", "Allemagne", "États-Unis", "Royaume-Uni",
  "Suisse", "Canada", "Pays-Bas", "Italie", "Espagne", "Suède",
  "Norvège", "Danemark", "Finlande", "Autriche", "Luxembourg",
  "Japon", "Australie", "Kenya", "Rwanda", "Ouganda", "Tanzanie",
  "Autre",
];

const FUNDING_OPTIONS = [
  "funding_prefer_not", "funding_lt50k", "funding_50k_250k",
  "funding_250k_1m", "funding_1m_5m", "funding_gt5m",
] as const;

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  // Step 1
  orgName: z.string().min(1, "Ce champ est obligatoire"),
  orgType: z.string().min(1, "Ce champ est obligatoire"),
  country: z.string().min(1, "Ce champ est obligatoire"),
  website: z.string().min(1, "Ce champ est obligatoire"),
  orgEmail: z.string().email("Veuillez entrer un email valide"),
  phone: z.string().optional(),
  // Step 2
  partnershipTypes: z.array(z.string()).min(1, "Veuillez sélectionner au moins une option"),
  sectors: z.array(z.string()).min(1, "Veuillez sélectionner au moins un secteur d'intérêt."),
  provinces: z.array(z.string()).min(1, "Veuillez sélectionner au moins une zone géographique d'intérêt."),
  fundingCapacity: z.string().optional(),
  description: z.string().min(1, "Ce champ est obligatoire").max(400, "La description ne peut pas dépasser 400 caractères"),
  // Step 3
  contactName: z.string().min(1, "Ce champ est obligatoire"),
  contactRole: z.string().min(1, "Ce champ est obligatoire"),
  contactEmail: z.string().email("Veuillez entrer un email valide"),
  contactPhone: z.string().min(8, "Veuillez entrer un numéro de téléphone valide"),
  acceptTerms: z.boolean().refine((v) => v === true, "Veuillez accepter les conditions d'utilisation"),
  acceptData: z.boolean().refine((v) => v === true, "Ce champ est obligatoire"),
});

type FormData = z.infer<typeof schema>;

const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  1: ["orgName", "orgType", "country", "website", "orgEmail"],
  2: ["partnershipTypes", "sectors", "provinces", "description"],
  3: ["contactName", "contactRole", "contactEmail", "contactPhone", "acceptTerms", "acceptData"],
};

// ─── Slide animation ──────────────────────────────────────────────────────────

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

// ─── Shared field primitives ──────────────────────────────────────────────────

function InputField({
  label, required, error, helper, children,
}: {
  label: string; required?: boolean; error?: string; helper?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      {children}
      {helper && !error && <p className="text-xs text-gray-400">{helper}</p>}
      {error && <p className="text-xs text-accent">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors ${
    err ? "border-accent focus:border-accent" : "border-gray-200 focus:border-[#A60F30]"
  }`;

const selectCls = (err?: string) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm bg-white text-gray-800 outline-none transition-colors appearance-none cursor-pointer ${
    err ? "border-accent" : "border-gray-200 focus:border-[#A60F30]"
  }`;

// ─── Progress Indicator (crimson) ────────────────────────────────────────────

function ProgressIndicator({ step }: { step: number }) {
  const { t } = useTranslation("register");
  const steps = [
    { label: t("partner.progress.step1"), icon: Building2 },
    { label: t("partner.progress.step2"), icon: Handshake },
    { label: t("partner.progress.step3"), icon: User },
  ];

  return (
    <div className="bg-white border-b border-gray-100 py-5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="lg:hidden text-sm font-medium text-gray-500 text-center mb-4">
          {t("common.step_of", { current: step, total: 3 })}
        </p>

        <div className="hidden lg:flex items-center justify-center gap-0">
          {steps.map((s, i) => {
            const idx = i + 1;
            const done = step > idx;
            const active = step === idx;
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      done || active ? "bg-[#A60F30] text-white" : "bg-white border-2 border-gray-300 text-gray-400"
                    }`}
                  >
                    {done ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      active || done ? "text-[#A60F30]" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-32 h-0.5 mx-3 mb-5 ${
                      done ? "bg-[#A60F30]" : "border-t-2 border-dashed border-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="lg:hidden w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-[#A60F30] h-2 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Benefits Panel (crimson) ─────────────────────────────────────────────────

function BenefitsPanel() {
  const { t } = useTranslation("register");
  const benefits = ["b1", "b2", "b3", "b4", "b5"];

  return (
    <div className="sticky top-24 space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 text-base mb-5">{t("partner.benefits.title")}</h3>
        <ul className="flex flex-col gap-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <CheckCircle size={16} className="text-[#A60F30] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{t(`partner.benefits.${b}`)}</span>
            </li>
          ))}
        </ul>

        <div className="bg-[#FAEAED] rounded-lg p-4 mt-6">
          <Quote size={16} className="text-[#A60F30] mb-2" />
          <p className="text-sm italic text-[#A60F30]">{t("partner.benefits.testimonial")}</p>
          <p className="text-xs text-gray-500 mt-2">{t("partner.benefits.testimonial_org")}</p>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">{t("common.contact_help")}</p>
          <a
            href="https://wa.me/243813183123"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 mb-2"
          >
            <MessageCircle size={15} />
            {t("common.whatsapp_contact")}
          </a>
          <a
            href="https://wa.me/243815117685"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 mb-2"
          >
            <MessageCircle size={15} />
            {t("common.whatsapp_contact_2")}
          </a>
          <a
            href="mailto:contact@drctogethernetwork.org"
            className="flex items-center gap-2 text-sm text-[#A60F30] hover:text-[#7A0A23]"
          >
            <Mail size={15} />
            {t("common.email_contact")}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Success Screen (crimson) ─────────────────────────────────────────────────

function SuccessScreen() {
  const { t } = useTranslation("register");
  const steps = [
    { title: t("partner.success.step1_title"), desc: t("partner.success.step1_desc") },
    { title: t("partner.success.step2_title"), desc: t("partner.success.step2_desc") },
    { title: t("partner.success.step3_title"), desc: t("partner.success.step3_desc") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-lg mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex justify-center mb-6"
      >
        <CheckCircle size={72} className="text-[#A60F30]" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("partner.success.title")}</h2>
      <p className="text-gray-500 leading-relaxed">{t("partner.success.subtitle")}</p>

      <div className="bg-[#FAEAED] rounded-xl p-6 mt-8 text-left">
        <p className="font-bold text-[#A60F30] mb-4">{t("partner.success.next_steps_title")}</p>
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
            <div className="w-6 h-6 rounded-full bg-[#A60F30] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{s.title}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-6">{t("partner.success.contact_cta")}</p>
      <a
        href="https://wa.me/243813183123"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-3 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors"
      >
        <MessageCircle size={16} />
        {t("partner.success.whatsapp_btn")}
      </a>

      <div className="mt-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          {t("partner.success.home_btn")}
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RegisterPartner() {
  const { t } = useTranslation("register");
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  const [termsOpen, setTermsOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      partnershipTypes: [],
      sectors: [],
      provinces: [],
      acceptTerms: false,
      acceptData: false,
    },
  });

  const { register, watch, setValue, formState: { errors }, trigger } = form;

  const orgType = watch("orgType");
  const partnershipTypes = watch("partnershipTypes") ?? [];
  const sectors = watch("sectors") ?? [];
  const provinces = watch("provinces") ?? [];
  const description = watch("description") ?? "";

  const toggleArray = (key: keyof FormData, item: string) => {
    const current = (watch(key) as string[]) ?? [];
    const next = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    setValue(key, next, { shouldValidate: true });
  };

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as (keyof FormData)[]);
    if (!valid) return;
    setDirection(1);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    const valid = await trigger(STEP_FIELDS[3] as (keyof FormData)[]);
    if (!valid) return;
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <>
      <Head>
        <title>S&apos;inscrire comme Partenaire — ToGETHER Networking</title>
        <meta name="description" content="ToGETHER Networking RDCongo connecte les acteurs humanitaires locaux pour renforcer la collaboration et le leadership local en République Démocratique du Congo." />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="py-14" style={{ background: "linear-gradient(to right, #A60F30, #7A0A23)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex flex-col gap-4 max-w-lg">
                <span className="self-start mt-6 px-4 py-1.5 rounded-full border border-white/40 text-white text-xs font-medium">
                  {t("partner.header.badge")}
                </span>
                <h1 className="text-3xl font-bold text-white">{t("partner.header.title")}</h1>
                <p className="text-red-200 leading-relaxed">{t("partner.header.subtitle")}</p>
              </div>
              <div className="flex flex-row lg:flex-col gap-6 lg:gap-4 flex-shrink-0">
                {(["stat1", "stat2", "stat3"] as const).map((k) => (
                  <div key={k} className="flex items-center gap-2 text-white">
                    <CheckCircle size={16} className="text-white/70 flex-shrink-0" />
                    <span className="text-sm font-medium">{t(`partner.header.${k}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!isSuccess && <ProgressIndicator step={step} />}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isSuccess ? (
            <SuccessScreen />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form area */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait" custom={direction}>
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
                    >
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{t("partner.step1.title")}</h2>
                      <p className="text-sm text-gray-500 mb-8">{t("partner.step1.subtitle")}</p>

                      <div className="flex flex-col gap-6">
                        <InputField label={t("partner.step1.org_name")} required error={errors.orgName?.message}>
                          <input {...register("orgName")} placeholder={t("partner.step1.org_name_placeholder")} className={inputCls(errors.orgName?.message)} />
                        </InputField>

                        {/* Org type cards */}
                        <InputField label={t("partner.step1.org_type")} required error={errors.orgType?.message}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                            {ORG_TYPES.map((ot) => {
                              const active = orgType === ot.key;
                              return (
                                <button
                                  key={ot.key}
                                  type="button"
                                  onClick={() => setValue("orgType", ot.key, { shouldValidate: true })}
                                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                                    active ? "border-[#A60F30] bg-[#FAEAED]" : "border-gray-200 hover:border-[#A60F30]/40"
                                  }`}
                                >
                                  <div>
                                    <p className={`text-sm font-semibold ${active ? "text-[#A60F30]" : "text-gray-800"}`}>
                                      {t(`partner.step1.type_${ot.key}`)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {t(`partner.step1.type_${ot.key}_desc`)}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </InputField>

                        <InputField label={t("partner.step1.country")} required error={errors.country?.message}>
                          <select {...register("country")} className={selectCls(errors.country?.message)}>
                            <option value="">{t("partner.step1.country_placeholder")}</option>
                            {COUNTRIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </InputField>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField label={t("partner.step1.website")} required error={errors.website?.message}>
                            <input {...register("website")} type="url" placeholder={t("partner.step1.website_placeholder")} className={inputCls(errors.website?.message)} />
                          </InputField>
                          <InputField label={t("partner.step1.email")} required error={errors.orgEmail?.message}>
                            <input {...register("orgEmail")} type="email" placeholder={t("partner.step1.email_placeholder")} className={inputCls(errors.orgEmail?.message)} />
                          </InputField>
                        </div>

                        <InputField label={t("partner.step1.phone")} error={errors.phone?.message}>
                          <input {...register("phone")} type="tel" placeholder={t("partner.step1.phone_placeholder")} className={inputCls(errors.phone?.message)} />
                        </InputField>
                      </div>

                      <div className="flex justify-end mt-8">
                        <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#A60F30] text-white font-semibold rounded-xl hover:bg-[#7A0A23] transition-colors">
                          {t("common.next")}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
                    >
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{t("partner.step2.title")}</h2>
                      <p className="text-sm text-gray-500 mb-8">{t("partner.step2.subtitle")}</p>

                      <div className="flex flex-col gap-6">
                        {/* Partnership type toggle cards */}
                        <InputField
                          label={t("partner.step2.partnership_types")}
                          required
                          helper={t("partner.step2.partnership_helper")}
                          error={errors.partnershipTypes?.message}
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                            {PARTNERSHIP_TYPES.map((pt) => {
                              const active = partnershipTypes.includes(pt.key);
                              return (
                                <button
                                  key={pt.key}
                                  type="button"
                                  onClick={() => toggleArray("partnershipTypes", pt.key)}
                                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                                    active ? "border-[#A60F30] bg-[#FAEAED] text-[#A60F30]" : "border-gray-200 hover:border-[#A60F30]/40"
                                  }`}
                                >
                                  <div>
                                    <p className={`text-sm font-semibold ${active ? "text-[#A60F30]" : "text-gray-800"}`}>
                                      {t(`partner.step2.type_${pt.key}`)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {t(`partner.step2.type_${pt.key}_desc`)}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </InputField>

                        {/* Sectors tree */}
                        <InputField label={t("partner.step2.sectors_label")} required helper={t("partner.step2.sectors_helper")} error={errors.sectors?.message}>
                          <SectorTree
                            value={sectors}
                            onChange={(v) => setValue("sectors", v, { shouldValidate: true })}
                            error={errors.sectors?.message}
                          />
                        </InputField>

                        {/* Geographic zone selector */}
                        <InputField label={t("partner.step2.provinces_label")} required helper={t("partner.step2.provinces_helper")} error={errors.provinces?.message}>
                          <GeoZoneSelector
                            value={provinces}
                            onChange={(v) => setValue("provinces", v, { shouldValidate: true })}
                            error={errors.provinces?.message}
                          />
                        </InputField>

                        {/* Funding capacity */}
                        <InputField label={t("partner.step2.funding_capacity")}>
                          <select {...register("fundingCapacity")} className={selectCls()}>
                            <option value="">{t("partner.step2.funding_placeholder")}</option>
                            {FUNDING_OPTIONS.map((k) => (
                              <option key={k} value={k}>{t(`partner.step2.${k}`)}</option>
                            ))}
                          </select>
                        </InputField>

                        {/* Description */}
                        <InputField label={t("partner.step2.description")} required error={errors.description?.message}>
                          <textarea
                            {...register("description")}
                            rows={4}
                            placeholder={t("partner.step2.description_placeholder")}
                            className={`${inputCls(errors.description?.message)} resize-none`}
                          />
                          <p className={`text-xs text-right ${description.length > 350 ? "text-accent" : "text-gray-400"}`}>
                            {description.length} / 400
                          </p>
                        </InputField>

                        {/* File upload */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-gray-800">{t("partner.step2.presentation_doc")}</label>
                          <p className="text-xs text-gray-400 mb-1">{t("partner.step2.presentation_doc_helper")}</p>
                          <FileUploadZone file={presentationFile} onChange={setPresentationFile} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8 gap-4">
                        <button type="button" onClick={handleBack} className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                          {t("common.back")}
                        </button>
                        <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#A60F30] text-white font-semibold rounded-xl hover:bg-[#7A0A23] transition-colors">
                          {t("common.next")}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
                    >
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{t("partner.step3.title")}</h2>
                      <p className="text-sm text-gray-500 mb-8">{t("partner.step3.subtitle")}</p>

                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField label={t("partner.step3.name")} required error={errors.contactName?.message}>
                            <input {...register("contactName")} placeholder={t("partner.step3.name_placeholder")} className={inputCls(errors.contactName?.message)} />
                          </InputField>
                          <InputField label={t("partner.step3.role")} required error={errors.contactRole?.message}>
                            <input {...register("contactRole")} placeholder={t("partner.step3.role_placeholder")} className={inputCls(errors.contactRole?.message)} />
                          </InputField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField label={t("partner.step3.email")} required error={errors.contactEmail?.message} helper={t("partner.step3.email_helper")}>
                            <input {...register("contactEmail")} type="email" placeholder={t("partner.step3.email_placeholder")} className={inputCls(errors.contactEmail?.message)} />
                          </InputField>
                          <InputField label={t("partner.step3.phone")} required error={errors.contactPhone?.message} helper={t("partner.step3.phone_helper")}>
                            <input {...register("contactPhone")} type="tel" placeholder={t("partner.step3.phone_placeholder")} className={inputCls(errors.contactPhone?.message)} />
                          </InputField>
                        </div>

                        <div className="flex flex-col gap-4 pt-2">
                          <div>
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                {...register("acceptTerms")}
                                className="w-4 h-4 mt-0.5 accent-[#A60F30] cursor-pointer flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700">
                                {t("partner.step3.terms")}{" "}
                                <button
                                  type="button"
                                  onClick={() => setTermsOpen(true)}
                                  className="text-[#A60F30] underline hover:text-[#7A0A23]"
                                >
                                  {t("partner.step3.terms_link")}
                                </button>{" "}
                                {t("partner.step3.terms_after")}
                              </span>
                            </label>
                            {errors.acceptTerms && (
                              <p className="text-accent text-xs mt-1 ml-7">{errors.acceptTerms.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                {...register("acceptData")}
                                className="w-4 h-4 mt-0.5 accent-[#A60F30] cursor-pointer flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700">{t("partner.step3.data_consent")}</span>
                            </label>
                            {errors.acceptData && (
                              <p className="text-accent text-xs mt-1 ml-7">{errors.acceptData.message}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8 gap-4">
                        <button type="button" onClick={handleBack} className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                          {t("common.back")}
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-3 bg-[#A60F30] text-white font-semibold rounded-xl hover:bg-[#7A0A23] transition-colors disabled:opacity-70"
                        >
                          {isLoading && <Loader2 size={16} className="animate-spin" />}
                          {t("partner.step3.submit")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Benefits panel */}
              <div className="hidden lg:block">
                <BenefitsPanel />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {termsOpen && <TermsModal onClose={() => setTermsOpen(false)} />}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "fr", ["common", "register"])),
  },
});
