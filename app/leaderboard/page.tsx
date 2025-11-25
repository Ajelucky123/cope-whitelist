'use client'

import { useRouter } from 'next/navigation'

export default function Leaderboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen p-4 relative z-10 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <header className="mb-8">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cope-orange to-cope-orange-light bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-gray-400 text-lg">
            Ranking the Survivors
          </p>
        </header>

        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-12 shadow-[0_0_20px_rgba(255,122,0,0.15)]">
          <div className="text-6xl font-black mb-6 bg-gradient-to-r from-cope-orange to-cope-orange-light bg-clip-text text-transparent">
            Coming Soon
          </div>
          <p className="text-gray-400 text-lg mb-8">
            The leaderboard will be available soon. Keep referring to climb the ranks!
          </p>
        </div>

        <div className="mt-6">
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

