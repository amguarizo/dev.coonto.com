BEGIN;
CREATE TABLE IF NOT EXISTS work_suggestions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  reason TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_work_suggestions_status_created ON work_suggestions(status, created_at DESC);
CREATE TABLE IF NOT EXISTS commercial_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  single_price_cents INTEGER NOT NULL DEFAULT 990 CHECK (single_price_cents BETWEEN 0 AND 1000000),
  club_price_cents INTEGER NOT NULL DEFAULT 1990 CHECK (club_price_cents BETWEEN 0 AND 1000000),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO commercial_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
COMMIT;
