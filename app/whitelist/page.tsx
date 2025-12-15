'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

const LAUNCH_DATE = new Date('2025-12-18T00:00:00Z')

export default function WhitelistClosed() {
  const [timeLeft, setTimeLeft] = useState<string>('Calculating...')

  const calculateTimeLeft = useMemo(
    () => () => {
      const now = new Date().getTime()
      const target = LAUNCH_DATE.getTime()
      const diff = target - now
      if (diff <= 0) return 'Launching now!'

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      return `${days}d ${hours}h ${minutes}m ${seconds}s`
    },
    []
  )

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(interval)
  }, [calculateTimeLeft])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black text-white relative z-10">
      <div className="w-full max-w-5xl bg-gradient-to-b from-black via-black to-[#0f0f0f] border border-cope-orange border-opacity-30 rounded-3xl shadow-[0_0_40px_rgba(255,122,0,0.25)] overflow-hidden">
        <div className="flex justify-between items-center p-4 sm:p-6">
          <Link
            href="/"
            className="px-4 py-2 bg-cope-orange bg-opacity-20 hover:bg-opacity-30 text-cope-orange font-semibold rounded-lg transition border border-cope-orange border-opacity-40"
          >
            Home
          </Link>
          <div className="text-right text-sm text-gray-400">
            Launching on <span className="text-cope-orange font-semibold">18 Dec 2025</span>
          </div>
        </div>

        <div className="px-4 sm:px-10 pb-10 flex flex-col lg:flex-row gap-8 lg:items-center">
          <div className="flex-1">
            <img
              src="/images/copeleaderboard-officially-closed.jpg"
              alt="COPE leaderboard is officially closed"
              className="w-full h-auto rounded-2xl border border-cope-orange border-opacity-30 shadow-[0_0_25px_rgba(255,122,0,0.25)] object-contain bg-black"
            />
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <p className="text-cope-orange font-semibold text-sm mb-2">Status</p>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight">Whitelist Closed</h1>
              <p className="text-gray-300 mt-3 text-lg">
                Thanks for the massive turnout. The whitelist is officially closed. Get ready for launch!
              </p>
            </div>

            <div className="bg-black bg-opacity-40 border border-cope-orange border-opacity-30 rounded-2xl p-5">
              <p className="text-sm text-gray-400 mb-2">Countdown to launch</p>
              <div className="text-3xl sm:text-4xl font-black text-cope-orange">{timeLeft}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

