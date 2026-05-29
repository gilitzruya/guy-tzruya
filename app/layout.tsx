import type { ReactNode } from "react";
import { Assistant, Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { DEFAULT_SCENE, SCENE_STORAGE_KEY, SCENE_TOGGLE_ENABLED } from "@/lib/scene-storage";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const assistant = Assistant({
  subsets: ["latin", "hebrew"],
  variable: "--font-assistant",
  display: "swap",
});

const interiorDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-interior-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

type Props = {
  children: ReactNode;
};

const sceneBootstrap = SCENE_TOGGLE_ENABLED
  ? `(function(){try{var k=${JSON.stringify(SCENE_STORAGE_KEY)},s=localStorage.getItem(k);if(s==="day"||s==="night")document.documentElement.setAttribute("data-scene",s);else document.documentElement.setAttribute("data-scene",${JSON.stringify(DEFAULT_SCENE)});}catch(e){document.documentElement.setAttribute("data-scene",${JSON.stringify(DEFAULT_SCENE)});}})();`
  : `(function(){try{document.documentElement.setAttribute("data-scene",${JSON.stringify(DEFAULT_SCENE)});}catch(e){}})();`;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: sceneBootstrap }} />
      </head>
      <body
        className={`${plusJakarta.variable} ${assistant.variable} ${interiorDisplay.variable} min-h-full bg-[var(--color-bg)] text-[var(--color-text)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
