import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return sample ventures for now
    const ventures = [
      {
        id: 'venture_001',
        name: 'AI Content Marketing Blog',
        category: 'pseo_affiliate',
        status: 'active',
        budget: 300,
        spent: 75,
        revenue: 150,
        created_at: new Date().toISOString(),
        description: 'Content marketing blog focused on AI tools and strategies'
      },
      {
        id: 'venture_002',
        name: 'Etsy Template Store',
        category: 'etsy_templates',
        status: 'planning',
        budget: 200,
        spent: 0,
        revenue: 0,
        created_at: new Date().toISOString(),
        description: 'Digital templates for Etsy sellers'
      }
    ]

    return NextResponse.json({ success: true, data: ventures })
  } catch (error) {
    console.error('Error fetching ventures:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch ventures' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, ventureData } = body

    if (action === 'launch') {
      // Simulate launching a new venture
      const newVenture = {
        id: `venture_${Date.now()}`,
        name: ventureData.name || 'New Venture',
        category: ventureData.category || 'pseo_affiliate',
        status: 'active',
        budget: ventureData.budget || 200,
        spent: 0,
        revenue: 0,
        created_at: new Date().toISOString(),
        description: ventureData.description || 'New business venture'
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Venture launched successfully', 
        data: newVenture 
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error launching venture:', error)
    return NextResponse.json({ success: false, error: 'Failed to launch venture' }, { status: 500 })
  }
}
