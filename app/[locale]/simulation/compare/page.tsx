import { notFound } from "next/navigation";
import { SimulationComparePage } from "@/components/simulation-compare-page";
import { isSimulationCompareEnabled } from "@/lib/simulation-config";

export default function SimulationCompareRoute() {
  if (!isSimulationCompareEnabled()) {
    notFound();
  }

  return <SimulationComparePage />;
}
