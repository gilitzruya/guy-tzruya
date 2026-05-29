"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  sitePhoneTelHref,
  siteWhatsAppHref,
} from "@/lib/site-contact";
import { SITE_SOCIAL } from "@/lib/site-social";

const DETAIL_CHANNELS = ["whatsapp", "phone", "email"] as const;
type DetailChannel = (typeof DETAIL_CHANNELS)[number];

function DetailIcon({ channel }: { channel: DetailChannel }) {
  if (channel === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M21 11.5a8.38 8.38 0 0 1-9 8.18 8.5 8.5 0 0 1-6.6-3.1L3 21l2.72-2.28A8.38 8.38 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3 8.38 8.38 0 0 1 21 11.5z" />
        <path d="M9.5 10.5c.5 1.2 1.8 2.5 3 3l1-1.5" />
      </svg>
    );
  }
  if (channel === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M8.5 5.5 6 8.5c1.2 3.8 4.2 6.8 8 8l3-2.5 2.8 2.8c-4.6 1.4-9.7-3.7-8.3-8.3l2.8 2.8Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
      <path d="m4 7 8 6.5L20 7" />
    </svg>
  );
}

function channelHref(channel: DetailChannel): string {
  if (channel === "whatsapp") {
    const configured = SITE_SOCIAL.whatsapp;
    return configured !== "#" ? configured : siteWhatsAppHref();
  }
  if (channel === "phone") return sitePhoneTelHref();
  return `mailto:${SITE_EMAIL}`;
}

function channelValue(channel: DetailChannel): string {
  if (channel === "whatsapp") return SITE_PHONE_DISPLAY;
  if (channel === "phone") return SITE_PHONE_DISPLAY;
  return SITE_EMAIL;
}

export function ContactDetailsSection() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const titleId = useId();
  const isRtl = locale === "he";

  return (
    <section
      id="contact-details"
      aria-labelledby={titleId}
      dir={isRtl ? "rtl" : "ltr"}
      className="contact-details scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="contact-details__inner">
        <header className="contact-details__header">
          <p className="contact-details__eyebrow">{t("detailsEyebrow")}</p>
          <h2 id={titleId} className="contact-details__title">
            {t("detailsTitle")}
          </h2>
          <p className="contact-details__lead">{t("detailsLead")}</p>
        </header>

        <div className="contact-details__grid" role="list">
          {DETAIL_CHANNELS.map((channel) => {
            const href = channelHref(channel);
            const external = channel === "whatsapp";

            return (
              <a
                key={channel}
                href={href}
                className={`contact-details__item contact-details__item--${channel}`}
                role="listitem"
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span className="contact-details__icon-ring">
                  <DetailIcon channel={channel} />
                </span>
                <h3 className="contact-details__item-title">
                  {t(`details.${channel}.title`)}
                </h3>
                <p className="contact-details__item-value">{channelValue(channel)}</p>
                <p className="contact-details__item-hint">
                  {t(`details.${channel}.hint`)}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
