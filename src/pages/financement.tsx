import type { GetStaticProps } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import Link from "next/link";
import { DollarSign, Bell, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function FinancementPage() {
  return (
    <>
      <Head>
        <title>Financement — ToGETHER Networking</title>
        <meta name="description" content="ToGETHER Networking RDCongo connecte les acteurs humanitaires locaux pour renforcer la collaboration et le leadership local en République Démocratique du Congo." />
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
              Retour à l&apos;accueil
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
                  Financement
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Coming soon body */}
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-lg w-full text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <DollarSign size={28} className="text-primary" />
              </div>

              {/* Badge */}
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-5">
                Prochainement disponible
              </span>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Opportunités de Financement
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Le module de financement centralisera les appels à projets, subventions et opportunités de partenariat destinés aux ONG locales de la RDC. Restez informé dès son lancement.
              </p>

              {/* Divider */}
              <div className="border-t border-gray-100 my-8" />

              {/* What to expect */}
              <div className="text-left space-y-3 mb-8">
                {[
                  "Appels à projets ECHO, AFD, UNICEF et plus",
                  "Filtres par province, secteur et montant",
                  "Alertes email dès la publication d'une nouvelle opportunité",
                  "Suivi de vos candidatures en temps réel",
                ].map((item, i) => (
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
                  Explorer le répertoire
                </Link>
                <a
                  href="https://wa.me/243813183123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Bell size={15} />
                  Me notifier au lancement
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
