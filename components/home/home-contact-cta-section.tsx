"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
const MAILTO =
  "mailto:guytzruya@gmail.com?subject=Architecture%20and%20design%20inquiry";

const CONTACT_CHANNELS = ["hours", "phone", "email", "office"] as const;
type ContactChannel = (typeof CONTACT_CHANNELS)[number];

function ContactIcon({ channel }: { channel: ContactChannel }) {
  if (channel === "hours") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
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
  if (channel === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="4" y="6" width="16" height="12" rx="1.5" />
        <path d="m4 7 8 6.5L20 7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function channelHref(channel: ContactChannel, phoneHref: string): string | undefined {
  if (channel === "phone") return phoneHref;
  if (channel === "email") return MAILTO;
  return undefined;
}

export function HomeContactCtaSection() {
  const t = useTranslations("Home.contact");
  const locale = useLocale();
  const titleId = useId();
  const titleAccentRef = useRef<HTMLSpanElement>(null);
  const [underlineDrawn, setUnderlineDrawn] = useState(false);
  const isRtl = locale === "he";
  const phoneDisplay = t("channels.phone.line1");
  const phoneHref = `tel:${phoneDisplay.replace(/[^\d+]/g, "")}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setUnderlineDrawn(true);
      return;
    }
    const el = titleAccentRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setUnderlineDrawn(false);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setUnderlineDrawn(true));
          });
        } else {
          setUnderlineDrawn(false);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="home-contact"
      aria-labelledby={titleId}
      dir={isRtl ? "rtl" : "ltr"}
      className="home-contact-strip scroll-mt-24 bg-[#f4efe8] sm:scroll-mt-28"
    >
      <div className="home-contact-strip__inner">
        <header className="home-contact-strip__header">
          <p className="home-contact-strip__eyebrow">{t("eyebrow")}</p>
          <h2 id={titleId} className="home-contact-strip__title">
            {t("titlePrefix")}
            <span
              ref={titleAccentRef}
              className={`home-contact-strip__title-accent${underlineDrawn ? " home-contact-strip__title-accent--draw" : ""}`}
            >
              {t("titleAccent")}
            </span>
          </h2>
          <p className="home-contact-strip__lead">{t("lead1")}</p>
          <p className="home-contact-strip__lead">{t("lead2")}</p>
        </header>

        <div className="home-contact-strip__grid" role="list">
          {CONTACT_CHANNELS.map((channel) => {
            const href = channelHref(channel, phoneHref);
            const itemContent = (
              <>
                <span className="home-contact-strip__icon-ring">
                  <ContactIcon channel={channel} />
                </span>
                <h3 className="home-contact-strip__item-title">
                  {t(`channels.${channel}.title`)}
                </h3>
                <p className="home-contact-strip__item-value">
                  {t(`channels.${channel}.line1`)}
                </p>
                <p className="home-contact-strip__item-hint">
                  {t(`channels.${channel}.line2`)}
                </p>
              </>
            );

            if (href) {
              return (
                <a
                  key={channel}
                  href={href}
                  className="home-contact-strip__item home-contact-strip__item--link"
                  role="listitem"
                >
                  {itemContent}
                </a>
              );
            }

            return (
              <div key={channel} className="home-contact-strip__item" role="listitem">
                {itemContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
