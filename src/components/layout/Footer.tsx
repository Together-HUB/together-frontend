import { useTranslation } from "next-i18next/pages";
import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle, MapPin, Globe } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit">
              <div className="bg-white rounded-xl px-3 py-2 inline-flex">
                <Image
                  src="/together.png"
                  alt="ToGETHER Networking"
                  width={200}
                  height={56}
                  className="object-contain h-14 w-auto"
                />
              </div>
            </Link>
            <p className="text-gray text-sm leading-relaxed max-w-xs">
              {t("footer.brand_tagline")}
            </p>
            <div className="flex gap-2">
              <a
                href="https://wa.me/243813183123"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="mailto:contact@drctogethernetwork.org"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Col 2 — Plateforme */}
          <div className="flex flex-col gap-4">
            <h4 className="text-primary text-xs font-semibold uppercase tracking-widest">
              {t("footer.platform_heading")}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/directory" className="text-gray text-sm hover:text-white transition-colors">
                  {t("footer.links.repertoire")}
                </Link>
              </li>
              <li>
                <Link href="/financement" className="text-gray text-sm hover:text-white transition-colors">
                  {t("footer.links.financement")}
                </Link>
              </li>
              <li>
                <Link href="/evenements" className="text-gray text-sm hover:text-white transition-colors">
                  {t("footer.links.evenements")}
                </Link>
              </li>
              <li>
                <Link href="/sujets" className="text-gray text-sm hover:text-white transition-colors">
                  {t("footer.links.bibliotheque")}
                </Link>
              </li>
              <li>
                <Link href="/succes" className="text-gray text-sm hover:text-white transition-colors">
                  {t("footer.links.dashboard")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Rejoindre */}
          <div className="flex flex-col gap-4">
            <h4 className="text-primary text-xs font-semibold uppercase tracking-widest">
              {t("footer.join_heading")}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/register/ngo" className="text-gray text-sm hover:text-white transition-colors">
                  {t("footer.links.register_ong")}
                </Link>
              </li>
              <li>
                <Link href="/register/partner" className="text-gray text-sm hover:text-white transition-colors">
                  {t("footer.links.register_partner")}
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray text-sm hover:text-white transition-colors">
                  {t("footer.links.about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-primary text-xs font-semibold uppercase tracking-widest">
              {t("footer.contact_heading")}
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="text-gray mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:contact@drctogethernetwork.org"
                  className="text-gray text-sm hover:text-white transition-colors break-all"
                >
                  {t("footer.contact.email")}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle size={14} className="text-gray mt-0.5 flex-shrink-0" />
                <a
                  href="https://wa.me/243813183123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray text-sm hover:text-white transition-colors"
                >
                  {t("footer.contact.whatsapp")}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-gray mt-0.5 flex-shrink-0" />
                <span className="text-gray text-sm">{t("footer.contact.location_kinshasa")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-gray mt-0.5 flex-shrink-0" />
                <span className="text-gray text-sm">{t("footer.contact.location_bunia")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe size={14} className="text-gray mt-0.5 flex-shrink-0" />
                <span className="text-gray text-sm">{t("footer.contact.platform")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray text-sm">{t("footer.copyright")}</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-gray text-sm hover:text-white transition-colors">
              FR
            </button>
            <span className="text-gray/30 text-sm">|</span>
            <button className="px-3 py-1 text-gray text-sm hover:text-white transition-colors">
              EN
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
