import { google } from 'googleapis';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function createAnalyticsAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: required('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
      private_key: required('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g, '\n'),
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
