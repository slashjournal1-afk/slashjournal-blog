import { prisma } from './db';

export async function recordAuditLog({
  actorEmail,
  action,
  details,
  ipAddress,
  userId,
}: {
  actorEmail: string;
  action: string;
  details: string;
  ipAddress?: string;
  userId?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorEmail,
        action,
        details,
        ipAddress: ipAddress || '127.0.0.1',
        userId,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
