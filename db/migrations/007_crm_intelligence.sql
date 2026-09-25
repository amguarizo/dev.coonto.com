BEGIN;

CREATE TABLE IF NOT EXISTS classroom_teachers (
  organization_id TEXT NOT NULL,
  classroom_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (classroom_id,user_id),
  FOREIGN KEY (organization_id,classroom_id) REFERENCES classrooms(organization_id,id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id,user_id) REFERENCES organization_memberships(organization_id,user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crm_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
  related_type TEXT,
  related_id TEXT,
  channel TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_crm_events_created ON crm_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_events_org_created ON crm_events(organization_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_events_user_created ON crm_events(user_id,created_at DESC);

CREATE TABLE IF NOT EXISTS crm_event_organizations (
  event_id TEXT NOT NULL REFERENCES crm_events(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id,organization_id)
);
CREATE INDEX IF NOT EXISTS idx_crm_event_organizations_org ON crm_event_organizations(organization_id,event_id);

CREATE TABLE IF NOT EXISTS partner_referrals (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES partner_leads(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lead_id)
);
CREATE TABLE IF NOT EXISTS referral_attributions (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  referral_id TEXT NOT NULL REFERENCES partner_referrals(id) ON DELETE CASCADE,
  attributed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_referral_attributions_referral ON referral_attributions(referral_id);

CREATE TABLE IF NOT EXISTS crm_opportunities (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
  lead_id TEXT REFERENCES partner_leads(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'idea' CHECK (stage IN ('idea','conversation','proposal','agreed','closed')),
  model TEXT NOT NULL DEFAULT 'to_define' CHECK (model IN ('to_define','pilot','referral','recurring','fixed')),
  potential_cents INTEGER NOT NULL DEFAULT 0 CHECK (potential_cents BETWEEN 0 AND 100000000),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (organization_id IS NOT NULL OR lead_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_stage ON crm_opportunities(stage,updated_at DESC);

COMMIT;
