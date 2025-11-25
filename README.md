# COPE PAIN Whitelist System - Phase 1

Phase 1 of the COPE PAIN viral whitelist system focusing on wallet entry, referral tracking, and ranking.

## Features

- ✅ Mandatory pop-up tasks before wallet entry
- ✅ EVM wallet address submission
- ✅ Referral tracking system
- ✅ Ranking based on referral count
- ✅ User dashboard
- ✅ Leaderboard
- ✅ Supabase backend integration

## Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Set up Supabase:**
   - Create a project at [https://supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor
   - Create a `.env.local` file with your Supabase credentials (see `ENV_SETUP.md`)

3. **Run the development server:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Database Setup

The system uses Supabase PostgreSQL database. See `SUPABASE_SETUP.md` for detailed setup instructions.

## Phase 1 Limitations

- No COPE Pain Score calculation
- No X account age detection
- No referral boosts

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Supabase (PostgreSQL)

