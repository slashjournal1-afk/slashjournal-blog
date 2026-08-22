import { NextResponse } from 'next/server';

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unknown server error';
}

export function jsonError(message: string, status: number, error?: unknown) {
  const body: { error: string; detail?: string } = { error: message };

  if (process.env.NODE_ENV !== 'production' && error) {
    body.detail = errorMessage(error);
  }

  return NextResponse.json(body, { status });
}

export function isValidInternalPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.includes('://');
}
