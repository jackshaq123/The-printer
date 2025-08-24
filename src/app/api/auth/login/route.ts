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

    // Check JWT secret configuration
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable not configured')
      return NextResponse.json({ 
        error: 'Authentication service not configured. Please contact support.' 
      }, { status: 500 })
    }

    // Initialize user storage
    const userStorage = UserStorage.getInstance()
    await userStorage.initialize()

    // Get user by email
    const user = await userStorage.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
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
        error: 'Invalid email or password' 
      }, { status: 401 })
    }

    // Update last login
    await userStorage.updateUser(user.id, {
      lastLogin: new Date().toISOString()
    })

    // Generate JWT token
    const token = sign(
      { 
        userId: user.id, 
        email: user.email,
        isAdmin: user.email === 'admin@theprinter.com' // Simple admin check
      },
      jwtSecret,
      { expiresIn: '7d' }
    )

    // Return user data and token
    return NextResponse.json({
      success: true,
      data: {
        user: {
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
        },
        token,
        expiresIn: '7d'
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 