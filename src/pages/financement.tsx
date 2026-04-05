import type { GetStaticProps } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import { useTranslation } from "next-i18next/pages";
import Link from "next/link";
import { DollarSign, Bell, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function FinancementPage() {
  const { t } = useTranslation("common");
  const p = (k: string) => t(`pages.financement.${k}`);

  const features = [p("feature1"), p("feature2"), p("feature3"), p("feature4")];

  return (
    <>
      <Head>
        <title>{p("page_title")}</title>
        <meta name="description" content={t("pages.meta_desc")} />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header band */}
        <div className="bg-gradient-to-r from-primary to-primary-dark pt-24 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              {t("pages.back_home")}
            </Link>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 rounded-2xl p-4">
                <DollarSign size={32} className="text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm font-medium uppercase tracking-widest">
                  ToGETHER Networking
                </p>
                <h1 className="text-3xl font-bold text-white mt-1">
                  {p("heading")}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Coming soon body */}
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-lg w-full text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <DollarSign size={28} className="text-primary" />
              </div>

              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-5">
                {t("pages.coming_soon")}
              </span>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {p("title")}
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {p("desc")}
              </p>

              <div className="border-t border-gray-100 my-8" />

              <div className="text-left space-y-3 mb-8">
                {features.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/directory"
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors text-center"
                >
                  {t("pages.explore_directory")}
                </Link>
                <a
                  href="https://wa.me/243813183123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Bell size={15} />
                  {t("pages.notify_launch")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "fr", ["common"])),
  },
});
