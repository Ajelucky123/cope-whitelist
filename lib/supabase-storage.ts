import { getSupabaseClient } from './supabase'
import type { User, Referral } from './storage'

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && url.trim() !== '' && key.trim() !== '')
}

// Map database row to User interface
function mapUser(row: any): User {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    referralCode: row.referral_code,
    referredBy: row.referred_by,
    referralCount: row.referral_count,
    createdAt: row.created_at,
  }
}

// Map User interface to database row
function mapUserToRow(user: User): any {
  return {
    id: user.id,
    wallet_address: user.walletAddress,
    referral_code: user.referralCode,
    referred_by: user.referredBy,
    referral_count: user.referralCount,
    created_at: user.createdAt,
  }
}

// Map database row to Referral interface
function mapReferral(row: any): Referral {
  return {
    id: row.id,
    referrerId: row.referrer_id,
    referredUserId: row.referred_user_id,
    timestamp: row.timestamp,
  }
}

// Get all users
export async function getAllUsers(): Promise<User[]> {
  if (!isSupabaseConfigured()) {
    // Fallback to file storage
    const { getAllUsers: getAllUsersFile } = await import('./server-storage')
    return getAllUsersFile()
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return []
    }

    return (data || []).map(mapUser)
  } catch (error) {
    console.error('Supabase error, falling back to file storage:', error)
    const { getAllUsers: getAllUsersFile } = await import('./server-storage')
    return getAllUsersFile()
  }
}

// Save user
export async function saveUser(user: User): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    // Fallback to file storage
    const { saveUser: saveUserFile } = await import('./server-storage')
    saveUserFile(user)
    return user
  }

  try {
    const supabase = getSupabaseClient()
    const userRow = mapUserToRow(user)
    const { data, error } = await supabase
      .from('users')
      .upsert(userRow, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('Error saving user:', error)
      return null
    }

    return data ? mapUser(data) : null
  } catch (error) {
    console.error('Supabase error, falling back to file storage:', error)
    const { saveUser: saveUserFile } = await import('./server-storage')
    saveUserFile(user)
    return user
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    // Fallback to file storage
    const { getUserById: getUserByIdFile } = await import('./server-storage')
    return getUserByIdFile(id)
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching user:', error)
      return null
    }

    return data ? mapUser(data) : null
  } catch (error) {
    console.error('Supabase error, falling back to file storage:', error)
    const { getUserById: getUserByIdFile } = await import('./server-storage')
    return getUserByIdFile(id)
  }
}

// Get user by wallet address
export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    // Fallback to file storage
    const { getUserByWallet: getUserByWalletFile } = await import('./server-storage')
    return getUserByWalletFile(walletAddress)
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching user by wallet:', error)
      return null
    }

    return data ? mapUser(data) : null
  } catch (error) {
    console.error('Supabase error, falling back to file storage:', error)
    const { getUserByWallet: getUserByWalletFile } = await import('./server-storage')
    return getUserByWalletFile(walletAddress)
  }
}

// Get user by referral code
export async function getUserByReferralCode(code: string): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    // Fallback to file storage
    const { getUserByReferralCode: getUserByReferralCodeFile } = await import('./server-storage')
    return getUserByReferralCodeFile(code)
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('referral_code', code)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching user by referral code:', error)
      return null
    }

    return data ? mapUser(data) : null
  } catch (error) {
    console.error('Supabase error, falling back to file storage:', error)
    const { getUserByReferralCode: getUserByReferralCodeFile } = await import('./server-storage')
    return getUserByReferralCodeFile(code)
  }
}

// Create new user
export async function createUser(
  walletAddress: string,
  referredBy: string | null = null
): Promise<User> {
  if (!isSupabaseConfigured()) {
    // Fallback to file storage
    const { createUser: createUserFile } = await import('./server-storage')
    return createUserFile(walletAddress, referredBy)
  }

  try {
    const { v4: uuidv4 } = await import('uuid')
    const referralCode = uuidv4().substring(0, 8).toUpperCase()

    const newUser: User = {
      id: uuidv4(),
      walletAddress: walletAddress.toLowerCase(),
      referralCode,
      referredBy,
      referralCount: 0,
      createdAt: new Date().toISOString(),
    }

    // Save user
    const savedUser = await saveUser(newUser)
    if (!savedUser) {
      throw new Error('Failed to create user')
    }

    // If referred, update referrer's count
    if (referredBy) {
      const referrer = await getUserById(referredBy)
      if (referrer) {
        referrer.referralCount++
        await saveUser(referrer)

        // Save referral record
        const { v4: refUuidv4 } = await import('uuid')
        await saveReferral({
          id: refUuidv4(),
          referrerId: referredBy,
          referredUserId: newUser.id,
          timestamp: new Date().toISOString(),
        })
      }
    }

    return savedUser
  } catch (error) {
    console.error('Supabase error, falling back to file storage:', error)
    const { createUser: createUserFile } = await import('./server-storage')
    return createUserFile(walletAddress, referredBy)
  }
}

// Get all referrals
export async function getAllReferrals(): Promise<Referral[]> {
  if (!isSupabaseConfigured()) {
    // Fallback - referrals not stored in file storage
    return []
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching referrals:', error)
      return []
    }

    return (data || []).map(mapReferral)
  } catch (error) {
    console.error('Supabase error:', error)
    return []
  }
}

// Save referral
export async function saveReferral(referral: Referral): Promise<Referral | null> {
  if (!isSupabaseConfigured()) {
    // Fallback - referrals not stored in file storage, but that's okay
    return referral
  }

  try {
    const supabase = getSupabaseClient()
    const referralRow = {
      id: referral.id,
      referrer_id: referral.referrerId,
      referred_user_id: referral.referredUserId,
      timestamp: referral.timestamp,
    }

    const { data, error } = await supabase
      .from('referrals')
      .insert(referralRow)
      .select()
      .single()

    if (error) {
      console.error('Error saving referral:', error)
      return null
    }

    return data ? mapReferral(data) : null
  } catch (error) {
    console.error('Supabase error:', error)
    return referral
  }
}

// Get leaderboard
export async function getLeaderboard(limit: number = 100): Promise<User[]> {
  if (!isSupabaseConfigured()) {
    // Fallback to file storage
    const { getLeaderboard: getLeaderboardFile } = await import('./server-storage')
    return getLeaderboardFile(limit)
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('referral_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }

    return (data || []).map(mapUser)
  } catch (error) {
    console.error('Supabase error, falling back to file storage:', error)
    const { getLeaderboard: getLeaderboardFile } = await import('./server-storage')
    return getLeaderboardFile(limit)
  }
}

