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
  Building2, FileText, User, CheckCircle, MessageCircle,
  Mail, Quote, Loader2, Check,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FileUploadZone from "@/components/register/FileUploadZone";
import { DRC_PROVINCES } from "@/components/register/ProvinceMultiSelect";
import SectorTree from "@/components/register/SectorTree";
import GeoZoneSelector from "@/components/register/GeoZoneSelector";
import TermsModal from "@/components/register/TermsModal";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1959 }, (_, i) => CURRENT_YEAR - i);

const TEAM_SIZES = ["team_lt10", "team_10_25", "team_26_50", "team_51_100", "team_gt100"] as const;

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  // Step 1
  orgName: z.string().min(1, "Ce champ est obligatoire"),
  legalNumber: z.string().min(1, "Ce champ est obligatoire"),
  yearFounded: z.string().min(1, "Ce champ est obligatoire"),
  province: z.string().min(1, "Ce champ est obligatoire"),
  city: z.string().min(1, "Ce champ est obligatoire"),
  orgEmail: z.string().email("Veuillez entrer un email valide"),
  phone: z.string().min(8, "Veuillez entrer un numéro de téléphone valide"),
  website: z.string().optional(),
  // Step 2
  sectors: z.array(z.string()).min(1, "Veuillez sélectionner au moins un secteur d'intervention."),
  zones: z.array(z.string()).min(1, "Veuillez sélectionner au moins une zone géographique d'intervention."),
  teamSize: z.string().min(1, "Ce champ est obligatoire"),
  description: z.string().min(1, "Ce champ est obligatoire").max(300, "La description ne peut pas dépasser 300 caractères"),
  mission: z.string().min(1, "Ce champ est obligatoire"),
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
  1: ["orgName", "legalNumber", "yearFounded", "province", "city", "orgEmail", "phone"],
  2: ["sectors", "zones", "teamSize", "description", "mission"],
  3: ["contactName", "contactRole", "contactEmail", "contactPhone", "acceptTerms", "acceptData"],
};

// ─── Slide animation ──────────────────────────────────────────────────────────

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
    err ? "border-accent focus:border-accent" : "border-gray-200 focus:border-primary"
  }`;

const selectCls = (err?: string) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm bg-white text-gray-800 outline-none transition-colors appearance-none cursor-pointer ${
    err ? "border-accent" : "border-gray-200 focus:border-primary"
  }`;

// ─── Progress Indicator ───────────────────────────────────────────────────────

function ProgressIndicator({ step }: { step: number }) {
  const { t } = useTranslation("register");
  const steps = [
    { label: t("ngo.progress.step1"), icon: Building2 },
    { label: t("ngo.progress.step2"), icon: FileText },
    { label: t("ngo.progress.step3"), icon: User },
  ];

  return (
    <div className="bg-white border-b border-gray-100 py-5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile label */}
        <p className="lg:hidden text-sm font-medium text-gray-500 text-center mb-4">
          {t("common.step_of", { current: step, total: 3 })}
        </p>

        {/* Desktop steps */}
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
                      done ? "bg-primary text-white" : active ? "bg-primary text-white" : "bg-white border-2 border-gray-300 text-gray-400"
                    }`}
                  >
                    {done ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      active ? "text-primary" : done ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-32 h-0.5 mx-3 mb-5 ${
                      done ? "bg-primary" : "border-t-2 border-dashed border-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile progress bar */}
        <div className="lg:hidden w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Benefits Panel ───────────────────────────────────────────────────────────

function BenefitsPanel() {
  const { t } = useTranslation("register");
  const benefits = ["b1", "b2", "b3", "b4", "b5"];

  return (
    <div className="sticky top-24 space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 text-base mb-5">{t("ngo.benefits.title")}</h3>
        <ul className="flex flex-col gap-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{t(`ngo.benefits.${b}`)}</span>
            </li>
          ))}
        </ul>

        {/* Testimonial */}
        <div className="bg-primary-light rounded-lg p-4 mt-6">
          <Quote size={16} className="text-primary mb-2" />
          <p className="text-sm italic text-primary">{t("ngo.benefits.testimonial")}</p>
          <p className="text-xs text-gray-500 mt-2">{t("ngo.benefits.testimonial_org")}</p>
        </div>

        {/* Contact */}
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
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark"
          >
            <Mail size={15} />
            {t("common.email_contact")}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen() {
  const { t } = useTranslation("register");
  const steps = [
    { title: t("ngo.success.step1_title"), desc: t("ngo.success.step1_desc") },
    { title: t("ngo.success.step2_title"), desc: t("ngo.success.step2_desc") },
    { title: t("ngo.success.step3_title"), desc: t("ngo.success.step3_desc") },
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
        <CheckCircle size={72} className="text-primary" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("ngo.success.title")}</h2>
      <p className="text-gray-500 leading-relaxed">{t("ngo.success.subtitle")}</p>

      <div className="bg-primary-light rounded-xl p-6 mt-8 text-left">
        <p className="font-bold text-primary mb-4">{t("ngo.success.next_steps_title")}</p>
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{s.title}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-6">{t("ngo.success.contact_cta")}</p>
      <div className="flex flex-col items-center gap-2 mt-3">
        <a
          href="https://wa.me/243813183123"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors"
        >
          <MessageCircle size={15} />
          Mr. Michel Lulami
        </a>
        <a
          href="https://wa.me/243815117685"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors"
        >
          <MessageCircle size={15} />
          Mr. Xavier Mayele
        </a>
        <a
          href="mailto:contact@drctogethernetwork.org"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold text-sm hover:bg-primary/20 transition-colors"
        >
          <Mail size={15} />
          contact@drctogethernetwork.org
        </a>
      </div>

      <div className="mt-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          {t("ngo.success.home_btn")}
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RegisterNGO() {
  const { t } = useTranslation("register");
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [termsOpen, setTermsOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      sectors: [],
      zones: [],
      acceptTerms: false,
      acceptData: false,
    },
  });

  const { register, watch, setValue, formState: { errors }, trigger } = form;

  const zones = watch("zones") ?? [];
  const sectors = watch("sectors") ?? [];
  const description = watch("description") ?? "";

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
        <title>S&apos;inscrire comme ONG — ToGETHER Networking</title>
        <meta name="description" content="ToGETHER Networking RDCongo connecte les acteurs humanitaires locaux pour renforcer la collaboration et le leadership local en République Démocratique du Congo." />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex flex-col gap-4 max-w-lg">
                <span className="self-start mt-6 px-4 py-1.5 rounded-full border border-white/40 text-white text-xs font-medium">
                  {t("ngo.header.badge")}
                </span>
                <h1 className="text-3xl font-bold text-white">{t("ngo.header.title")}</h1>
                <p className="text-primary-light leading-relaxed">{t("ngo.header.subtitle")}</p>
              </div>
              <div className="flex flex-row lg:flex-col gap-6 lg:gap-4 flex-shrink-0">
                {(["stat1", "stat2", "stat3"] as const).map((k) => (
                  <div key={k} className="flex items-center gap-2 text-white">
                    <CheckCircle size={16} className="text-white/70 flex-shrink-0" />
                    <span className="text-sm font-medium">{t(`ngo.header.${k}`)}</span>
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
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{t("ngo.step1.title")}</h2>
                      <p className="text-sm text-gray-500 mb-8">{t("ngo.step1.subtitle")}</p>

                      <div className="flex flex-col gap-6">
                        {/* Full width */}
                        <InputField label={t("ngo.step1.org_name")} required error={errors.orgName?.message} helper={t("ngo.step1.org_name_helper")}>
                          <input {...register("orgName")} placeholder={t("ngo.step1.org_name_placeholder")} className={inputCls(errors.orgName?.message)} />
                        </InputField>

                        {/* 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField label={t("ngo.step1.legal_number")} required error={errors.legalNumber?.message} helper={t("ngo.step1.legal_number_helper")}>
                            <input {...register("legalNumber")} placeholder={t("ngo.step1.legal_number_placeholder")} className={inputCls(errors.legalNumber?.message)} />
                          </InputField>
                          <InputField label={t("ngo.step1.year_founded")} required error={errors.yearFounded?.message}>
                            <select {...register("yearFounded")} className={selectCls(errors.yearFounded?.message)}>
                              <option value="">{t("ngo.step1.year_founded_placeholder")}</option>
                              {YEARS.map((y) => (
                                <option key={y} value={y}>{y}</option>
                              ))}
                            </select>
                          </InputField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField label={t("ngo.step1.province")} required error={errors.province?.message}>
                            <select {...register("province")} className={selectCls(errors.province?.message)}>
                              <option value="">{t("ngo.step1.province_placeholder")}</option>
                              {DRC_PROVINCES.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </InputField>
                          <InputField label={t("ngo.step1.city")} required error={errors.city?.message}>
                            <input {...register("city")} placeholder={t("ngo.step1.city_placeholder")} className={inputCls(errors.city?.message)} />
                          </InputField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField label={t("ngo.step1.email")} required error={errors.orgEmail?.message}>
                            <input {...register("orgEmail")} type="email" placeholder={t("ngo.step1.email_placeholder")} className={inputCls(errors.orgEmail?.message)} />
                          </InputField>
                          <InputField label={t("ngo.step1.phone")} required error={errors.phone?.message}>
                            <input {...register("phone")} type="tel" placeholder={t("ngo.step1.phone_placeholder")} className={inputCls(errors.phone?.message)} />
                          </InputField>
                        </div>

                        <InputField label={t("ngo.step1.website")} error={errors.website?.message}>
                          <input {...register("website")} type="url" placeholder={t("ngo.step1.website_placeholder")} className={inputCls(errors.website?.message)} />
                        </InputField>
                      </div>

                      <div className="flex justify-end mt-8">
                        <button type="button" onClick={handleNext} className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
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
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{t("ngo.step2.title")}</h2>
                      <p className="text-sm text-gray-500 mb-8">{t("ngo.step2.subtitle")}</p>

                      <div className="flex flex-col gap-6">
                        {/* Sector tree */}
                        <InputField label={t("ngo.step2.sectors_label")} required helper={t("ngo.step2.sectors_helper")} error={errors.sectors?.message}>
                          <SectorTree
                            value={sectors}
                            onChange={(v) => setValue("sectors", v, { shouldValidate: true })}
                            error={errors.sectors?.message}
                          />
                        </InputField>

                        {/* Geographic zone selector */}
                        <InputField label={t("ngo.step2.zones_label")} required helper={t("ngo.step2.zones_helper")} error={errors.zones?.message}>
                          <GeoZoneSelector
                            value={zones}
                            onChange={(v) => setValue("zones", v, { shouldValidate: true })}
                            error={errors.zones?.message}
                          />
                        </InputField>

                        {/* Team size */}
                        <InputField label={t("ngo.step2.team_size")} required error={errors.teamSize?.message}>
                          <select {...register("teamSize")} className={selectCls(errors.teamSize?.message)}>
                            <option value="">{t("ngo.step2.team_size_placeholder")}</option>
                            {TEAM_SIZES.map((k) => (
                              <option key={k} value={k}>{t(`ngo.step2.${k}`)}</option>
                            ))}
                          </select>
                        </InputField>

                        {/* Description */}
                        <InputField label={t("ngo.step2.description")} required error={errors.description?.message}>
                          <textarea
                            {...register("description")}
                            rows={4}
                            placeholder={t("ngo.step2.description_placeholder")}
                            className={`${inputCls(errors.description?.message)} resize-none`}
                          />
                          <p className={`text-xs text-right ${description.length > 250 ? "text-accent" : "text-gray-400"}`}>
                            {description.length} / 300
                          </p>
                        </InputField>

                        {/* Mission */}
                        <InputField label={t("ngo.step2.mission")} required error={errors.mission?.message}>
                          <textarea
                            {...register("mission")}
                            rows={3}
                            placeholder={t("ngo.step2.mission_placeholder")}
                            className={`${inputCls(errors.mission?.message)} resize-none`}
                          />
                        </InputField>

                        {/* File upload */}
                        <InputField label={t("ngo.step2.cert_doc")}>
                          <FileUploadZone file={certFile} onChange={setCertFile} />
                        </InputField>
                      </div>

                      <div className="flex items-center justify-between mt-8 gap-4">
                        <button type="button" onClick={handleBack} className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                          {t("common.back")}
                        </button>
                        <button type="button" onClick={handleNext} className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
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
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{t("ngo.step3.title")}</h2>
                      <p className="text-sm text-gray-500 mb-8">{t("ngo.step3.subtitle")}</p>

                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField label={t("ngo.step3.name")} required error={errors.contactName?.message}>
                            <input {...register("contactName")} placeholder={t("ngo.step3.name_placeholder")} className={inputCls(errors.contactName?.message)} />
                          </InputField>
                          <InputField label={t("ngo.step3.role")} required error={errors.contactRole?.message}>
                            <input {...register("contactRole")} placeholder={t("ngo.step3.role_placeholder")} className={inputCls(errors.contactRole?.message)} />
                          </InputField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField label={t("ngo.step3.email")} required error={errors.contactEmail?.message} helper={t("ngo.step3.email_helper")}>
                            <input {...register("contactEmail")} type="email" placeholder={t("ngo.step3.email_placeholder")} className={inputCls(errors.contactEmail?.message)} />
                          </InputField>
                          <InputField label={t("ngo.step3.phone")} required error={errors.contactPhone?.message} helper={t("ngo.step3.phone_helper")}>
                            <input {...register("contactPhone")} type="tel" placeholder={t("ngo.step3.phone_placeholder")} className={inputCls(errors.contactPhone?.message)} />
                          </InputField>
                        </div>

                        {/* Terms */}
                        <div className="flex flex-col gap-4 pt-2">
                          <div>
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                {...register("acceptTerms")}
                                className="w-4 h-4 mt-0.5 accent-[#007FFF] cursor-pointer flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700">
                                {t("ngo.step3.terms")}{" "}
                                <button
                                  type="button"
                                  onClick={() => setTermsOpen(true)}
                                  className="text-primary underline hover:text-primary-dark"
                                >
                                  {t("ngo.step3.terms_link")}
                                </button>{" "}
                                {t("ngo.step3.terms_after")}
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
                                className="w-4 h-4 mt-0.5 accent-[#007FFF] cursor-pointer flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700">{t("ngo.step3.data_consent")}</span>
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
                          className="flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70"
                        >
                          {isLoading && <Loader2 size={16} className="animate-spin" />}
                          {t("ngo.step3.submit")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Benefits panel (desktop) */}
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
