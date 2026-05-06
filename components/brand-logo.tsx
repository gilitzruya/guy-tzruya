import { Link } from "@/i18n/navigation";

type Props = {
  label: string;
};

export function BrandLogo({ label }: Props) {
  return (
    <Link
      href="/"
      aria-label={label}
      className="inline-flex items-center transition-opacity hover:opacity-85"
    >
      <span
        className="block h-10 w-40 sm:h-12 sm:w-48"
        aria-hidden
        style={{
          backgroundColor: "var(--color-text)",
          WebkitMaskImage: "url('/branding/logo.svg')",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          WebkitMaskPosition: "left center",
          maskImage: "url('/branding/logo.svg')",
          maskRepeat: "no-repeat",
          maskSize: "contain",
          maskPosition: "left center",
        }}
      />
    </Link>
  );
}
