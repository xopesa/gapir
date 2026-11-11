import type { NextConfig } from "next";

// "cloudflare" when built by `npm run cf:build` (OpenNext + D1), otherwise "node".
const runtime = process.env.GAPIR_RUNTIME === "cloudflare" ? "cloudflare" : "node";

const nextConfig: NextConfig = {
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
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
