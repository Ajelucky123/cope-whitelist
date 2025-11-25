# COPE PAIN Whitelist - Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Copy Image File**
   Make sure `images/image.png` exists. If it doesn't, copy your character image to:
   - `public/images/image.png` (for Next.js to serve it)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
copev2/
├── app/
│   ├── api/              # API routes
│   │   ├── registerWallet/
│   │   ├── getUser/
│   │   └── leaderboard/
│   ├── dashboard/         # User dashboard page
│   ├── leaderboard/       # Leaderboard page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── FloatingBackground.tsx
│   ├── MandatoryTasksModal.tsx
│   └── WalletEntry.tsx
├── lib/
│   ├── storage.ts        # Client-side storage (utilities)
│   └── server-storage.ts  # Server-side storage (file-based)
├── public/
│   └── images/
│       └── image.png      # Character image
└── data/                 # Auto-created: stores users.json and referrals.json
```

## Features Implemented (Phase 1)

✅ **Mandatory Tasks Modal**
- Follow COPE on X
- Join COPE Community
- Must complete before wallet entry

✅ **Wallet Registration**
- EVM address validation (0x... format)
- Stores to file-based database

✅ **Referral System**
- Unique referral codes
- Tracks referrals
- Updates referrer counts

✅ **Ranking System**
- Tourist (0 referrals)
- Survivor (1-3 referrals)
- Pain Holder (4-10 referrals)
- Cope Lord (11-25 referrals)
- Peak Cope (26+ referrals)

✅ **Dashboard**
- Shows wallet address
- Displays referral link
- Shows current rank and stats
- Copy referral link

✅ **Leaderboard**
- Top 100 referrers
- Shows rank, wallet, referrals, tier

## API Endpoints

- `POST /api/registerWallet` - Register new wallet
- `GET /api/getUser?walletAddress=...` - Get user data
- `GET /api/leaderboard` - Get leaderboard

## Data Storage

Phase 1 uses file-based storage in `/data` directory:
- `data/users.json` - All user records
- `data/referrals.json` - Referral records

**Note:** For production, you'll want to migrate to a proper database (PostgreSQL, MongoDB, etc.)

## Next Steps (Phase 2)

- X account age detection
- COPE Pain Score calculation
- Referral boosts
- X OAuth integration

