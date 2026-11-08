import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const PRISMA_SCHEMA_VERSION = "20260804000000";
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; prismaSchemaVersion?: string };

function createPrismaClient() {
  const configuredUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({
    url: configuredUrl === "file:./dev.db" ? "file:./prisma/dev.db" : configuredUrl,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma && globalForPrisma.prismaSchemaVersion === PRISMA_SCHEMA_VERSION
  ? globalForPrisma.prisma
  : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
}
