"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  IconFacebook,
  IconInstagram,
  IconWhatsapp,
} from "@/components/building-licensing-social-icons";
import { HomeContactCtaSection } from "@/components/home/home-contact-cta-section";
import { useScene } from "@/components/scene-provider";
import { interiorDesignPageBackgroundStyle } from "@/lib/interior-page-background";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  sitePhoneTelHref,
  siteWhatsAppHref,
} from "@/lib/site-contact";
import { SITE_SOCIAL, type SiteSocialPlatform } from "@/lib/site-social";

const GILI_DEV_SITE_URL = "https://gili-digital.com/";

const FOOTER_NAV = [
  { href: "/", labelKey: "navHome" as const },
  { href: "/about", labelKey: "navAbout" as const },
  { href: "/projects", labelKey: "navProjects" as const },
  { href: "/simulation", labelKey: "navSimulation" as const },
  { href: "/contact", labelKey: "navContact" as const },
] as const;

const FOOTER_SERVICES = [
  { href: "/interior-design", labelKey: "navInteriorDesign" as const },
  { href: "/building-licensing", labelKey: "navBuildingLicensing" as const },
  { href: "/business-licensing", labelKey: "navBusinessLicensing" as const },
] as const;

function FooterIconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M8.5 5.5 6 8.5c1.2 3.8 4.2 6.8 8 8l3-2.5 2.8 2.8c-4.6 1.4-9.7-3.7-8.3-8.3l2.8 2.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FooterIconEmail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <rect
        x="4"
        y="6"
        width="16"
        height="12"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
      />
      <path
        d="m4 7 8 6.5L20 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FooterContactItem = {
  key: string;
  external: boolean;
  Icon: typeof IconWhatsapp | typeof FooterIconPhone | typeof FooterIconEmail;
  labelKey: "contactWhatsapp" | "contactPhone" | "contactEmail";
  value: string;
  valueDir?: "ltr";
  getHref: (ctx: { whatsappHref: string; phoneHref: string }) => string;
};

const FOOTER_SOCIAL: {
  platform: Extract<SiteSocialPlatform, "instagram" | "facebook">;
  Icon: typeof IconInstagram;
  labelKey: "socialInstagram" | "socialFacebook";
}[] = [
  { platform: "instagram", Icon: IconInstagram, labelKey: "socialInstagram" },
  { platform: "facebook", Icon: IconFacebook, labelKey: "socialFacebook" },
];

export function SiteFooter() {
  const t = useTranslations("Footer");
  const tHeader = useTranslations("Header");
  const tContact = useTranslations("Contact");
  const locale = useLocale();
  const { scene } = useScene();
  const isRtl = locale === "he";

  const barBackground = useMemo(
    () => interiorDesignPageBackgroundStyle(scene),
    [scene],
  );

  const whatsappHref =
    SITE_SOCIAL.whatsapp !== "#" ? SITE_SOCIAL.whatsapp : siteWhatsAppHref();
  const phoneHref = sitePhoneTelHref();

  return (
    <footer
      className={`site-footer mt-auto ${locale === "en" ? "english-typography-scope" : ""}`}
      aria-label={t("siteLabel")}
      lang={locale}
    >
      <HomeContactCtaSection />

      <div
        className="site-footer__bar relative overflow-hidden border-t border-[color-mix(in_oklab,var(--color-text)_12%,transparent)] bg-[var(--color-bg)]"
        style={barBackground}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="site-footer__bar-inner relative z-[1] mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="site-footer__grid">
            <nav className="site-footer__col" aria-labelledby="site-footer-nav-title">
              <h2 id="site-footer-nav-title" className="site-footer__heading">
                {t("navTitle")}
              </h2>
              <ul className="site-footer__list">
                {FOOTER_NAV.map(({ href, labelKey }) => (
                  <li key={href}>
                    <Link href={href} className="site-footer__link">
                      {tHeader(labelKey)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/accessibility" className="site-footer__link">
                    {t("navAccessibility")}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="site-footer__col" aria-labelledby="site-footer-services-title">
              <h2 id="site-footer-services-title" className="site-footer__heading">
                {t("servicesTitle")}
              </h2>
              <ul className="site-footer__list">
                {FOOTER_SERVICES.map(({ href, labelKey }) => (
                  <li key={href}>
                    <Link href={href} className="site-footer__link">
                      {tHeader(labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <address
              className="site-footer__col site-footer__col--contact not-italic"
              aria-labelledby="site-footer-contact-title"
            >
              <h2 id="site-footer-contact-title" className="site-footer__heading">
                {t("contactTitle")}
              </h2>
              <ul className="site-footer__contact-list">
                {(
                  [
                    {
                      key: "whatsapp",
                      external: true,
                      Icon: IconWhatsapp,
                      labelKey: "contactWhatsapp",
                      value: SITE_PHONE_DISPLAY,
                      getHref: ({ whatsappHref }) => whatsappHref,
                    },
                    {
                      key: "phone",
                      external: false,
                      Icon: FooterIconPhone,
                      labelKey: "contactPhone",
                      value: SITE_PHONE_DISPLAY,
                      getHref: ({ phoneHref }) => phoneHref,
                    },
                    {
                      key: "email",
                      external: false,
                      Icon: FooterIconEmail,
                      labelKey: "contactEmail",
                      value: SITE_EMAIL,
                      valueDir: "ltr",
                      getHref: () => `mailto:${SITE_EMAIL}`,
                    },
                  ] satisfies FooterContactItem[]
                ).map(({ key, external, Icon, labelKey, value, valueDir, getHref }) => (
                  <li key={key}>
                    <a
                      href={getHref({ whatsappHref, phoneHref })}
                      className="site-footer__contact-row"
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span className="site-footer__contact-icon" aria-hidden>
                        <Icon className="site-footer__contact-icon-svg" />
                      </span>
                      <span className="site-footer__contact-label">{t(labelKey)}:</span>
                      <span
                        className="site-footer__contact-value"
                        {...(valueDir ? { dir: valueDir } : {})}
                      >
                        {value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </address>

            <div
              className="site-footer__col site-footer__col--social"
              aria-labelledby="site-footer-social-title"
            >
              <h2 id="site-footer-social-title" className="site-footer__heading">
                {t("socialTitle")}
              </h2>
              <ul className="site-footer__social-list">
                {FOOTER_SOCIAL.map(({ platform, Icon, labelKey }) => (
                  <li key={platform}>
                    <a
                      href={SITE_SOCIAL[platform]}
                      className="site-footer__social-link"
                      data-platform={platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={tContact(labelKey)}
                    >
                      <Icon className="site-footer__social-icon" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="site-footer__developer">
            <p className="site-footer__developer-intro">{t("developerIntro")}</p>
            <a
              href={GILI_DEV_SITE_URL}
              className="site-footer__developer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="site-footer__developer-name text-white">{t("developerName")}</span>
              <span className="site-footer__developer-sep text-white" aria-hidden>
                {" "}
                —{" "}
              </span>
              <span className="site-footer__developer-tagline">{t("developerTagline")}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
