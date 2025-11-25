import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import type { User, Referral } from './storage'

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const REFERRALS_FILE = path.join(DATA_DIR, 'referrals.json')

// Ensure data directory exists
if (typeof window === 'undefined' && !fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readUsers(): User[] {
  if (typeof window !== 'undefined') return []
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading users:', error)
  }
  return []
}

function writeUsers(users: User[]): void {
  if (typeof window !== 'undefined') return
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error writing users:', error)
  }
}

function readReferrals(): Referral[] {
  if (typeof window !== 'undefined') return []
  try {
    if (fs.existsSync(REFERRALS_FILE)) {
      const data = fs.readFileSync(REFERRALS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading referrals:', error)
  }
  return []
}

function writeReferrals(referrals: Referral[]): void {
  if (typeof window !== 'undefined') return
  try {
    fs.writeFileSync(REFERRALS_FILE, JSON.stringify(referrals, null, 2))
  } catch (error) {
    console.error('Error writing referrals:', error)
  }
}

export function getAllUsers(): User[] {
  return readUsers()
}

export function saveUser(user: User): void {
  const users = readUsers()
  const existingIndex = users.findIndex(u => u.id === user.id)
  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }
  writeUsers(users)
}

export function getUserById(id: string): User | null {
  const users = readUsers()
  return users.find(u => u.id === id) || null
}

export function getUserByWallet(walletAddress: string): User | null {
  const users = readUsers()
  return users.find(u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase()) || null
}

export function getUserByReferralCode(code: string): User | null {
  const users = readUsers()
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
      const referrals = readReferrals()
      referrals.push({
        id: uuidv4(),
        referrerId: referredBy,
        referredUserId: user.id,
        timestamp: new Date().toISOString(),
      })
      writeReferrals(referrals)
    }
  }

  return user
}

export function getLeaderboard(limit: number = 100): User[] {
  const users = readUsers()
  return users
    .sort((a, b) => b.referralCount - a.referralCount)
    .slice(0, limit)
}

