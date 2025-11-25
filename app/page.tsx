'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MandatoryTasksModal from '@/components/MandatoryTasksModal'
import WalletEntry from '@/components/WalletEntry'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showTasksModal, setShowTasksModal] = useState(false)
  const [tasksCompleted, setTasksCompleted] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const checkUserStatus = async () => {
      // Check if user has completed tasks
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-2xl text-center">
        <header className="mb-8">
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
            Complete the COPE rituals to enter the Whitelist
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

