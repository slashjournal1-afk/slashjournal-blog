/** @type {import('next').NextConfig} */
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.slashjournal.my.id');
const apexHost = siteUrl.hostname.replace(/^www\./, '');

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.slashjournal.my.id' },
      { protocol: 'https', hostname: 'slashjournal.my.id' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: apexHost }],
        destination: `${siteUrl.protocol}//${siteUrl.host}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googlesyndication.com https://*.adtrafficquality.google https://static.cloudflareinsights.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://cloudflareinsights.com https://static.cloudflareinsights.com; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self' https://www.googletagmanager.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://www.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
