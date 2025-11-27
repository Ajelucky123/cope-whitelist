'use client'

import { useState } from 'react'

interface WalletEntryProps {
  onWalletSubmitted: (address: string) => void
}

export default function WalletEntry({ onWalletSubmitted }: WalletEntryProps) {
  const [walletAddress, setWalletAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEVMAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!walletAddress.trim()) {
      setError('Please enter your wallet address')
      return
    }

    if (!validateEVMAddress(walletAddress)) {
      setError('Invalid EVM wallet address. Must start with 0x and be 42 characters long.')
      return
    }

    setLoading(true)

    try {
      // Get referral code from localStorage if exists
      const referralCode = localStorage.getItem('cope_referral_code')
      
      const response = await fetch('/api/registerWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          walletAddress,
          referralCode: referralCode || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register wallet')
      }

      localStorage.setItem('cope_wallet_address', walletAddress)
      onWalletSubmitted(walletAddress)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_20px_rgba(255,122,0,0.15)]">
      <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-cope-orange to-cope-orange-light bg-clip-text text-transparent">
        Enter Your EVM Wallet
      </h2>
      <p className="text-gray-400 text-center mb-6">
        Enter your EVM/BNB wallet address to join the COPE PAIN Whitelist. No rewards. No tokens. No bribes. This is pure identity.
      </p>
      <div className="bg-black bg-opacity-40 border border-gray-800 rounded-xl p-4 text-sm text-gray-400 mb-6 leading-relaxed">
        <p>Your wallet address is used only to identify you. COPE never asks for private keys.</p>
        <p className="mt-2 text-gray-500">If someone does — they’re coping harder than you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cope-orange focus:border-opacity-40 focus:ring-2 focus:ring-cope-orange focus:ring-opacity-20"
          />
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${
            loading
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cope-orange to-cope-orange-light text-white hover:opacity-90'
          }`}
        >
          {loading ? 'Registering...' : 'Register Wallet'}
        </button>
      </form>
    </div>
  )
}

