import { promises as fs } from 'fs'
import path from 'path'
import { hash, compare } from 'bcryptjs'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  phone?: string
  hashedPassword: string
  isVerified: boolean
  createdAt: string
  lastLogin?: string
  subscription?: {
    plan: string
    status: string
    expiresAt?: string
  }
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

export class UserStorage {
  private static instance: UserStorage
  private users: Map<string, User> = new Map()

  private constructor() {}

  static getInstance(): UserStorage {
    if (!UserStorage.instance) {
      UserStorage.instance = new UserStorage()
    }
    return UserStorage.instance
  }

  async initialize(): Promise<void> {
    try {
      await this.loadUsers()
    } catch (error) {
      console.log('No existing users file found, starting with empty storage')
      this.users.clear()
    }
  }

  private async loadUsers(): Promise<void> {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8')
      const usersArray: User[] = JSON.parse(data)
      this.users.clear()
      usersArray.forEach(user => {
        this.users.set(user.email.toLowerCase(), user)
      })
    } catch (error) {
      console.log('Error loading users:', error)
      this.users.clear()
    }
  }

  private async saveUsers(): Promise<void> {
    try {
      const usersArray = Array.from(this.users.values())
      const dataDir = path.dirname(USERS_FILE)
      await fs.mkdir(dataDir, { recursive: true })
      await fs.writeFile(USERS_FILE, JSON.stringify(usersArray, null, 2))
    } catch (error) {
      console.error('Error saving users:', error)
      throw error
    }
  }

  async createUser(userData: Omit<User, 'id' | 'hashedPassword' | 'createdAt'> & { password: string }): Promise<User> {
    const existingUser = this.users.get(userData.email.toLowerCase())
    if (existingUser) {
      throw new Error('User already exists')
    }

    const salt = await hash('', 10) // Generate salt
    const hashedPassword = await hash(userData.password, salt)
    
    // Destructure to remove password and create user object
    const { password, ...userDataWithoutPassword } = userData
    
    const user: User = {
      ...userDataWithoutPassword,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hashedPassword,
      createdAt: new Date().toISOString()
    }

    this.users.set(user.email.toLowerCase(), user)
    await this.saveUsers()
    return user
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.get(email.toLowerCase()) || null
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.getUserByEmail(email)
    if (!user) return false
    
    return compare(password, user.hashedPassword)
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.id === userId)
    if (!user) return null

    const updatedUser = { ...user, ...updates }
    this.users.set(user.email.toLowerCase(), updatedUser)
    await this.saveUsers()
    return updatedUser
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
  }
} 