import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaClient } from "@/generated/prisma/client";

// Bump when the Prisma schema changes so dev hot reload drops a stale client.
const PRISMA_SCHEMA_VERSION = "20260804000000";

// GAPIR_RUNTIME is inlined by next.config.ts: "cloudflare" for the Worker build
// (OpenNext + D1), "node" for `next dev`, `next start`, tests and scripts (SQLite file).
const isCloudflare = process.env.GAPIR_RUNTIME === "cloudflare";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaVersion?: string;
};

function createNodeClient() {
  const configuredUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({
    url: configuredUrl === "file:./dev.db" ? "file:./prisma/dev.db" : configuredUrl,
  });
  return new PrismaClient({ adapter });
}

function getNodeClient() {
  if (globalForPrisma.prisma && globalForPrisma.prismaSchemaVersion === PRISMA_SCHEMA_VERSION) {
    return globalForPrisma.prisma;
  }
  const client = createNodeClient();
  globalForPrisma.prisma = client;
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
  return client;
}

// One client per D1 binding object. The binding comes from the request context,
// so the client is created lazily inside a request, never at module load.
const d1Clients = new WeakMap<D1Database, PrismaClient>();

function getCloudflareClient() {
  const { env } = getCloudflareContext();
  const database = env.DB;
  if (!database) throw new Error("D1 binding `DB` is not configured in wrangler.jsonc");
  let client = d1Clients.get(database);
  if (!client) {
    client = new PrismaClient({ adapter: new PrismaD1(database) });
    d1Clients.set(database, client);
  }
  return client;
}

export function getPrisma(): PrismaClient {
  return isCloudflare ? getCloudflareClient() : getNodeClient();
}

// Keeps the existing `import { prisma }` call sites working: every property
// access resolves the client for the current runtime (and request on Workers).
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrisma();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
