/**
 * Social profile URLs — update before production.
 * Optional override via NEXT_PUBLIC_SOCIAL_* env vars.
 */
function socialUrl(envKey: string, fallback: string): string {
  const value = process.env[envKey];
  return value && value.length > 0 ? value : fallback;
}

export const SITE_SOCIAL = {
  instagram: socialUrl("NEXT_PUBLIC_SOCIAL_INSTAGRAM", "#"),
  facebook: socialUrl("NEXT_PUBLIC_SOCIAL_FACEBOOK", "#"),
  linkedin: socialUrl("NEXT_PUBLIC_SOCIAL_LINKEDIN", "#"),
  whatsapp: socialUrl("NEXT_PUBLIC_SOCIAL_WHATSAPP", "#"),
  youtube: socialUrl("NEXT_PUBLIC_SOCIAL_YOUTUBE", "#"),
} as const;

export type SiteSocialPlatform = keyof typeof SITE_SOCIAL;
