import { google } from 'googleapis';

export function googleErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const candidate = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
    return candidate.response?.data?.error?.message || candidate.message || 'Google API request failed';
  }
  return 'Google API request failed';
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function normalizePrivateKey(value: string): string {
  let key = value.trim();
  if (key.startsWith('"') && key.endsWith('",')) key = key.slice(1, -2);
  else if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
  return key.replace(/\\n/g, '\n').replace(/\\r/g, '\r').trim();
}

export function createAnalyticsAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: required('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
      private_key: normalizePrivateKey(required('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY')),
    },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
}

export function createAdSenseAuth() {
  const oauth2 = new google.auth.OAuth2(
    required('GOOGLE_ADSENSE_CLIENT_ID'),
    required('GOOGLE_ADSENSE_CLIENT_SECRET'),
  );
  oauth2.setCredentials({ refresh_token: required('GOOGLE_ADSENSE_REFRESH_TOKEN') });
  return oauth2;
}
