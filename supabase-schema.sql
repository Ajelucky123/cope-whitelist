-- COPE PAIN Whitelist Database Schema for Supabase

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  name TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES users(id),
  referral_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add name column if it doesn't exist (for existing databases)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'name'
  ) THEN
    ALTER TABLE users ADD COLUMN name TEXT;
  END IF;
END $$;

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_user_id UUID NOT NULL REFERENCES users(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_user_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referral_count ON users(referral_count DESC);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read users (for leaderboard)
CREATE POLICY "Allow public read access to users" ON users
  FOR SELECT USING (true);

-- Policy: Allow anyone to insert users (for registration)
CREATE POLICY "Allow public insert access to users" ON users
  FOR INSERT WITH CHECK (true);

-- Policy: Allow users to update their own referral count (via service role)
-- Note: In production, you may want to restrict this further
CREATE POLICY "Allow update referral count" ON users
  FOR UPDATE USING (true);

-- Policy: Allow public read access to referrals
CREATE POLICY "Allow public read access to referrals" ON referrals
  FOR SELECT USING (true);

-- Policy: Allow public insert access to referrals
CREATE POLICY "Allow public insert access to referrals" ON referrals
  FOR INSERT WITH CHECK (true);

