"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";
import {
  IconFacebook,
  IconInstagram,
} from "@/components/building-licensing-social-icons";
import { SITE_SOCIAL, type SiteSocialPlatform } from "@/lib/site-social";

const SOCIAL_LINKS: {
  platform: Extract<SiteSocialPlatform, "instagram" | "facebook">;
  Icon: typeof IconInstagram;
  labelKey: "socialInstagram" | "socialFacebook";
}[] = [
  { platform: "instagram", Icon: IconInstagram, labelKey: "socialInstagram" },
  { platform: "facebook", Icon: IconFacebook, labelKey: "socialFacebook" },
];

export function ContactSocialSection() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const titleId = useId();
  const isRtl = locale === "he";

  return (
    <section
      id="contact-social"
      aria-labelledby={titleId}
      dir={isRtl ? "rtl" : "ltr"}
      className="contact-social scroll-mt-24 pb-20 sm:scroll-mt-28 sm:pb-24"
    >
      <div className="contact-social__inner">
        <header className="contact-social__header">
          <p className="contact-social__eyebrow">{t("socialEyebrow")}</p>
          <h2 id={titleId} className="contact-social__title">
            {t("socialTitle")}
          </h2>
          <p className="contact-social__lead">{t("socialLead")}</p>
        </header>

        <ul className="contact-social__list" aria-label={t("socialTitle")}>
          {SOCIAL_LINKS.map(({ platform, Icon, labelKey }) => (
            <li key={platform}>
              <a
                href={SITE_SOCIAL[platform]}
                className="contact-social__link"
                data-platform={platform}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(labelKey)}
              >
                <Icon className="contact-social__icon" />
                <span className="contact-social__label">{t(labelKey)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
