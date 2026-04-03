import type { GetStaticProps } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LandingHero from "@/components/modules/landing/LandingHero";
import LandingStats from "@/components/modules/landing/LandingStats";
import LandingModules from "@/components/modules/landing/LandingModules";
import LandingHowItWorks from "@/components/modules/landing/LandingHowItWorks";
import LandingAudience from "@/components/modules/landing/LandingAudience";
import LandingStories from "@/components/modules/landing/LandingStories";
import LandingPartners from "@/components/modules/landing/LandingPartners";
import LandingCTA from "@/components/modules/landing/LandingCTA";

export default function Home() {
  return (
    <>
      <Head>
        <title>ToGETHER Networking RDCongo</title>
        <meta name="description" content="ToGETHER Networking RDCongo connecte les acteurs humanitaires locaux pour renforcer la collaboration et le leadership local en République Démocratique du Congo." />
      </Head>
      <Navbar />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingModules />
        <LandingHowItWorks />
        <LandingAudience />
        <LandingStories />
        <LandingPartners />
        <LandingCTA />
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "fr", ["common", "landing"])),
  },
});
