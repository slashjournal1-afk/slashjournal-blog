export interface ParsedPagination {
  page: number;
  skip: number;
}

const MAX_PRISMA_SKIP = 2_147_483_647;

export function parsePaginationPage(value: string | string[] | undefined, pageSize: number): ParsedPagination | null {
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) throw new RangeError('pageSize harus bilangan bulat positif');
  const raw = value ?? '1';
  if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw)) return null;
  const page = Number(raw);
  const skip = (page - 1) * pageSize;
  if (!Number.isSafeInteger(page) || !Number.isSafeInteger(skip) || skip > MAX_PRISMA_SKIP) return null;
  return { page, skip };
}
