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
      // Normalize referral code to uppercase (codes are stored in uppercase)
      const normalizedCode = referralCode.trim().toUpperCase()
      console.log(`Looking up referral code: "${normalizedCode}"`)
      const referrer = await getUserByReferralCode(normalizedCode)
      if (referrer) {
        referredBy = referrer.id
        console.log(`✓ Referral code found! User ${walletAddress} will be referred by ${referrer.id} (${referrer.walletAddress})`)
      } else {
        console.warn(`✗ Referral code "${normalizedCode}" not found in database`)
      }
    } else {
      console.log('No referral code provided')
    }

    // Create new user
    console.log(`Creating user with wallet: ${walletAddress}, referredBy: ${referredBy || 'none'}`)
    const user = await createUser(walletAddress, referredBy)

    return NextResponse.json({ 
      user,
      referralInfo: {
        hadReferralCode: !!referralCode,
        referrerFound: !!referredBy,
        referredBy: referredBy || null
      }
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

