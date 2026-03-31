import { useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import { motion, useInView } from "framer-motion";
import {
  Building2,
  DollarSign,
  Calendar,
  BookOpen,
  MessageSquare,
  BarChart3,
} from "lucide-react";

const CARDS = [
  {
    iconKey: "building2",
    iconColor: "text-primary",
    iconBg: "bg-primary-light",
    titleKey: "card1_title",
    descKey: "card1_desc",
    linkKey: "card1_link",
    linkColor: "text-primary",
  },
  {
    iconKey: "dollar",
    iconColor: "text-accent",
    iconBg: "bg-accent-light",
    titleKey: "card2_title",
    descKey: "card2_desc",
    linkKey: "card2_link",
    linkColor: "text-accent",
  },
  {
    iconKey: "calendar",
    iconColor: "text-primary",
    iconBg: "bg-primary-light",
    titleKey: "card3_title",
    descKey: "card3_desc",
    linkKey: "card3_link",
    linkColor: "text-primary",
  },
  {
    iconKey: "book",
    iconColor: "text-accent",
    iconBg: "bg-accent-light",
    titleKey: "card4_title",
    descKey: "card4_desc",
    linkKey: "card4_link",
    linkColor: "text-accent",
  },
  {
    iconKey: "message",
    iconColor: "text-primary",
    iconBg: "bg-primary-light",
    titleKey: "card5_title",
    descKey: "card5_desc",
    linkKey: "card5_link",
    linkColor: "text-primary",
  },
  {
    iconKey: "barchart",
    iconColor: "text-accent",
    iconBg: "bg-accent-light",
    titleKey: "card6_title",
    descKey: "card6_desc",
    linkKey: "card6_link",
    linkColor: "text-accent",
  },
];

function CardIcon({ iconKey, className }: { iconKey: string; className: string }) {
  switch (iconKey) {
    case "building2": return <Building2 size={22} className={className} />;
    case "dollar": return <DollarSign size={22} className={className} />;
    case "calendar": return <Calendar size={22} className={className} />;
    case "book": return <BookOpen size={22} className={className} />;
    case "message": return <MessageSquare size={22} className={className} />;
    case "barchart": return <BarChart3 size={22} className={className} />;
    default: return null;
  }
}

export default function LandingModules() {
  const { t } = useTranslation("landing");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="repertoire" className="bg-gray-light py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
            {t("modules.label")}
          </p>
          <h2 className="text-3xl font-bold text-black mb-4">{t("modules.title")}</h2>
          <p className="text-gray max-w-2xl mx-auto leading-relaxed">
            {t("modules.subtitle")}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 transition-all duration-200 ease-in-out cursor-pointer group"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${card.iconBg} mb-5`}
              >
                <CardIcon iconKey={card.iconKey} className={card.iconColor} />
              </div>
              <h3 className="font-bold text-black text-lg mb-2">
                {t(`modules.${card.titleKey}`)}
              </h3>
              <p className="text-gray text-sm leading-relaxed mb-5">
                {t(`modules.${card.descKey}`)}
              </p>
              <span
                className={`text-sm font-semibold ${card.linkColor} opacity-80 group-hover:opacity-100 group-hover:underline`}
              >
                {t(`modules.${card.linkKey}`)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
