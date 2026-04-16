import { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next/pages";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Mail, MessageCircle, ChevronDown, X, Menu } from "lucide-react";

const NAV_LINKS = [
  { key: "accueil", href: "/" },
  { key: "repertoire", href: "/directory" },
  { key: "financement", href: "/financement" },
  { key: "evenements", href: "/evenements" },
  { key: "sujets", href: "/sujets" },
  { key: "succes", href: "/succes" },
];

export default function Navbar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRegisterOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 bg-white transition-all duration-200 ${
          scrolled ? "shadow-md border-b border-gray-100" : "border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/together.png"
                alt="ToGETHER Networking"
                width={200}
                height={56}
                className="object-contain h-14 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={`text-sm font-medium hover:text-primary transition-colors relative group pb-0.5 ${
                      isActive(link.href) ? "text-primary" : "text-gray"
                    }`}
                  >
                    {t(`nav.${link.key}`)}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-200 ${
                        isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                ) : (
                  <a
                    key={link.key}
                    href={link.href}
                    className="text-gray text-sm font-medium hover:text-primary transition-colors relative group pb-0.5"
                  >
                    {t(`nav.${link.key}`)}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                  </a>
                )
              )}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/243813183123"
                target="_blank"
                rel="noopener noreferrer"
                title={t("whatsapp_tooltip")}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
              >
                <MessageCircle size={18} />
              </a>

              {/* Email */}
              <a
                href="mailto:contact@drctogethernetwork.org"
                title={t("email_tooltip")}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary-light transition-colors"
              >
                <Mail size={18} />
              </a>

              {/* Language Toggle */}
              <div className="flex items-center bg-gray-100 rounded-full p-0.5 gap-0.5">
                {(["fr", "en"] as const).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000; SameSite=Lax`;
                      router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale: loc });
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      router.locale === loc
                        ? "bg-primary text-white"
                        : "text-gray hover:text-primary"
                    }`}
                  >
                    {loc.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* S'inscrire dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setRegisterOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {t("auth.register")}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${registerOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {registerOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <Link
                      href="/register/ngo"
                      onClick={() => setRegisterOpen(false)}
                      className="block w-full px-4 py-3 text-sm text-left text-black hover:bg-primary-light hover:text-primary transition-colors"
                    >
                      {t("auth.register_ong")}
                    </Link>
                    <div className="h-px bg-gray-100" />
                    <Link
                      href="/register/partner"
                      onClick={() => setRegisterOpen(false)}
                      className="block w-full px-4 py-3 text-sm text-left text-black hover:bg-primary-light hover:text-primary transition-colors"
                    >
                      {t("auth.register_partner")}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-black hover:text-primary transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white z-50 shadow-2xl flex flex-col lg:hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Image
                  src="/together.png"
                  alt="ToGETHER Networking"
                  width={160}
                  height={46}
                  className="object-contain h-12 w-auto"
                />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray hover:text-black transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`py-3 text-base font-medium hover:text-primary transition-colors border-b border-gray-50 last:border-0 ${
                      isActive(link.href) ? "text-primary" : "text-gray"
                    }`}
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                ) : (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-base font-medium text-gray hover:text-primary transition-colors border-b border-gray-50 last:border-0"
                  >
                    {t(`nav.${link.key}`)}
                  </a>
                )
              )}

              {/* Mobile Language Toggle */}
              <div className="flex items-center justify-center bg-gray-100 rounded-full p-0.5 gap-0.5 mt-6">
                {(["fr", "en"] as const).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000; SameSite=Lax`;
                      router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale: loc });
                      setMobileOpen(false);
                    }}
                    className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                      router.locale === loc
                        ? "bg-primary text-white"
                        : "text-gray hover:text-primary"
                    }`}
                  >
                    {loc === "fr" ? "Français" : "English"}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <a
                  href="https://wa.me/243813183123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#25D366] text-[#25D366] font-medium text-sm hover:bg-[#25D366]/10 transition-colors"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
                <a
                  href="mailto:contact@drctogethernetwork.org"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary text-primary font-medium text-sm hover:bg-primary-light transition-colors"
                >
                  <Mail size={16} />
                  Email
                </a>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/register/ngo"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors text-center"
                >
                  {t("auth.register_ong")}
                </Link>
                <Link
                  href="/register/partner"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary-light transition-colors text-center"
                >
                  {t("auth.register_partner")}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
