"use client";

import { useEffect, useLayoutEffect, useState } from "react";

type TypewriterTextProps = {
  text: string;
  className?: string;
  charDelayMs?: number;
  startDelayMs?: number;
};

export function TypewriterText({
  text,
  className = "",
  charDelayMs = 155,
  startDelayMs = 0,
}: TypewriterTextProps) {
  const [visibleLength, setVisibleLength] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleLength(text.length);
      return;
    }

    setVisibleLength(0);
    let index = 0;
    let intervalId: number | undefined;

    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setVisibleLength(index);
        if (index >= text.length && intervalId !== undefined) {
          window.clearInterval(intervalId);
        }
      }, charDelayMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [text, charDelayMs, startDelayMs, reducedMotion]);

  const visible = text.slice(0, visibleLength);

  return (
    <span className={className} aria-label={text}>
      {visible}
    </span>
  );
}
