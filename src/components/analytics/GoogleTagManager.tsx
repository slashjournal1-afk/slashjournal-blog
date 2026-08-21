'use client';

import Script from 'next/script';
import { siteConfig } from '@/lib/site';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'slashjournal-consent-v2';

export function GoogleTagManager() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(localStorage.getItem(CONSENT_KEY) === 'granted');
    const handleConsent = () => setEnabled(true);
    window.addEventListener('slashjournal:analytics-consent', handleConsent);
    return () => window.removeEventListener('slashjournal:analytics-consent', handleConsent);
  }, []);

  return (
    <>
      <script
        id="google-consent-default"
        dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});` }}
      />
      {enabled && <Script
        id="google-tag-manager"
        strategy="afterInteractive"
      >
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${siteConfig.gtmId}');`}
      </Script>}
      <noscript>
        <iframe
          title="Google Tag Manager"
          src={`https://www.googletagmanager.com/ns.html?id=${siteConfig.gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
