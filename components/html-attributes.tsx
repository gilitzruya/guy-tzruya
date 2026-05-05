"use client";

import { useEffect } from "react";

type Props = {
  locale: string;
};

export function HtmlAttributes({ locale }: Props) {
  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale === "he" ? "he" : "en";
    el.dir = locale === "he" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
