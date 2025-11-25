# Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration (REQUIRED)
# Get these from your Supabase project dashboard: Settings → API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

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

