'use client'

import { useState, useEffect } from 'react'

interface MandatoryTasksModalProps {
  isOpen: boolean
  onComplete: () => void
}

export default function MandatoryTasksModal({ isOpen, onComplete }: MandatoryTasksModalProps) {
  const [followComplete, setFollowComplete] = useState(false)
  const [joinComplete, setJoinComplete] = useState(false)
  const [verifyingX, setVerifyingX] = useState(false)
  const [verifyingTG, setVerifyingTG] = useState(false)
  const [xError, setXError] = useState('')
  const [tgError, setTgError] = useState('')

  // Check if tasks were already verified
  useEffect(() => {
    if (isOpen) {
      const xVerified = localStorage.getItem('cope_x_verified') === 'true'
      const tgVerified = localStorage.getItem('cope_tg_verified') === 'true'
      setFollowComplete(xVerified)
      setJoinComplete(tgVerified)
    }
  }, [isOpen])

  const handleXClick = () => {
    window.open('https://x.com/COPE_on_BNB', '_blank', 'noopener,noreferrer')
    setVerifyingX(true)
    setXError('')

    setTimeout(() => {
      localStorage.setItem('cope_x_verified', 'true')
      localStorage.setItem('cope_x_verified_time', new Date().toISOString())
      setFollowComplete(true)
      setVerifyingX(false)
    }, 15000)
  }

  const handleTGClick = () => {
    window.open('https://t.me/COPEonBNB', '_blank', 'noopener,noreferrer')
    setVerifyingTG(true)
    setTgError('')

    setTimeout(() => {
      localStorage.setItem('cope_tg_verified', 'true')
      localStorage.setItem('cope_tg_verified_time', new Date().toISOString())
      setJoinComplete(true)
      setVerifyingTG(false)
    }, 15000)
  }

  const handleVerify = () => {
    if (followComplete && joinComplete) {
      localStorage.setItem('cope_tasks_completed', 'true')
      onComplete()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_20px_rgba(255,122,0,0.15)]">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cope-orange to-cope-orange-light bg-clip-text text-transparent">
          Complete the COPE Rituals
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Complete the COPE rituals to enter the Whitelist.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 bg-black bg-opacity-50 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3 flex-1">
              <a
                href="https://x.com/COPE_on_BNB"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault()
                  handleXClick()
                }}
                className="px-6 py-2 bg-gradient-to-r from-cope-orange to-cope-orange-light text-white font-semibold rounded-lg hover:opacity-90 transition"
              >
                {verifyingX ? 'Verifying...' : 'Follow COPE on X'}
              </a>
            </div>
            {followComplete && (
              <span className="text-green-400 text-xl">✓</span>
            )}
          </div>
          {xError && (
            <p className="text-red-400 text-sm mt-1">{xError}</p>
          )}

          <div className="flex items-center justify-between p-4 bg-black bg-opacity-50 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3 flex-1">
              <a
                href="https://t.me/COPEonBNB"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault()
                  handleTGClick()
                }}
                className="px-6 py-2 bg-gradient-to-r from-cope-orange to-cope-orange-light text-white font-semibold rounded-lg hover:opacity-90 transition"
              >
                {verifyingTG ? 'Verifying...' : 'Join COPE Community'}
              </a>
            </div>
            {joinComplete && (
              <span className="text-green-400 text-xl">✓</span>
            )}
          </div>
          {tgError && (
            <p className="text-red-400 text-sm mt-1">{tgError}</p>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={!followComplete || !joinComplete}
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${
            followComplete && joinComplete
              ? 'bg-gradient-to-r from-cope-orange to-cope-orange-light text-white hover:opacity-90'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          Verify Completion
        </button>
      </div>
    </div>
  )
}
