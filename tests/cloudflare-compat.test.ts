import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

describe("Cloudflare D1 compatibility", () => {
  // In the Worker, Prisma's D1 adapter throws on interactive transactions,
  // while local SQLite accepts them, so this only fails in production.
  it("uses no interactive Prisma transactions in app code", () => {
    const offenders = ["app", "src"]
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .filter((file) => /\$transaction\(\s*async/.test(readFileSync(file, "utf8")))
      .map((file) => relative(root, file));
    expect(offenders, "use prisma.$transaction([...]) batches or sequential writes").toEqual([]);
  });
});
