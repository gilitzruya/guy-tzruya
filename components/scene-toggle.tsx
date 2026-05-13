"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { useScene } from "@/components/scene-provider";

function HeaderSunGraphic() {
  return (
    <svg
      viewBox="0 0 128 128"
      className="h-10 w-10 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M77.547 120.684h-5.765l-1.698 3.012a7.477 7.477 0 0 1-6.513 3.804h-.003a7.479 7.479 0 0 1-6.513-3.804l-1.698-3.012h-5.765v-4.06h27.956v4.06z"
        fill="#51514c"
      />
      <path
        d="M77.547 113.65H49.591v-4.279h27.956v4.279zm0-11.711H49.591v4.279h27.956v-4.279zm38.587-32.576-12.209-3.271.92-3.434 12.209 3.271-.92 3.434zm-104.268 0-.92-3.434 12.209-3.271.92 3.434-12.209 3.271zm92.979-24.913-.92-3.434 12.209-3.272.92 3.434-12.209 3.272zm-81.69 0-12.209-3.272.92-3.434 12.209 3.272-.92 3.434zM94.82 25.247l-2.514-2.514 8.938-8.938 2.514 2.514-8.938 8.938zm-61.64 0-8.937-8.938 2.514-2.514 8.937 8.938-2.514 2.514zm43.358-11.618-3.434-.92L76.376.5l3.434.92-3.272 12.209zm-25.076 0L48.191 1.42 51.625.5l3.272 12.209-3.435.92z"
        fill="#a7a79b"
      />
      <path
        d="M59.802 64.141h7.535v34.934h-7.535V64.141zm3.767-44.754c-18.485-.53-33.631 14.817-33.631 33.824 0 9.781 4.016 18.581 10.431 24.753 5.637 5.423 9.222 13.147 9.222 21.111h7.84V64.141H51.75c-4.44 0-8.051-3.612-8.051-8.051s3.612-8.051 8.051-8.051 8.052 3.612 8.052 8.051v5.681h7.535V56.09c0-4.44 3.612-8.051 8.052-8.051 4.44 0 8.051 3.612 8.051 8.051s-3.612 8.051-8.051 8.051h-5.682v34.934h7.84c0-7.964 3.584-15.688 9.222-21.111C93.184 71.792 97.2 62.992 97.2 53.211c0-19.008-15.146-34.355-33.631-33.824zM51.75 50.408a5.687 5.687 0 0 0-5.681 5.681 5.687 5.687 0 0 0 5.681 5.681h5.682v-5.681a5.688 5.688 0 0 0-5.682-5.681zM75.389 61.77h-5.682v-5.681a5.688 5.688 0 0 1 5.682-5.681 5.687 5.687 0 0 1 5.681 5.681 5.687 5.687 0 0 1-5.681 5.681z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function SceneToggle() {
  const { scene, setScene } = useScene();
  const t = useTranslations("Header");
  const checkboxId = useId();
  const tooltipId = useId();

  return (
    <div className="group relative flex items-center">
      <input
        id={checkboxId}
        type="checkbox"
        className="peer sr-only"
        checked={scene === "day"}
        onChange={(e) => setScene(e.target.checked ? "day" : "night")}
        aria-label={t("sceneNavLabel")}
        aria-describedby={tooltipId}
      />
      <label
        htmlFor={checkboxId}
        className="relative z-[1] flex w-fit cursor-pointer rounded-full bg-[rgb(46,46,46)] p-2.5 transition-all duration-[700ms] peer-checked:bg-[rgb(161,91,0)] peer-checked:shadow-[0px_0px_100px_rgb(255,196,0)]"
      >
        <HeaderSunGraphic />
      </label>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-[60] mt-1 max-w-[14rem] -translate-x-1/2 whitespace-normal rounded-md border border-[color-mix(in_oklab,var(--color-text)_18%,transparent)] bg-[color-mix(in_oklab,var(--color-bg)_94%,transparent)] px-2 py-1 text-center text-xs leading-snug text-[var(--color-text)] opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
      >
        {scene === "day"
          ? t("sceneToggleTooltipToDark")
          : t("sceneToggleTooltipToLight")}
      </span>
    </div>
  );
}
