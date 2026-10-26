-- GIN index untuk FTS pencarian judul+excerpt (gantikan contains di contentMarkdown).
-- Mempercepat /api/search dan /search tanpa scan kolom TOAST contentMarkdown.
CREATE INDEX IF NOT EXISTS "Article_title_excerpt_fts_idx"
  ON "Article"
  USING GIN (to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(excerpt, '')));
