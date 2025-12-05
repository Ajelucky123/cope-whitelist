'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface LeaderboardEntry {
  rank: number
  walletAddress: string
  referralCount: number
  tier: string
  joinedAt: string
}

export default function Leaderboard() {
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Add cache-busting parameter and no-cache headers to ensure fresh data
        const response = await fetch(`/api/leaderboard?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard')
        }
        const data = await response.json()
        setLeaderboard(data.leaderboard || [])
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchLeaderboard()

    // Set up auto-refresh every 5 minutes (300,000 milliseconds)
    const interval = setInterval(() => {
      fetchLeaderboard()
    }, 5 * 60 * 1000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-orange-400 to-orange-600'
    return 'from-cope-orange to-cope-orange-light'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading leaderboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-cope-orange to-cope-orange-light text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cope-orange to-cope-orange-light bg-clip-text text-transparent">
            COPE Pain Leaderboard
          </h1>
          <p className="text-gray-400 text-lg">
            Ranking the Survivors
          </p>
        </header>

        {leaderboard.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-12 shadow-[0_0_20px_rgba(255,122,0,0.15)] text-center">
            <p className="text-gray-400 text-lg">
              No survivors yet. Be the first to join!
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,122,0,0.15)]">
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-500 border-opacity-30 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🥈</div>
                  <div className="text-2xl font-black mb-1 bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                    #{leaderboard[1].rank}
                  </div>
                  <div className="text-xs font-mono text-gray-400 mb-2">
                    {truncateAddress(leaderboard[1].walletAddress)}
                  </div>
                  <div className="text-lg font-bold text-white mb-1">
                    {leaderboard[1].referralCount}
                  </div>
                  <div className="text-xs text-gray-500">{leaderboard[1].tier}</div>
                </div>

                {/* 1st Place */}
                <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 border-2 border-yellow-500 border-opacity-40 rounded-xl p-4 text-center transform scale-105">
                  <div className="text-4xl mb-2">🥇</div>
                  <div className="text-3xl font-black mb-1 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    #{leaderboard[0].rank}
                  </div>
                  <div className="text-xs font-mono text-gray-300 mb-2">
                    {truncateAddress(leaderboard[0].walletAddress)}
                  </div>
                  <div className="text-xl font-bold text-white mb-1">
                    {leaderboard[0].referralCount}
                  </div>
                  <div className="text-xs text-yellow-400 font-semibold">{leaderboard[0].tier}</div>
                </div>

                {/* 3rd Place */}
                <div className="bg-gradient-to-br from-orange-900 to-orange-950 border-2 border-orange-500 border-opacity-30 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🥉</div>
                  <div className="text-2xl font-black mb-1 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    #{leaderboard[2].rank}
                  </div>
                  <div className="text-xs font-mono text-gray-400 mb-2">
                    {truncateAddress(leaderboard[2].walletAddress)}
                  </div>
                  <div className="text-lg font-bold text-white mb-1">
                    {leaderboard[2].referralCount}
                  </div>
                  <div className="text-xs text-gray-500">{leaderboard[2].tier}</div>
                </div>
              </div>
            )}

            {/* Leaderboard Table */}
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    entry.rank <= 3
                      ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-cope-orange border-opacity-20'
                      : 'bg-black bg-opacity-40 border-gray-800 border-opacity-30'
                  } hover:border-cope-orange hover:border-opacity-40 transition`}
                >
                  {/* Rank */}
                  <div className={`text-2xl font-black w-12 text-center ${
                    entry.rank <= 3
                      ? `bg-gradient-to-r ${getRankBadgeColor(entry.rank)} bg-clip-text text-transparent`
                      : 'text-gray-500'
                  }`}>
                    #{entry.rank}
                  </div>

                  {/* Wallet Address */}
                  <div className="flex-1">
                    <div className="font-mono text-sm text-gray-300">
                      {truncateAddress(entry.walletAddress)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Joined {formatDate(entry.joinedAt)}
                    </div>
                  </div>

                  {/* Referral Count */}
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">
                      {entry.referralCount}
                    </div>
                    <div className="text-xs text-gray-500">referrals</div>
                  </div>

                  {/* Tier */}
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                      entry.rank <= 3
                        ? 'bg-cope-orange bg-opacity-20 text-cope-orange'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {entry.tier}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-cope-orange to-cope-orange-light text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

