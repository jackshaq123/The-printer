import { NextRequest, NextResponse } from 'next/server'
import { UserStorage } from '@/lib/userStorage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({
        error: 'Verification token is required'
      }, { status: 400 })
    }

    // Initialize user storage
    const userStorage = UserStorage.getInstance()
    await userStorage.initialize()

    // Find user by ID (in a real app, this would be a proper verification token)
    const users = await userStorage.getAllUsers()
    const user = users.find(u => u.id === token)

    if (!user) {
      return NextResponse.json({
        error: 'Invalid verification token'
      }, { status: 400 })
    }

    // Update user to verified
    const updatedUser = await userStorage.updateUser(user.id, { isVerified: true })
    if (!updatedUser) {
      return NextResponse.json({
        error: 'Failed to verify user'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          isVerified: updatedUser.isVerified
        }
      }
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({
      error: 'Failed to verify email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 