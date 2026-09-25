BEGIN;

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('school','course','partner')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_memberships (
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('manager','teacher','student')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organization_id,user_id)
);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_memberships(user_id);

CREATE TABLE IF NOT EXISTS classrooms (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id,id)
);

CREATE TABLE IF NOT EXISTS classroom_enrollments (
  organization_id TEXT NOT NULL,
  classroom_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (classroom_id,user_id),
  FOREIGN KEY (organization_id,classroom_id) REFERENCES classrooms(organization_id,id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id,user_id) REFERENCES organization_memberships(organization_id,user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS license_pools (
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  work_slug TEXT NOT NULL,
  seats INTEGER NOT NULL CHECK (seats BETWEEN 0 AND 100000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organization_id,work_slug)
);

CREATE TABLE IF NOT EXISTS license_assignments (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  work_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id,user_id,work_slug),
  FOREIGN KEY (organization_id,user_id) REFERENCES organization_memberships(organization_id,user_id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id,work_slug) REFERENCES license_pools(organization_id,work_slug) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_license_assignments_pool ON license_assignments(organization_id,work_slug,status);

COMMIT;
