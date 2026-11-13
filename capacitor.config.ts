import type { CapacitorConfig } from "@capacitor/cli";
import pkg from "./package.json";

// The Android app is a shell around the deployed site (Cloudflare Workers):
// lessons, XP and accounts live on the server. Offline it keeps working through
// the site's service worker (/offline) with the course package stored on the phone.
// GAPIR_APP_URL overrides the production address (e.g. a staging Worker).
const appUrl = (process.env.GAPIR_APP_URL || "https://gapir.gapir-web.workers.dev").replace(/\/$/, "");

const config: CapacitorConfig = {
  appId: "uz.gapir.app",
  appName: "Gapir",
  webDir: "mobile/www",
  server: {
    // /start signs the learner in as a guest: no login or password in the app.
    url: `${appUrl}/start`,
    // Shown only if the very first launch has no network (nothing cached yet).
    errorPath: "offline.html",
  },
  // The shell reports the version it was built from; the profile page shows it.
  android: { appendUserAgent: `GapirApp/${pkg.version}` },
};

export default config;
