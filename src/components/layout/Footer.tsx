import { useTranslation } from "next-i18next/pages";
import Link from "next/link";
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
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-9 h-9 rounded-xl bg-primary shadow-sm flex items-center justify-center ring-1 ring-primary/30 group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-sm tracking-tight leading-none">TN</span>
              </div>
              <span className="font-bold text-white text-lg tracking-tight leading-none">
                ToGETHER <span className="text-primary">Networking</span>
              </span>
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
                href="mailto:adssebia2025@gmail.com"
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
              {(["repertoire", "financement", "evenements", "bibliotheque", "dashboard"] as const).map((key) => (
                <li key={key}>
                  <a href="#" className="text-gray text-sm hover:text-white transition-colors">
                    {t(`footer.links.${key}`)}
                  </a>
                </li>
              ))}
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
                <a href="#" className="text-gray text-sm hover:text-white transition-colors">
                  {t("footer.links.about")}
                </a>
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
                  href="mailto:adssebia2025@gmail.com"
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
                <span className="text-gray text-sm">{t("footer.contact.location")}</span>
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
