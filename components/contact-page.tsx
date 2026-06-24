"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import {
  IconFacebook,
  IconInstagram,
  IconWhatsapp,
} from "@/components/building-licensing-social-icons";
import { interiorDesignPageBackgroundStyle } from "@/lib/interior-page-background";
import {
  buildContactMailto,
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  sitePhoneTelHref,
  siteWhatsAppHref,
} from "@/lib/site-contact";
import { SITE_SOCIAL, type SiteSocialPlatform } from "@/lib/site-social";

function ContactIconPhone({ className }: { className?: string }) {
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

function ContactIconEmail({ className }: { className?: string }) {
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

function ContactIconPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.25" fill="none" stroke="currentColor" strokeWidth="1.45" />
    </svg>
  );
}

const INFO_SOCIAL_LINKS: {
  platform: Extract<SiteSocialPlatform, "instagram" | "facebook">;
  Icon: typeof IconInstagram;
  labelKey: "socialInstagram" | "socialFacebook";
}[] = [
  { platform: "instagram", Icon: IconInstagram, labelKey: "socialInstagram" },
  { platform: "facebook", Icon: IconFacebook, labelKey: "socialFacebook" },
];

export function ContactPage() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const isRtl = locale === "he";
  const pageBackgroundStyle = interiorDesignPageBackgroundStyle("night");
  const whatsappHref =
    SITE_SOCIAL.whatsapp !== "#" ? SITE_SOCIAL.whatsapp : siteWhatsAppHref();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setFormError(t("formValidationError"));
      form.querySelector<HTMLElement>("input[name='name'], textarea[name='message'], input[name='email']")?.focus();
      return;
    }

    window.location.href = buildContactMailto({
      subject: t("formMailSubject", { name }),
      body: t("formMailBody", { name, email, phone, message }),
    });
    setSubmitted(true);
    form.reset();
  }

  return (
    <div
      className={`contact-page contact-page-redesign ${locale === "en" ? "english-typography-scope" : ""}`}
      dir={isRtl ? "rtl" : "ltr"}
      style={pageBackgroundStyle}
    >
      <section className="contact-redesign-shell" aria-labelledby="contact-redesign-title">
        <div className="contact-redesign-panel contact-redesign-panel--form">
          <div className="contact-redesign-heading">
            <p className="contact-redesign-eyebrow">
              <span aria-hidden />
              {t("heroEyebrow")}
              <span aria-hidden />
            </p>
            <h1 id="contact-redesign-title" className="contact-redesign-title">
              {t("contactHeadline")}
            </h1>
            <p className="contact-redesign-lead">{t("contactIntro")}</p>
          </div>

          <form className="contact-redesign-form" onSubmit={onSubmit} noValidate>
            {formError ? (
              <p className="contact-redesign-form-error" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="contact-redesign-form-row">
              <label className="contact-redesign-field">
                <span>{t("formNameLabel")}</span>
                <input
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={t("formNamePlaceholder")}
                />
              </label>
              <label className="contact-redesign-field">
                <span>{t("phoneFieldLabel")}</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={SITE_PHONE_DISPLAY}
                  dir="ltr"
                />
              </label>
            </div>

            <label className="contact-redesign-field">
              <span>{t("formEmailLabel")}</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t("formEmailPlaceholder")}
                dir="ltr"
              />
            </label>

            <label className="contact-redesign-field">
              <span>{t("formMessageLabel")}</span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder={t("formMessagePlaceholder")}
              />
            </label>

            <div className="contact-redesign-submit-wrap">
              <button type="submit" className="contact-redesign-submit">
                <span>{t("formSubmit")}</span>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {submitted ? (
              <p className="contact-redesign-success" role="status">
                {t("formSuccess")}
              </p>
            ) : null}
          </form>
        </div>

        <div className="contact-redesign-panel contact-redesign-panel--image">
          <Image
            src="/contact/contact-page-hero.png"
            alt=""
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="contact-redesign-image"
          />
          <div className="contact-redesign-image-overlay" aria-hidden />
        </div>

        <address className="contact-redesign-info" aria-label={t("detailsTitle")}>
          <a href={sitePhoneTelHref()} className="contact-redesign-info-item">
            <span className="contact-redesign-info-icon" aria-hidden>
              <ContactIconPhone />
            </span>
            <span>
              <strong>{t("details.phone.title")}</strong>
              <span dir="ltr">{SITE_PHONE_DISPLAY}</span>
            </span>
          </a>
          <a href={`mailto:${SITE_EMAIL}`} className="contact-redesign-info-item">
            <span className="contact-redesign-info-icon" aria-hidden>
              <ContactIconEmail />
            </span>
            <span>
              <strong>{t("details.email.title")}</strong>
              <span dir="ltr">{SITE_EMAIL}</span>
            </span>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-redesign-info-item"
          >
            <span className="contact-redesign-info-icon" aria-hidden>
              <IconWhatsapp />
            </span>
            <span>
              <strong>{t("details.whatsapp.title")}</strong>
              <span>{t("details.whatsapp.hint")}</span>
            </span>
          </a>
          {INFO_SOCIAL_LINKS.map(({ platform, Icon, labelKey }) => (
            <a
              key={platform}
              href={SITE_SOCIAL[platform]}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-redesign-info-item"
            >
              <span className="contact-redesign-info-icon" aria-hidden>
                <Icon />
              </span>
              <span>
                <strong>{t(labelKey)}</strong>
                <span>{t("socialEyebrow")}</span>
              </span>
            </a>
          ))}
          <div className="contact-redesign-info-item">
            <span className="contact-redesign-info-icon" aria-hidden>
              <ContactIconPin />
            </span>
            <span>
              <strong>{t("studioTitle")}</strong>
              <span>{t("studioValue")}</span>
            </span>
          </div>
        </address>
      </section>
    </div>
  );
}
