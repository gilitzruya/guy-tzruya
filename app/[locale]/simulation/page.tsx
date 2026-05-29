import { Suspense } from "react";
import { SimulationPage } from "@/components/simulation-page";
import { getSimulationMaxActivations } from "@/lib/simulation-config";

function SimulationFallback() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center pt-20">
      <p className="text-[var(--color-text)]/70">…</p>
    </main>
  );
}

export default function SimulationRoute() {
  const maxActivations = getSimulationMaxActivations();

  return (
    <Suspense fallback={<SimulationFallback />}>
      <SimulationPage maxActivations={maxActivations} />
    </Suspense>
  );
}
