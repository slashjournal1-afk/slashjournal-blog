const requiredProductionEnv = ['DATABASE_URL', 'DIRECT_URL', 'BLOB_READ_WRITE_TOKEN'];

export function validateProductionEnv() {
  if (process.env.NODE_ENV !== 'production') return;
  const missing = requiredProductionEnv.filter((name) => !process.env[name]);
  if (!process.env.AUTH_SECRET && !process.env.JWT_SECRET) missing.push('AUTH_SECRET or JWT_SECRET');
  if (missing.length) throw new Error(`Missing production environment variables: ${missing.join(', ')}`);
}

export function googleConfigurationStatus() {
  return {
    ga4: Boolean(
      (process.env.GOOGLE_ANALYTICS_PROPERTY_ID || process.env.GA4_PROPERTY_ID) &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    ),
    adsense: Boolean(
      (process.env.GOOGLE_ADSENSE_ACCOUNT_ID || process.env.ADSENSE_ACCOUNT_ID) &&
      process.env.GOOGLE_ADSENSE_CLIENT_ID &&
      process.env.GOOGLE_ADSENSE_CLIENT_SECRET &&
      process.env.GOOGLE_ADSENSE_REFRESH_TOKEN,
    ),
  };
}
