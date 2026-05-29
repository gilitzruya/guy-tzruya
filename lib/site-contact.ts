/** Shared contact details used across the site. */
export const SITE_EMAIL = "guytzruya@gmail.com";
export const SITE_PHONE_DISPLAY = "054-528-7755";

export function sitePhoneTelHref(phone = SITE_PHONE_DISPLAY): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** WhatsApp deep link from local Israeli mobile format. */
export function siteWhatsAppHref(phone = SITE_PHONE_DISPLAY): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = `972${digits.slice(1)}`;
  }
  return `https://wa.me/${digits}`;
}

export function buildContactMailto({
  subject,
  body,
}: {
  subject: string;
  body: string;
}): string {
  return `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
