import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { UserStorage } from '@/lib/userStorage'

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, { status: 400 })
    }

    // Initialize user storage
    const userStorage = UserStorage.getInstance()
    await userStorage.initialize()

    // Get user by email
    const user = await userStorage.getUserByEmail(email.toLowerCase())
    if (!user) {
      return NextResponse.json({
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json({
        error: 'Please verify your email before logging in'
      }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await userStorage.verifyPassword(email, password)
    if (!isValidPassword) {
      return NextResponse.json({
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    // Update last login
    await userStorage.updateUser(user.id, { lastLogin: new Date().toISOString() })

    // Generate JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          isVerified: user.isVerified,
          subscription: user.subscription
        },
        token,
        message: 'Login successful'
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      error: 'Failed to login',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 