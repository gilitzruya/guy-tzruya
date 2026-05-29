"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { buildContactMailto } from "@/lib/site-contact";

export function ContactFormSection() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const titleId = useId();
  const isRtl = locale === "he";
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) return;

    window.location.href = buildContactMailto({
      subject: t("formMailSubject", { name }),
      body: t("formMailBody", { name, email, message }),
    });
    setSubmitted(true);
    form.reset();
  }

  return (
    <section
      id="contact-form"
      aria-labelledby={titleId}
      dir={isRtl ? "rtl" : "ltr"}
      className="contact-form-section scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="contact-form-section__inner">
        <header className="contact-form-section__header">
          <p className="contact-form-section__eyebrow">{t("formEyebrow")}</p>
          <h2 id={titleId} className="contact-form-section__title">
            {t("formTitle")}
          </h2>
          <p className="contact-form-section__lead">{t("formLead")}</p>
        </header>

        <form className="contact-form" onSubmit={onSubmit} noValidate>
          <div className="contact-form__field">
            <label htmlFor="contact-name" className="contact-form__label">
              {t("formNameLabel")}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="contact-form__input"
              placeholder={t("formNamePlaceholder")}
            />
          </div>

          <div className="contact-form__field">
            <label htmlFor="contact-email" className="contact-form__label">
              {t("formEmailLabel")}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="contact-form__input"
              placeholder={t("formEmailPlaceholder")}
              dir="ltr"
            />
          </div>

          <div className="contact-form__field">
            <label htmlFor="contact-message" className="contact-form__label">
              {t("formMessageLabel")}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              className="contact-form__textarea"
              placeholder={t("formMessagePlaceholder")}
            />
          </div>

          <button type="submit" className="contact-form__submit">
            {t("formSubmit")}
          </button>

          {submitted ? (
            <p className="contact-form__success" role="status">
              {t("formSuccess")}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
