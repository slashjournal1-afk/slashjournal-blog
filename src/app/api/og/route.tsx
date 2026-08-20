import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'SlashJournal — Catatan Arsitektur & Rekayasa Perangkat Lunak';
  const category = searchParams.get('category') || 'Software Engineering';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#ff5a00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            /
          </div>
          <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
            SlashJournal
          </span>
          <span
            style={{
              fontSize: '14px',
              padding: '6px 14px',
              borderRadius: '100px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              color: '#ff5a00',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
            }}
          >
            {category}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: '52px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#f4f4f5',
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: '24px',
            borderTop: '1px solid #27272a',
            fontSize: '16px',
            color: '#71717a',
          }}
        >
          <span>Dokumentasi Arsitektur Sistem &amp; Rekayasa Software</span>
          <span>slashjournal.dev</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
