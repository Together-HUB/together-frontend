import { useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import { motion, useInView } from "framer-motion";
import { UserPlus, Search, TrendingUp } from "lucide-react";

export default function LandingHowItWorks() {
  const { t } = useTranslation("landing");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      num: "01",
      icon: <UserPlus size={22} className="text-primary" />,
      title: t("how_it_works.step1_title"),
      desc: t("how_it_works.step1_desc"),
      active: false,
    },
    {
      num: "02",
      icon: <Search size={22} className="text-white" />,
      title: t("how_it_works.step2_title"),
      desc: t("how_it_works.step2_desc"),
      active: true,
    },
    {
      num: "03",
      icon: <TrendingUp size={22} className="text-primary" />,
      title: t("how_it_works.step3_title"),
      desc: t("how_it_works.step3_desc"),
      active: false,
    },
  ];

  return (
    <section ref={ref} className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
            {t("how_it_works.label")}
          </p>
          <h2 className="text-3xl font-bold text-black">{t("how_it_works.title")}</h2>
        </div>

        {/* Steps */}
        <div className="relative flex flex-col lg:flex-row items-start justify-center gap-10 lg:gap-0">
          {/* Dashed connector line on desktop */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[18%] right-[18%] h-0 border-t-2 border-dashed border-primary/25 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative z-10 flex-1 flex flex-col items-center text-center px-6 lg:px-8"
            >
              {/* Icon above circle */}
              <div className="mb-3 h-7 flex items-center justify-center">
                {step.icon}
              </div>

              {/* Step circle */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-6 transition-transform ${
                  step.active
                    ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                    : "bg-white border-2 border-primary text-primary"
                }`}
              >
                {step.num}
              </div>

              <h3 className="font-bold text-black text-lg mb-2">{step.title}</h3>
              <p className="text-gray text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
