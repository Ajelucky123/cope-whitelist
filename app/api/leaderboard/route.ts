import { NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/supabase-storage'
import { getRank } from '@/lib/storage'

export async function GET() {
  try {
    const users = getLeaderboard(100)
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      walletAddress: user.walletAddress,
      referralCount: user.referralCount,
      tier: getRank(user.referralCount),
      joinedAt: user.createdAt,
    }))

    return NextResponse.json({ leaderboard })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

