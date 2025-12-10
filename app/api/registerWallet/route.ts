import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByWallet, getUserByReferralCode, isSupabaseConfigured } from '@/lib/supabase-storage'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, referralCode } = await request.json()

    // Fail fast if Supabase is not configured to avoid silent filesystem fallback
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' },
        { status: 500 }
      )
    }

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
    let referralFound = false
    if (referralCode) {
      // Normalize referral code to uppercase (codes are stored in uppercase)
      const normalizedCode = referralCode.trim().toUpperCase()
      console.log(`Looking up referral code: "${normalizedCode}"`)
      const referrer = await getUserByReferralCode(normalizedCode)
      if (referrer) {
        referredBy = referrer.id
        referralFound = true
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

    // Verify referral was created if referredBy was provided
    let referralCreated = false
    let referralError = null
    if (referredBy) {
      try {
        const { getSupabaseClient } = await import('@/lib/supabase')
        const supabase = getSupabaseClient()
        const { data: referrals, error: refCheckError } = await supabase
          .from('referrals')
          .select('id')
          .eq('referrer_id', referredBy)
          .eq('referred_user_id', user.id)
        
        if (refCheckError) {
          referralError = {
            code: refCheckError.code,
            message: refCheckError.message
          }
        } else {
          referralCreated = (referrals?.length || 0) > 0
        }
      } catch (err: any) {
        referralError = {
          message: err.message
        }
      }
    }

    return NextResponse.json({ 
      user,
      referralInfo: {
        hadReferralCode: !!referralCode,
        referralCodeProvided: referralCode || null,
        referrerFound: referralFound,
        referredBy: referredBy || null,
        referralCreated,
        referralError
      }
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

