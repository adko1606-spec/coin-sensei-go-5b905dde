ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS lives integer NOT NULL DEFAULT 6,
  ADD COLUMN IF NOT EXISTS lives_updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;