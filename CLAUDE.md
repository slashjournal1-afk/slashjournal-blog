# Project: SlashJournal

## Brand Identity
- **Name**: SlashJournal
- **Domain**: `slashjournal.dev`
- **Tagline**: *Catatan Arsitektur & Rekayasa Perangkat Lunak* / *Enterprise Technical Knowledge Base & Architectural Wiki*
- **Aesthetic**: Awesomic Zinc & Ember Style (clean geometric sans-serif + display serif/mono, neutral zinc palette `#f4f4f5` / `#09090b`, `#ececee` / `#27272a` 1px hairline borders, `#ff5a00` Ember accents, zero drop shadows).

## Tech Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 3 with custom CSS variables & Awesomic tokens
- **Database & ORM**: PostgreSQL (Supabase) with Prisma ORM 6
- **Storage**: Supabase Storage with local fallback (`public/uploads`) + Sharp WebP optimization
- **Authentication**: Custom JWT / Session HMAC (`slash_kb_token`), Multi-role RBAC (`ADMIN`, `EDITOR`, `AUTHOR`, `READER`), TOTP 2FA
- **Content Engine**: Markdown + WikiLinks (`[[slug]]`), Multi-Tab Code blocks, Mermaid.js sequence & architecture diagrams

## Commands
- Dev Server: `npm run dev`
- Build: `npm run build`
- Type Check: `npx tsc --noEmit`
- Prisma Schema Push: `npx prisma db push`
- Prisma Seed: `npm run prisma:seed`
- Lint: `npm run lint`

## Key Architecture & Code Conventions
- **Modularity**: Small, single-responsibility components segregated by domain (`components/content`, `components/editor`, `components/layout`, `components/ads`, `components/search`, `lib/`).
- **Data Privacy & UU PDP**: Always respect UU No. 27/2022 (UU PDP). Channel `jurnal-personal` is excluded from indexing (`isIndexable: false`). Soft delete anonymizes comments to `"Pengguna Terhapus"`.
- **Editorial Workflow**: Articles transition from `DRAFT` ➔ `IN_REVIEW` ➔ `PUBLISHED`.
- **Performance**: Edge-first metadata, WebP conversion on upload, server-side caching, efficient database indexes on foreign keys and slugs.
