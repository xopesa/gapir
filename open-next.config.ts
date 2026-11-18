import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Gapir pages are per-user and rendered dynamically, so no incremental cache
// (R2/KV) is configured. Add one here if static/ISR pages appear later.
export default defineCloudflareConfig({});
