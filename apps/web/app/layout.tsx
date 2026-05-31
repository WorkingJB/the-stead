import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Lora, Inter } from "next/font/google";
import { SerwistProvider } from "@serwist/turbopack/react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";

// Register the service worker in production builds only — in dev a SW fights
// with HMR and can serve stale chunks.
const serviceWorkerEnabled = process.env.NODE_ENV === "production";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Stead — Field Programs",
    template: "%s · The Stead",
  },
  description:
    "A modern village in field clothes. Twelve-week, automatically-progressing strength and conditioning programs you can log offline, at the gym, in dark mode.",
  applicationName: "The Stead",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "The Stead", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAF4" },
    { media: "(prefers-color-scheme: dark)", color: "#14130e" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${lora.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SerwistProvider swUrl="/serwist/sw.js" register={serviceWorkerEnabled}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SiteHeader />
            <main className="flex flex-1 flex-col">{children}</main>
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
