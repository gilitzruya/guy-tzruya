"use client";

type SimulationProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  showPercent?: boolean;
  className?: string;
};

export function SimulationProgressRing({
  progress,
  size = 120,
  strokeWidth = 6,
  showPercent = true,
  className = "",
}: SimulationProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  const percentLabel = Math.round(clamped * 100);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`.trim()}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentLabel}
      aria-label={`${percentLabel}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(255 255 255 / 0.14)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#c4a574"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
        />
      </svg>
      {showPercent ? (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums text-[#c4a574] sm:text-base">
          {percentLabel}%
        </span>
      ) : null}
    </div>
  );
}

/** Slow-start asymptotic progress while waiting; caps below 1 until complete. */
export function simulationRunningProgress(elapsedSeconds: number): number {
  const slowStart = Math.min(1, elapsedSeconds / 3);
  const eased = 1 - Math.exp(-elapsedSeconds / 45);
  return Math.min(0.92, eased * slowStart);
}
