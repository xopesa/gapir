import type { NextConfig } from "next";

// "cloudflare" when built by `npm run cf:build` (OpenNext + D1), otherwise "node".
const runtime = process.env.GAPIR_RUNTIME === "cloudflare" ? "cloudflare" : "node";

const nextConfig: NextConfig = {
  // Local address of the teacher's site (see src/server/site.ts). To open the dev
  // server from a phone in the same network: DEV_ORIGINS=192.168.1.20 npm run dev
  allowedDevOrigins: ["teacher.localhost", ...(process.env.DEV_ORIGINS?.split(",").filter(Boolean) ?? [])],
  env: {
    GAPIR_RUNTIME: runtime,
  },
  images: {
    // On Workers next/image would need the Cloudflare Images binding; the app
    // only serves a small logo, so static files are served as-is there.
    unoptimized: runtime === "cloudflare",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
