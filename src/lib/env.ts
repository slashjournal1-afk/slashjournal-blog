const requiredProductionEnv = ['DATABASE_URL', 'DIRECT_URL', 'BLOB_READ_WRITE_TOKEN'];

export function validateProductionEnv() {
  if (process.env.NODE_ENV !== 'production') return;
  const missing = requiredProductionEnv.filter((name) => !process.env[name]);
  if (!process.env.AUTH_SECRET && !process.env.JWT_SECRET) missing.push('AUTH_SECRET or JWT_SECRET');
  if (missing.length) throw new Error(`Missing production environment variables: ${missing.join(', ')}`);
}
