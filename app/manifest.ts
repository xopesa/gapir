import type { MetadataRoute } from "next";

// Web app manifest: lets Gapir be installed on a phone's home screen and open
// full-screen in portrait — a step towards the native app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gapir — языки каждый день",
    short_name: "Gapir",
    description: "Uzbek and Chinese in short daily lessons with Panda, Dragon and Tiger.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdf5ec",
    theme_color: "#f07a2e",
    lang: "zh",
    categories: ["education"],
    icons: [
      { src: "/gapir-logo.png", sizes: "1254x1254", type: "image/png", purpose: "any" },
      { src: "/gapir-logo.png", sizes: "1254x1254", type: "image/png", purpose: "maskable" },
    ],
  };
}
