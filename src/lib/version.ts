// The site's version (package.json). Bump it with every update and describe the
// update in CHANGELOG.md. The Android app is a shell around the site: it reports
// the version it was built from in its user agent ("GapirApp/1.1.0").
import pkg from "@/package.json";

export const SITE_VERSION: string = pkg.version;

/** The Android shell's own version, or null in a normal browser. */
export function appShellVersion(userAgent: string | null | undefined) {
  const match = /GapirApp(?:\/([\d.]+))?/.exec(userAgent ?? "");
  // Shells built before versioning only say "GapirApp": that build is 1.0.
  return match ? match[1] ?? "1.0" : null;
}
