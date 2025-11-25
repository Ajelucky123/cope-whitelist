# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note your project URL and anon key

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL script to create tables and policies

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in:
- Supabase Dashboard → Settings → API
- Project URL: Under "Project URL"
- Anon Key: Under "Project API keys" → `anon` `public`

## Step 4: Install Dependencies

```bash
npm install
```

The `@supabase/supabase-js` package is already added to `package.json`.

## Step 5: Test the Connection

The code will automatically use Supabase when the environment variables are set. If not set, it will fall back to file-based storage (for development).

## Database Schema

### Users Table
- `id` (UUID) - Primary key
- `wallet_address` (TEXT) - Unique EVM wallet address
- `referral_code` (TEXT) - Unique referral code
- `referred_by` (UUID) - Reference to referring user
- `referral_count` (INTEGER) - Number of referrals
- `created_at` (TIMESTAMPTZ) - Account creation time
- `updated_at` (TIMESTAMPTZ) - Last update time

### Referrals Table
- `id` (UUID) - Primary key
- `referrer_id` (UUID) - User who made the referral
- `referred_user_id` (UUID) - User who was referred
- `timestamp` (TIMESTAMPTZ) - When referral was made

## Row Level Security (RLS)

The schema includes RLS policies that:
- Allow public read access (for leaderboard)
- Allow public insert access (for registration)
- Allow updates for referral counts

For production, you may want to tighten these policies based on your security requirements.

## Migration from File Storage

If you have existing data in `data/users.json`:
1. Export the data
2. Use Supabase dashboard or API to import users
3. The system will automatically use Supabase once configured

