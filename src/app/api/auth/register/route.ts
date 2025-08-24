import { NextRequest, NextResponse } from 'next/server'
import { UserStorage } from '@/lib/userStorage'

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  company?: string
  phone?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { firstName, lastName, email, password, company, phone } = body

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({
        error: 'First name, last name, email, and password are required'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Invalid email format'
      }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({
        error: 'Password must be at least 6 characters long'
      }, { status: 400 })
    }

    // Initialize user storage
    const userStorage = UserStorage.getInstance()
    await userStorage.initialize()

    // Check if user already exists
    const existingUser = await userStorage.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({
        error: 'User with this email already exists'
      }, { status: 409 })
    }

    // Create user
    const user = await userStorage.createUser({
      firstName,
      lastName,
      email,
      password,
      company,
      phone,
      isVerified: false // Users need to verify email in production
    })

    // Send verification email (simulated for demo)
    await sendVerificationEmail(email, user.id)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          isVerified: user.isVerified
        },
        message: 'User registered successfully. Please check your email for verification.'
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      error: 'Failed to register user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function sendVerificationEmail(email: string, userId: string): Promise<void> {
  // Simulated email sending
  // In production, this would use a service like Resend, SendGrid, etc.
  console.log(`Verification email sent to ${email} for user ${userId}`)
  console.log(`Verification link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify?token=${userId}`)
} 