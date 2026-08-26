import { Prisma, PrismaClient } from '@prisma/client';
import { validateProductionEnv } from '@/lib/env';

validateProductionEnv();

const RETRYABLE_ERROR_CODES = new Set(['P2024', 'P1001', 'P1002']);
const MAX_DB_ATTEMPTS = 3;

async function withConnectionRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_DB_ATTEMPTS; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const code =
        error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined;
      if (!code || !RETRYABLE_ERROR_CODES.has(code) || attempt === MAX_DB_ATTEMPTS) {
        throw error;
      }
      console.warn(
        `[db] Transient error ${code} (attempt ${attempt}/${MAX_DB_ATTEMPTS}), retrying...`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000 * 2 ** (attempt - 1)));
    }
  }
  throw lastError;
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends({
    query: {
      $allModels: {
        $allOperations({ args, query }) {
          return withConnectionRetry(() => query(args));
        },
      },
    },
  });
}

type PrismaWithRetry = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaWithRetry | undefined;
};

export const prisma: PrismaWithRetry =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
