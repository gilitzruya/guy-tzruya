import type { AboutHeroFeatureIcon } from "@/components/about-content";

const iconProps = {
  width: 36,
  height: 36,
  viewBox: "0 0 36 36",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  "aria-hidden": true as const,
};

export function AboutHeroFeatureIcon({ icon }: { icon: AboutHeroFeatureIcon }) {
  switch (icon) {
    case "planning":
      return (
        <svg {...iconProps}>
          <path
            d="M8 26 14 10h8l6 16M11 20h14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 28h24" strokeLinecap="round" />
        </svg>
      );
    case "design":
      return (
        <svg {...iconProps}>
          <path
            d="M10 22c0-5 3-9 8-9s8 4 8 9v2H10v-2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 26h12M14 12h8" strokeLinecap="round" />
        </svg>
      );
    case "materials":
      return (
        <svg {...iconProps}>
          <rect x="8" y="10" width="8" height="8" rx="1" />
          <rect x="20" y="10" width="8" height="8" rx="1" />
          <rect x="8" y="22" width="8" height="8" rx="1" />
          <rect x="20" y="22" width="8" height="8" rx="1" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="18" cy="12" r="4" />
          <path
            d="M10 28c0-4.4 3.6-8 8-8s8 3.6 8 8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
