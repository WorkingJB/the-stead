import type { MetadataRoute } from "next";

// Brand palette from shared/design-tokens.md: forest #2D4A35, cream #FBFAF4.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Stead — Field Programs",
    short_name: "The Stead",
    description:
      "Twelve-week, automatically-progressing strength and conditioning programs you can log offline, at the gym, in dark mode.",
    start_url: "/today",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBFAF4",
    theme_color: "#2D4A35",
    categories: ["health", "fitness", "lifestyle"],
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "192x192 512x512 any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/maskable.svg",
        sizes: "192x192 512x512 any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
