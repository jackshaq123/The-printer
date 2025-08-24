import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyLength: process.env.STRIPE_SECRET_KEY?.length || 0,
      stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'none',
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('STRIPE') || key.includes('OPENAI'))
    }
  })
} 