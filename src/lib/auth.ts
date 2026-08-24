import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { UserSession, UserRole } from './types';
import { cache } from 'react';

export const AUTH_COOKIE_NAME = 'slash_kb_token';

const SESSION_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET;

function getSessionSecret(): string {
  if (SESSION_SECRET) return SESSION_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET or JWT_SECRET is required in production');
  }
  return 'development-only-session-secret';
}

function signSessionPayload(payload: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function generateToken(payload: { userId: string; role: UserRole }): string {
  const encodedPayload = Buffer.from(JSON.stringify({
    ...payload,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  })).toString('base64url');
  return `${encodedPayload}.${signSessionPayload(encodedPayload)}`;
}

export function parseToken(token: string): { userId: string; role: UserRole; exp: number } | null {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;
    const expectedSignature = signSessionPayload(encodedPayload);
    const expectedBuffer = Buffer.from(expectedSignature);
    const actualBuffer = Buffer.from(signature);
    if (expectedBuffer.length !== actualBuffer.length || !crypto.timingSafeEqual(expectedBuffer, actualBuffer)) {
      return null;
    }
    const data = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8')) as {
      userId?: unknown;
      role?: unknown;
      exp?: unknown;
    };
    if (typeof data.userId !== 'string' || typeof data.role !== 'string' || typeof data.exp !== 'number') return null;
    if (data.exp && data.exp < Date.now()) return null;
    if (!['ADMIN', 'EDITOR', 'AUTHOR', 'READER'].includes(data.role)) return null;
    return data as { userId: string; role: UserRole; exp: number };
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string, role: UserRole) {
  const token = generateToken({ userId, role });
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

async function getCurrentUserInternal(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const parsed = parseToken(token);
    if (!parsed) {
      console.error('[auth-debug] token gagal di-parse atau ditolak');
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: parsed.userId },
      select: {
        id: true,
        email: true,
        name: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        provider: true,
        isBlocked: true,
      },
    });

    if (!user || user.isBlocked) return null;

    return user as UserSession;
  } catch (debugErr) {
    console.error('[auth-debug] getCurrentUser gagal:', debugErr);
    return null;
  }
}

export const getCurrentUser = cache(getCurrentUserInternal);

export function hasPermission(currentRole: UserRole, allowedRoles: UserRole[]): boolean {
  if (currentRole === 'ADMIN') return true;
  return allowedRoles.includes(currentRole);
}

// Stateless secure HMAC-based password reset token
const RESET_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET;

function getResetSecret(): string {
  if (RESET_SECRET) return RESET_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET or JWT_SECRET is required in production');
  }
  return 'development-only-password-reset-secret';
}

export function generateResetToken(email: string): string {
  const exp = Date.now() + 60 * 60 * 1000; // 1 hour expiration
  const payload = `${email.toLowerCase().trim()}:${exp}`;
  const signature = crypto.createHmac('sha256', getResetSecret()).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

export function verifyResetToken(token: string): { email: string; valid: boolean; error?: string } {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8');
    const [email, expStr, signature] = raw.split(':');
    const exp = parseInt(expStr, 10);

    if (!email || isNaN(exp) || !signature) {
      return { email: '', valid: false, error: 'Format token tidak valid' };
    }

    if (Date.now() > exp) {
      return { email, valid: false, error: 'Token pemulihan telah kedaluwarsa (berlaku 1 jam)' };
    }

    const expectedSig = crypto.createHmac('sha256', getResetSecret()).update(`${email}:${exp}`).digest('hex');
    if (signature.length !== expectedSig.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { email: '', valid: false, error: 'Tanda tangan token tidak valid atau telah dimanipulasi' };
    }

    return { email, valid: true };
  } catch {
    return { email: '', valid: false, error: 'Token tidak dapat diproses' };
  }
}
