import { PrismaClient } from "@prisma/client";

declare global {
  // Add a global variable for dev to prevent multiple PrismaClient instances
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use existing Prisma client if available (dev) or create a new one
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query"], // optional, logs all queries
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
