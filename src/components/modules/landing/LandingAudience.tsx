import { useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Building2, CheckCircle, Users } from "lucide-react";

export default function LandingAudience() {
  const { t } = useTranslation("landing");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const ongBenefits = [
    t("audience.ong_benefit1"),
    t("audience.ong_benefit2"),
    t("audience.ong_benefit3"),
    t("audience.ong_benefit4"),
    t("audience.ong_benefit5"),
  ];

  const partnerBenefits = [
    t("audience.partner_benefit1"),
    t("audience.partner_benefit2"),
    t("audience.partner_benefit3"),
    t("audience.partner_benefit4"),
    t("audience.partner_benefit5"),
  ];

  return (
    <section ref={ref} className="bg-gray-light py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ONG Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 flex flex-col gap-6 shadow-sm"
          >
            <div className="inline-flex">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-light rounded-xl w-fit">
                <Building2 size={20} className="text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black">{t("audience.ong_title")}</h3>
            <ul className="flex flex-col gap-3 flex-1">
              {ongBenefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link href="/register/ngo" className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors mt-2 text-center block">
              {t("audience.ong_cta")}
            </Link>
          </motion.div>

          {/* Partner Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 flex flex-col gap-6 shadow-sm"
          >
            <div className="inline-flex">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl w-fit">
                <Users size={20} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">{t("audience.partner_title")}</h3>
            <ul className="flex flex-col gap-3 flex-1">
              {partnerBenefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white/80 text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link href="/register/partner" className="w-full py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-primary-light transition-colors mt-2 text-center block">
              {t("audience.partner_cta")}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
