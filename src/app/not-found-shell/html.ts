import { siteConfig } from '@/lib/site';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/category', label: 'Kategori' },
  { href: '/series', label: 'Seri' },
  { href: '/glossary', label: 'Glosarium' },
  { href: '/about', label: 'Tentang' },
  { href: '/contact', label: 'Kontak' },
];

function renderLinks() {
  return navLinks
    .map(
      (link) =>
        `<li><a href="${link.href}">${link.label}</a></li>`
    )
    .join('');
}

export function buildNotFoundHtml(): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Halaman Tidak Ditemukan — ${siteConfig.name}</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    background: #f7f6f3; color: #171717;
    min-height: 100vh; display: flex; flex-direction: column;
    -webkit-font-smoothing: antialiased;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #141413; color: #f2f1ee; }
    .shell { border-color: #2b2b28 !important; }
    .dek, .meta { color: #9d9c96 !important; }
    .links a { color: #d6d5d0 !important; border-bottom-color: #2b2b28 !important; }
    .links a:hover { color: #f2f1ee !important; }
    input[type="search"] { background: #1c1c1a !important; border-color: #2b2b28 !important; color: #f2f1ee !important; }
  }
  .wrap { max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 32px; }
  main.wrap { padding-top: 72px; padding-bottom: 80px; flex: 1; }
  .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #00a86b; }
  .numeral { margin-top: 16px; font-family: Georgia, "Times New Roman", serif; font-weight: 500; font-size: clamp(88px, 16vw, 160px); line-height: 1; letter-spacing: -.02em; }
  .numeral span { color: #00a86b; }
  h1 { margin-top: 20px; font-family: Georgia, "Times New Roman", serif; font-weight: 500; font-size: clamp(26px, 4vw, 38px); line-height: 1.15; letter-spacing: -.01em; max-width: 640px; }
  .dek { margin-top: 14px; font-size: 17px; line-height: 1.7; color: #525252; max-width: 560px; }
  form[role="search"] { margin-top: 36px; max-width: 560px; display: flex; gap: 8px; }
  .field { position: relative; flex: 1; }
  input[type="search"] {
    width: 100%; height: 46px; padding: 0 16px; font-size: 15px;
    border: 1px solid #e5e5e5; border-radius: 10px; background: #ffffff; color: inherit; outline: none;
  }
  input[type="search"]:focus { border-color: rgba(0,168,107,.35); box-shadow: 0 0 0 3px rgba(0,168,107,.12); }
  button[type="submit"] {
    height: 46px; padding: 0 22px; font-size: 14px; font-weight: 500; cursor: pointer;
    border-radius: 10px; border: 1px solid #171717; background: #171717; color: #fff; transition: background .15s ease;
  }
  button[type="submit"]:hover { background: #2a2a2a; }
  .home { display: inline-block; margin-top: 28px; min-height: 44px; line-height: 42px; padding: 0 22px;
    font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 10px;
    border: 1px solid currentColor; transition: opacity .15s ease; }
  .home:hover { opacity: .85; }
  .rule { border: 0; border-top: 1px solid #e5e5e5; margin: 48px 0; }
  h2 { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #737373; margin-bottom: 14px; }
  ul.links { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0 32px; }
  .links a { display: block; padding: 11px 0; font-size: 15px; font-weight: 500; text-decoration: none;
    color: #2a2a2a; border-bottom: 1px solid #eeece7; transition: color .15s ease; }
  .links a:hover { color: #00805a; }
  footer.wrap { padding-top: 24px; padding-bottom: 40px; border-top: 1px solid #e5e5e5;
    font-size: 12px; color: #737373; }
  @media (max-width: 640px) { .wrap { padding-left: 20px; padding-right: 20px; } main.wrap { padding-top: 48px; } }
</style>
</head>
<body>
<main class="wrap">
  <p class="eyebrow">Error · Halaman Tidak Ditemukan</p>
  <div class="numeral" aria-hidden="true"><span>/</span>404</div>
  <h1>Alamat ini tidak ada atau sudah dipindahkan.</h1>
  <p class="dek">Tautan yang Anda buka mungkin salah ketik, usang, atau artikelnya telah diarsipkan. Coba cari dari sini — atau lanjutkan menjelajah lewat tautan di bawah.</p>
  <form action="/search" method="GET" role="search">
    <label for="nf-q" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Cari artikel di ${siteConfig.name}</label>
    <div class="field"><input type="search" id="nf-q" name="q" minlength="2" autocomplete="off" placeholder="Cari topik…"></div>
    <button type="submit">Cari</button>
  </form>
  <a class="home" href="/">Kembali ke Beranda</a>
  <hr class="rule">
  <nav aria-label="Jelajahi bagian situs">
    <h2>Jelajahi</h2>
    <ul class="links">${renderLinks()}</ul>
  </nav>
</main>
<footer class="wrap">© ${new Date().getFullYear()} ${siteConfig.name} — halaman ini dikembalikan dengan status HTTP 404.</footer>
</body>
</html>`;
}
