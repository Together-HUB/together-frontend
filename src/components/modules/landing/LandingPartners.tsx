import { useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const PARTNER_LOGOS = [
  "/images/together/partners/logo1.png",
  "/images/together/partners/logo2.png",
  "/images/together/partners/logo3.png",
  "/images/together/partners/logo4.png",
  "/images/together/partners/logo5.png",
  "/images/together/partners/logo6.png",
  "/images/together/partners/logo7.png",
  "/images/together/partners/logo8.png",
  "/images/together/partners/logo9.png",
  "/images/together/partners/logo10.png",
];

// Duplicate for seamless loop
const TRACK = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

export default function LandingPartners() {
  const { t } = useTranslation("landing");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-2">
            {t("partners.label")}
          </p>
          <p className="text-gray-400 text-sm">
            {t("partners.subtitle")}
          </p>
        </motion.div>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-10 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 28,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ willChange: "transform" }}
          >
            {TRACK.map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-36 h-20 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-3"
              >
                <Image
                  src={src}
                  alt={`Partner logo ${(i % PARTNER_LOGOS.length) + 1}`}
                  width={120}
                  height={60}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
