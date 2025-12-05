'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import MandatoryTasksModal from '@/components/MandatoryTasksModal'
import WalletEntry from '@/components/WalletEntry'

export default function Whitelist() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading COPE rites...
        </div>
      }
    >
      <WhitelistContent />
    </Suspense>
  )
}

function WhitelistContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showTasksModal, setShowTasksModal] = useState(false)
  const [tasksCompleted, setTasksCompleted] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [hasEnteredWhitelist, setHasEnteredWhitelist] = useState(false)

  useEffect(() => {
    const checkUserStatus = async () => {
      const tasksDone = localStorage.getItem('cope_tasks_completed') === 'true'
      setTasksCompleted(tasksDone)

      // Check if user has wallet registered
      const storedWallet = localStorage.getItem('cope_wallet_address')
      if (storedWallet) {
        try {
          const response = await fetch(`/api/getUser?walletAddress=${encodeURIComponent(storedWallet)}`)
          if (response.ok) {
            router.push('/dashboard')
            return
          }
        } catch (error) {
          console.error('Error checking user:', error)
        }
      }

      // Check for referral code
      const refCode = searchParams.get('ref')
      if (refCode) {
        localStorage.setItem('cope_referral_code', refCode)
      }

      // Show tasks modal if not completed
      if (!tasksDone) {
        setShowTasksModal(true)
      }
    }

    const enteredBefore = localStorage.getItem('cope_entered_whitelist') === 'true'
    const tasksDoneStored = localStorage.getItem('cope_tasks_completed') === 'true'
    if (enteredBefore || tasksDoneStored) {
      setHasEnteredWhitelist(true)
    }

    checkUserStatus()
  }, [router, searchParams])

  const handleTasksComplete = () => {
    setTasksCompleted(true)
    setShowTasksModal(false)
  }

  const handleWalletSubmitted = (address: string) => {
    setWalletAddress(address)
    router.push('/dashboard')
  }

  const handleEnterWhitelist = () => {
    setHasEnteredWhitelist(true)
    localStorage.setItem('cope_entered_whitelist', 'true')
  }

  if (!hasEnteredWhitelist) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center relative z-10">
        <div className="max-w-3xl w-full bg-black bg-opacity-40 border border-cope-orange border-opacity-40 rounded-3xl p-10 shadow-[0_0_40px_rgba(255,122,0,0.25)] backdrop-blur">
          <div className="flex justify-end mb-4">
            <Link
              href="/"
              className="px-4 py-2 bg-cope-orange bg-opacity-20 hover:bg-opacity-30 text-cope-orange font-semibold rounded-lg transition border border-cope-orange border-opacity-40"
            >
              Home
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            Welcome to COPE.
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed whitespace-pre-line mb-8">
            {`The movement for everyone who has suffered in crypto… and stayed.\n\nJoin the COPE PAIN Whitelist.\n\nNo airdrops. No promises. No roadmap.\n\nJust vibes, trauma, and a community of resilient degenerates.`}
          </p>
          <button
            onClick={handleEnterWhitelist}
            className="px-8 py-3 bg-gradient-to-r from-cope-orange to-cope-orange-light text-black font-bold rounded-2xl hover:opacity-90 transition text-lg"
          >
            Enter Whitelist
          </button>
          <div className="mt-8 text-sm text-gray-400 leading-relaxed whitespace-pre-line">
            {`COPE is a social experiment built on the Binance Smart Chain.\n\nIf you've ever lost money, got rugged, held the top, froze an account,\nor believed "this time is different"…\nyou belong here.`}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-2xl text-center">
        <header className="mb-8">
          <div className="flex justify-end mb-4">
            <Link
              href="/"
              className="px-4 py-2 bg-cope-orange bg-opacity-20 hover:bg-opacity-30 text-cope-orange font-semibold rounded-lg transition border border-cope-orange border-opacity-40"
            >
              Home
            </Link>
          </div>
          <div className="mb-6 flex justify-center">
            <img 
              src="/images/image.png" 
              alt="COPE Logo" 
              className="max-w-[150px] h-auto filter drop-shadow-[0_0_5px_rgba(255,122,0,0.2)]"
            />
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cope-orange to-cope-orange-light bg-clip-text text-transparent">
            COPE PAIN Whitelist
          </h1>
          <p className="text-gray-400 text-lg">
            COPE is a movement where people embrace the pain of being in crypto.
          </p>
        </header>

        {!tasksCompleted && (
          <MandatoryTasksModal 
            isOpen={showTasksModal}
            onComplete={handleTasksComplete}
          />
        )}

        {tasksCompleted && !walletAddress && (
          <WalletEntry onWalletSubmitted={handleWalletSubmitted} />
        )}
      </div>
    </div>
  )
}

