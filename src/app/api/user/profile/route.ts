import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { UserStorage } from '@/lib/userStorage'

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  phone?: string
  isVerified: boolean
  createdAt: string
  lastLogin?: string
  subscription?: {
    plan: string
    status: string
    expiresAt?: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        error: 'Authorization header required'
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as any

    if (!decoded || !decoded.userId) {
      return NextResponse.json({
        error: 'Invalid token'
      }, { status: 401 })
    }

    // Initialize user storage
    const userStorage = UserStorage.getInstance()
    await userStorage.initialize()

    // Get user profile
    const user = await userStorage.getUserByEmail(decoded.email)
    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 })
    }

    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      phone: user.phone,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      subscription: user.subscription
    }

    return NextResponse.json({
      success: true,
      data: profile
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({
      error: 'Failed to fetch profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        error: 'Authorization header required'
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as any

    if (!decoded || !decoded.userId) {
      return NextResponse.json({
        error: 'Invalid token'
      }, { status: 401 })
    }

    const body = await request.json()
    const updates = body

    // Validate updates
    const allowedFields = ['firstName', 'lastName', 'company', 'phone']
    const validUpdates: Partial<UserProfile> = {}
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        validUpdates[field as keyof UserProfile] = updates[field]
      }
    }

    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json({
        error: 'No valid fields to update'
      }, { status: 400 })
    }

    // Initialize user storage
    const userStorage = UserStorage.getInstance()
    await userStorage.initialize()

    // Update user profile
    const updatedUser = await userStorage.updateUser(decoded.userId, validUpdates)
    if (!updatedUser) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 })
    }

    const profile: UserProfile = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      company: updatedUser.company,
      phone: updatedUser.phone,
      isVerified: updatedUser.isVerified,
      createdAt: updatedUser.createdAt,
      lastLogin: updatedUser.lastLogin,
      subscription: updatedUser.subscription
    }

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({
      error: 'Failed to update profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 