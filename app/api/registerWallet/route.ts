import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByWallet, getUserByReferralCode } from '@/lib/supabase-storage'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, referralCode } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Validate EVM address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid BNB Chain wallet address' },
        { status: 400 }
      )
    }

    // Check if wallet already exists
    const existingUser = await getUserByWallet(walletAddress)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Wallet already registered', user: existingUser },
        { status: 400 }
      )
    }

    // Check for referral code
    let referredBy: string | null = null
    if (referralCode) {
      const referrer = await getUserByReferralCode(referralCode)
      if (referrer) {
        referredBy = referrer.id
      }
    }

    // Create new user
    const user = await createUser(walletAddress, referredBy)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

