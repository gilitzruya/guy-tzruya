type IconProps = { className?: string };

export function BlIconConsult({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <rect x="8" y="10" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <path d="M14 18h20M14 24h14M14 30h18" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="34" cy="14" r="4" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function BlIconSurvey({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <path d="M10 38V14l14-8 14 8v24" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M24 6v32M10 22h28" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function BlIconPlans({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <path d="M12 8h20l8 8v24H12V8z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M32 8v8h8M16 20h16M16 26h12M16 32h14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function BlIconSubmit({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <rect x="10" y="8" width="28" height="32" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="24" cy="26" r="8" stroke="currentColor" strokeWidth="1.25" />
      <path d="M20 26l3 3 6-7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BlIconPermit({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <path d="M14 10h20v28H14V10z" stroke="currentColor" strokeWidth="1.25" />
      <path d="M18 16h12M18 22h10M18 28h8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M30 34l4 4 8-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BlIconHandoff({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <path d="M8 36h32" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M16 36V20l8-6 8 6v16" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M24 14v6M20 32h8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

const STEP_ICONS = [
  BlIconConsult,
  BlIconSurvey,
  BlIconPlans,
  BlIconSubmit,
  BlIconPermit,
  BlIconHandoff,
] as const;

export function BuildingLicensingStepIcon({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  const Icon = STEP_ICONS[index] ?? BlIconConsult;
  return <Icon className={className} />;
}
