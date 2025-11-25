import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  walletAddress: string
  referralCode: string
  referredBy: string | null
  referralCount: number
  createdAt: string
}

export interface Referral {
  id: string
  referrerId: string
  referredUserId: string
  timestamp: string
}

const STORAGE_KEY_USERS = 'cope_users'
const STORAGE_KEY_REFERRALS = 'cope_referrals'

export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY_USERS)
  return data ? JSON.parse(data) : []
}

export function saveUser(user: User): void {
  if (typeof window === 'undefined') return
  const users = getAllUsers()
  const existingIndex = users.findIndex(u => u.id === user.id)
  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users))
}

export function getUserById(id: string): User | null {
  const users = getAllUsers()
  return users.find(u => u.id === id) || null
}

export function getUserByWallet(walletAddress: string): User | null {
  const users = getAllUsers()
  return users.find(u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase()) || null
}

export function getUserByReferralCode(code: string): User | null {
  const users = getAllUsers()
  return users.find(u => u.referralCode === code) || null
}

export function createUser(walletAddress: string, referredBy: string | null = null): User {
  const referralCode = uuidv4().substring(0, 8).toUpperCase()
  
  const user: User = {
    id: uuidv4(),
    walletAddress: walletAddress.toLowerCase(),
    referralCode,
    referredBy,
    referralCount: 0,
    createdAt: new Date().toISOString(),
  }

  saveUser(user)

  // If referred, update referrer's count
  if (referredBy) {
    const referrer = getUserById(referredBy)
    if (referrer) {
      referrer.referralCount++
      saveUser(referrer)
      
      // Save referral record
      saveReferral({
        id: uuidv4(),
        referrerId: referredBy,
        referredUserId: user.id,
        timestamp: new Date().toISOString(),
      })
    }
  }

  return user
}

export function getAllReferrals(): Referral[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY_REFERRALS)
  return data ? JSON.parse(data) : []
}

export function saveReferral(referral: Referral): void {
  if (typeof window === 'undefined') return
  const referrals = getAllReferrals()
  referrals.push(referral)
  localStorage.setItem(STORAGE_KEY_REFERRALS, JSON.stringify(referrals))
}

export function getRank(referralCount: number): string {
  if (referralCount === 0) return 'Tourist'
  if (referralCount >= 1 && referralCount <= 3) return 'Survivor'
  if (referralCount >= 4 && referralCount <= 10) return 'Pain Holder'
  if (referralCount >= 11 && referralCount <= 25) return 'Cope Lord'
  return 'Peak Cope'
}

export function getLeaderboard(limit: number = 100): User[] {
  const users = getAllUsers()
  return users
    .sort((a, b) => b.referralCount - a.referralCount)
    .slice(0, limit)
}

