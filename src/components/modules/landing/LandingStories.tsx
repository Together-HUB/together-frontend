import { useTranslation } from "next-i18next/pages";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export default function LandingStories() {
  const { t } = useTranslation("landing");

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
    {
      badge: t("stories.badge4"),
      badgeBg: "bg-accent-light",
      badgeText: "text-accent",
      borderColor: "border-accent",
      quote: t("stories.quote4"),
      org: t("stories.org4"),
      metric: t("stories.metric4"),
      metricColor: "text-accent",
    },
    {
      badge: t("stories.badge5"),
      badgeBg: "bg-primary-light",
      badgeText: "text-primary",
      borderColor: "border-primary",
      quote: t("stories.quote5"),
      org: t("stories.org5"),
      metric: t("stories.metric5"),
      metricColor: "text-primary",
    },
    {
      badge: t("stories.badge6"),
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-700",
      borderColor: "border-amber-400",
      quote: t("stories.quote6"),
      org: t("stories.org6"),
      metric: t("stories.metric6"),
      metricColor: "text-amber-600",
      featured: true,
    },
  ];

  return (
    <section id="succes" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-3">
            {t("stories.label")}
          </p>
          <h2 className="text-3xl font-bold text-black">{t("stories.title")}</h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.05 * (i % 3) }}
              className={`relative bg-white rounded-xl p-6 border-l-4 ${story.borderColor} ${
                story.featured ? "ring-1 ring-amber-200 shadow-amber-100/60" : ""
              } shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4`}
            >
              {/* Featured "Impact ToGETHER" crown badge */}
              {story.featured && (
                <div className="absolute -top-3 right-4 flex items-center gap-1 bg-amber-400 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  <Star size={10} className="fill-white" />
                  ToGETHER
                </div>
              )}

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
