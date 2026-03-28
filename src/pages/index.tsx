import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LandingHero from "@/components/modules/landing/LandingHero";
import LandingStats from "@/components/modules/landing/LandingStats";
import LandingModules from "@/components/modules/landing/LandingModules";
import LandingHowItWorks from "@/components/modules/landing/LandingHowItWorks";
import LandingAudience from "@/components/modules/landing/LandingAudience";
import LandingStories from "@/components/modules/landing/LandingStories";
import LandingCTA from "@/components/modules/landing/LandingCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingModules />
        <LandingHowItWorks />
        <LandingAudience />
        <LandingStories />
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
