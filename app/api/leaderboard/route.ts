import { NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/supabase-storage'
import { getRank } from '@/lib/storage'

// Always render dynamically so new joins/referrals show immediately
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Get ALL users (no limit) - show everyone who has joined
    // This ensures dynamic ranking - when someone gets a referral, their rank updates
    const users = await getLeaderboard(10000)
    
    // Dynamic ranking: Sort by referral count (descending), then by join date (ascending - FCFS)
    // This means:
    // - Users with more referrals rank higher
    // - When someone gets a referral, they move up in rankings immediately
    // - Users with same referral count are ranked by who joined first (FCFS)
    const sortedUsers = [...users].sort((a, b) => {
      // Primary sort: referral count (descending) - more referrals = higher rank
      if (b.referralCount !== a.referralCount) {
        return b.referralCount - a.referralCount
      }
      // Secondary sort: earlier join date for same referral count (FCFS - First Come First Served)
      // Earlier joiners rank higher when referral counts are equal
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
    
    // Assign sequential ranks (no shared ranks - FCFS for ties)
    // Each user gets a unique rank that updates dynamically as referral counts change
    const leaderboard = sortedUsers.map((user, index) => {
      // Sequential ranking: each user gets a unique rank based on current position
      // When referral counts change, ranks automatically adjust
      const rank = index + 1
      
      return {
        rank,
        walletAddress: user.walletAddress,
        referralCount: user.referralCount,
        tier: getRank(user.referralCount),
        joinedAt: user.createdAt,
      }
    })

    return NextResponse.json(
      { leaderboard },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

