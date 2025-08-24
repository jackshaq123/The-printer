import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const budgetData = {
      current_month: new Date().toISOString().slice(0, 7),
      total_spent: 0,
      budget_remaining: 1000,
      ventures: [],
      categories: {
        pseo_affiliate: { spent: 0, budget: 300, ventures: 0 },
        etsy_templates: { spent: 0, budget: 200, ventures: 0 },
        dropship_printful: { spent: 0, budget: 300, ventures: 0 },
        stock_momentum: { spent: 0, budget: 200, ventures: 0 }
      },
      transactions: [],
      last_updated: new Date().toISOString()
    }
    return NextResponse.json({ success: true, data: budgetData })
  } catch (error) {
    console.error('Error fetching budget:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch budget data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, amount, category, description } = body
    return NextResponse.json({
      success: true,
      message: 'Budget update simulated successfully (file writing disabled)',
      data: { action, amount, category, description }
    })
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json({ success: false, error: 'Failed to update budget' }, { status: 500 })
  }
}
