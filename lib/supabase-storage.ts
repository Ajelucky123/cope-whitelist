import { getSupabaseClient, getSupabaseAdminClient } from './supabase'
import type { User, Referral } from './storage'

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
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
    // Ensure we never surface undefined/null and coerce to a number
    referralCount: Number(row.referral_count ?? 0),
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
    // Use admin client for writes to bypass RLS
    const supabase = getSupabaseAdminClient()
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

    if (!data) return null

    // ALWAYS recalculate referral count from referrals table (source of truth)
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('id')
      .eq('referrer_id', data.id)

    const user = mapUser(data)
    
    // Update count from actual referrals - this is the accurate count
    if (!referralsError && referrals) {
      user.referralCount = referrals.length
      // Also update the database if count differs (in case trigger didn't fire)
      if (user.referralCount !== data.referral_count) {
        console.log(`Updating referral_count for ${user.id}: ${data.referral_count} -> ${user.referralCount}`)
        // Use admin client for writes to bypass RLS
        const supabaseAdmin = getSupabaseAdminClient()
        await supabaseAdmin
          .from('users')
          .update({ referral_count: user.referralCount })
          .eq('id', user.id)
      }
    }

    return user
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
    // Normalize code to uppercase for consistent lookup
    const normalizedCode = code.trim().toUpperCase()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('referral_code', normalizedCode)
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

    // If referred, save referral record
    // The database trigger will automatically update the referrer's count
    if (referredBy) {
      console.log(`\n=== REFERRAL PROCESSING START ===`)
      console.log(`New User ID: ${newUser.id}`)
      console.log(`Referrer ID: ${referredBy}`)
      
      try {
        // Verify referrer exists
        const referrer = await getUserById(referredBy)
        if (!referrer) {
          console.error(`ERROR: Referrer ${referredBy} not found in database!`)
        } else {
          console.log(`✓ Referrer verified: ${referrer.walletAddress} (current count: ${referrer.referralCount})`)
        }
        
        // Save referral record - database trigger will update count automatically
        const { v4: refUuidv4 } = await import('uuid')
        const referralToSave = {
          id: refUuidv4(),
          referrerId: referredBy,
          referredUserId: newUser.id,
          timestamp: new Date().toISOString(),
        }
        
        console.log('Attempting to save referral record:', JSON.stringify(referralToSave, null, 2))
        const referralSaved = await saveReferral(referralToSave)

        if (!referralSaved) {
          console.error('✗ FAILED to save referral record for referrer:', referredBy)
          console.error('This means the referral was NOT recorded in the database!')
          // Continue anyway - the leaderboard will recalculate from referrals table
        } else {
          console.log('✓ Referral record saved successfully! ID:', referralSaved.id)
          
          // Manually update the count as backup (in case trigger doesn't work)
          // Wait a bit for trigger to fire, then verify and update if needed
          console.log('Waiting 500ms for database trigger...')
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const supabase = getSupabaseClient()
          console.log('Verifying referral count...')
          const { data: referrals, error: countError } = await supabase
            .from('referrals')
            .select('id')
            .eq('referrer_id', referredBy)
          
          if (countError) {
            console.error('Error fetching referrals for count:', countError)
          } else {
            const actualCount = referrals?.length || 0
            console.log(`Found ${actualCount} total referrals for referrer ${referredBy}`)
            
            // Update the count directly - use admin client for writes to bypass RLS
            console.log(`Updating referral_count in users table to ${actualCount}...`)
            const supabaseAdmin = getSupabaseAdminClient()
            const { data: updateData, error: updateError } = await supabaseAdmin
              .from('users')
              .update({ referral_count: actualCount })
              .eq('id', referredBy)
              .select()
              .single()
            
            if (updateError) {
              console.error('✗ Error updating referral_count:', updateError)
              console.error('Error details:', JSON.stringify(updateError, null, 2))
            } else {
              console.log(`✓ Successfully updated referral_count for ${referredBy} to ${actualCount}`)
              if (updateData) {
                console.log(`Updated user data:`, { id: updateData.id, referral_count: updateData.referral_count })
              }
            }
          }
        }
        console.log(`=== REFERRAL PROCESSING END ===\n`)
      } catch (error: any) {
        console.error('✗ EXCEPTION in referral processing:', error)
        console.error('Stack:', error.stack)
        // Don't throw - user creation succeeded, referral update can be retried
      }
    } else {
      console.log('No referral code provided - user created without referrer')
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
    console.warn('⚠ Supabase not configured, skipping referral save')
    return referral
  }

  try {
    // Use admin client for writes to bypass RLS
    const supabase = getSupabaseAdminClient()
    const referralRow = {
      id: referral.id,
      referrer_id: referral.referrerId,
      referred_user_id: referral.referredUserId,
      timestamp: referral.timestamp,
    }

    console.log('📝 Inserting referral into database...')
    console.log('Referral data:', JSON.stringify(referralRow, null, 2))
    
    const { data, error } = await supabase
      .from('referrals')
      .insert(referralRow)
      .select()
      .single()

    if (error) {
      console.error('✗ ERROR saving referral to database!')
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', JSON.stringify(error, null, 2))
      console.error('Error hint:', error.hint)
      
      // Check for common errors
      if (error.code === '23505') {
        console.error('⚠ This referral already exists (unique constraint violation)')
      } else if (error.code === '23503') {
        console.error('⚠ Foreign key violation - referrer_id or referred_user_id does not exist')
      } else if (error.code === '42501') {
        console.error('⚠ Permission denied - check RLS policies')
      }
      
      return null
    }

    if (data) {
      const mapped = mapReferral(data)
      console.log('✓ Referral saved successfully!')
      console.log('Saved referral:', JSON.stringify(mapped, null, 2))
      return mapped
    }

    console.error('✗ No data returned from referral insert (but no error?)')
    return null
  } catch (error: any) {
    console.error('✗ EXCEPTION in saveReferral:')
    console.error('Error:', error)
    console.error('Message:', error?.message)
    console.error('Stack:', error?.stack)
    return null
  }
}

// Get leaderboard
export async function getLeaderboard(limit: number = 10000): Promise<User[]> {
  if (!isSupabaseConfigured()) {
    // Fallback to file storage
    const { getLeaderboard: getLeaderboardFile } = await import('./server-storage')
    return getLeaderboardFile(limit)
  }

  try {
    const supabase = getSupabaseClient()
    
    // Get all users with their actual referral counts calculated from referrals table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')

    if (usersError) {
      console.error('Error fetching users:', usersError)
      // Fall back to file storage so the leaderboard still works without Supabase
      const { getLeaderboard: getLeaderboardFile } = await import('./server-storage')
      return getLeaderboardFile(limit)
    }

    // Get all referrals to calculate accurate counts
    const { data: referralsData, error: referralsError } = await supabase
      .from('referrals')
      .select('referrer_id')

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError)
    }

    // Calculate referral counts from actual referrals
    const referralCounts: { [userId: string]: number } = {}
    if (referralsData) {
      referralsData.forEach((ref) => {
        const referrerId = ref.referrer_id
        referralCounts[referrerId] = (referralCounts[referrerId] || 0) + 1
      })
    }

    // Map users and update their referral counts
    const users = (usersData || []).map((row) => {
      const user = mapUser(row)
      // Use actual count from referrals table, fallback to stored count
      user.referralCount = referralCounts[user.id] ?? user.referralCount
      return user
    })

    // Return all users (no pre-sorting here - let the API route handle sorting with FCFS)
    // This ensures dynamic ranking based on current referral counts
    return users.slice(0, limit)
  } catch (error) {
    console.error('Supabase error, falling back to file storage:', error)
    const { getLeaderboard: getLeaderboardFile } = await import('./server-storage')
    return getLeaderboardFile(limit)
  }
}

