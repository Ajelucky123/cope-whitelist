# Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration (REQUIRED)
# Get these from your Supabase project dashboard: Settings → API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Supabase Service Role Key (REQUIRED for production/Vercel)
# This is needed for server-side operations that update referral counts
# Get this from your Supabase project dashboard: Settings → API → service_role key
# IMPORTANT: Never expose this key to the client - it bypasses RLS
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Telegram Bot Token (Optional - for Telegram verification)
# Get this from @BotFather on Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# X/Twitter API Credentials (Optional - for X OAuth 2.0)
# Get these from https://developer.twitter.com/
X_API_KEY=your_x_api_key_here
X_API_SECRET=your_x_api_secret_here
X_CLIENT_ID=your_x_client_id_here
X_CLIENT_SECRET=your_x_client_secret_here
```

## Where to Find Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Open your project dashboard
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Important Notes for Vercel Deployment

When deploying to Vercel, make sure to add **all three** Supabase environment variables:
1. `NEXT_PUBLIC_SUPABASE_URL` - Public, safe to expose
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public, safe to expose
3. `SUPABASE_SERVICE_ROLE_KEY` - **PRIVATE** - Only used server-side, never expose to client

The service role key is required for updating referral counts on Vercel because it bypasses Row Level Security (RLS) policies. Without it, referral count updates will fail silently.

To add environment variables in Vercel:
1. Go to your project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for all environments (Production, Preview, Development)

