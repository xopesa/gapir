// Builds the Cloudflare Worker with OpenNext.
// The Prisma client must use the "cloudflare" runtime inside the Worker (WASM is
// imported as a module there), while `next dev`, tests and scripts need the Node
// runtime. So the Worker client is generated only for the duration of the build
// and the Node client is restored afterwards.
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const schemaPath = resolve("prisma/schema.prisma");
const tempSchemaPath = resolve("prisma/.schema.cloudflare.prisma");

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed with code ${result.status}`);
}

const schema = readFileSync(schemaPath, "utf8");
const cloudflareSchema = schema.replace(
  /(generator client \{[^}]*?provider\s*=\s*"prisma-client")/,
  '$1\n  runtime  = "cloudflare"',
);
if (cloudflareSchema === schema) throw new Error("Could not inject runtime into the Prisma generator block");

let failed = false;
try {
  run("node", ["scripts/build-prompts.mjs"]);
  writeFileSync(tempSchemaPath, cloudflareSchema);
  run("npx", ["prisma", "generate", "--schema", tempSchemaPath]);
  run("npx", ["opennextjs-cloudflare", "build"], { GAPIR_RUNTIME: "cloudflare" });
} catch (error) {
  failed = true;
  console.error(error instanceof Error ? error.message : error);
} finally {
  rmSync(tempSchemaPath, { force: true });
  run("npx", ["prisma", "generate"]);
}
process.exit(failed ? 1 : 0);
