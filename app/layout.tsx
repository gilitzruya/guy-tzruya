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

const localeBootstrap = `(function(){try{var s=location.pathname.split("/").filter(Boolean)[0];if(s==="en"){document.documentElement.lang="en";document.documentElement.dir="ltr";}else{document.documentElement.lang="he";document.documentElement.dir="rtl";}}catch(e){}})();`;

const a11yBootstrap = `(function(){try{var k="guy-tzruya-a11y-preferences",r=localStorage.getItem(k);if(!r)return;var p=JSON.parse(r),d=document.documentElement,s={normal:"1",large:"1.125",xlarge:"1.25"};d.style.setProperty("--a11y-font-scale",s[p.fontScale]||"1");if(p.highContrast)d.dataset.a11yContrast="high";if(p.highlightLinks)d.dataset.a11yLinks="highlight";if(p.readableFont)d.dataset.a11yReadableFont="true";if(p.reduceMotion)d.dataset.a11yReduceMotion="true";}catch(e){}})();`;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: a11yBootstrap }} />
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
