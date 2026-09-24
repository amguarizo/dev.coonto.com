CREATE TABLE IF NOT EXISTS teacher_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teacher_bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES teacher_profiles(user_id) ON DELETE CASCADE,
  work_slug TEXT NOT NULL,
  scene_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_teacher_bookmarks_user_work ON teacher_bookmarks(user_id, work_slug, created_at);
