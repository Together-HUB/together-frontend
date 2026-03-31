import { useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

export default function LandingStories() {
  const { t } = useTranslation("landing");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stories = [
    {
      badge: t("stories.badge1"),
      badgeBg: "bg-primary-light",
      badgeText: "text-primary",
      borderColor: "border-primary",
      quote: t("stories.quote1"),
      org: t("stories.org1"),
      metric: t("stories.metric1"),
      metricColor: "text-primary",
    },
    {
      badge: t("stories.badge2"),
      badgeBg: "bg-accent-light",
      badgeText: "text-accent",
      borderColor: "border-accent",
      quote: t("stories.quote2"),
      org: t("stories.org2"),
      metric: t("stories.metric2"),
      metricColor: "text-accent",
    },
    {
      badge: t("stories.badge3"),
      badgeBg: "bg-primary-light",
      badgeText: "text-primary",
      borderColor: "border-primary",
      quote: t("stories.quote3"),
      org: t("stories.org3"),
      metric: t("stories.metric3"),
      metricColor: "text-primary",
    },
  ];

  return (
    <section ref={ref} id="succes" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-3">
            {t("stories.label")}
          </p>
          <h2 className="text-3xl font-bold text-black">{t("stories.title")}</h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`bg-white rounded-xl p-6 border-l-4 ${story.borderColor} shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4`}
            >
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${story.badgeBg} ${story.badgeText} w-fit`}
              >
                {story.badge}
              </span>

              <Quote size={18} className="text-gray opacity-40" />

              <p className="text-gray-700 leading-relaxed flex-1">
                {story.quote}
              </p>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                <span className="font-semibold text-gray-900 text-sm">{story.org}</span>
                <span className={`text-sm font-bold ${story.metricColor}`}>
                  {story.metric}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link */}
        <div className="text-center">
          <a href="#" className="text-primary font-semibold hover:underline text-sm">
            {t("stories.see_all")}
          </a>
        </div>
      </div>
    </section>
  );
}
