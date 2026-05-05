import type { ReactNode } from "react";
import { Assistant, Plus_Jakarta_Sans } from "next/font/google";
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

type Props = {
  children: ReactNode;
};

const sceneBootstrap = `(function(){try{var k="gt-scene",s=localStorage.getItem(k);if(s==="day"||s==="night")document.documentElement.setAttribute("data-scene",s);else document.documentElement.setAttribute("data-scene","night");}catch(e){document.documentElement.setAttribute("data-scene","night");}})();`;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: sceneBootstrap }} />
      </head>
      <body
        className={`${plusJakarta.variable} ${assistant.variable} min-h-full bg-[var(--color-bg)] text-[var(--color-text)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
