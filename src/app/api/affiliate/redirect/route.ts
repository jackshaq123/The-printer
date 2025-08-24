import { NextRequest, NextResponse } from 'next/server'

interface AffiliateRedirect {
  affiliateId: string
  productUrl: string
  trackingCode: string
  commission: number
  clickId: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const affiliateId = searchParams.get('aff')
    const productUrl = searchParams.get('url')
    const trackingCode = searchParams.get('code')

    if (!affiliateId || !productUrl) {
      return NextResponse.json({ 
        error: 'Missing affiliate ID or product URL' 
      }, { status: 400 })
    }

    // Generate unique click ID
    const clickId = `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Get affiliate details
    const affiliateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/affiliates/${affiliateId}`)
    let affiliate = null
    
    if (affiliateResponse.ok) {
      affiliate = await affiliateResponse.json()
    }

    // Create affiliate redirect record
    const redirectRecord: AffiliateRedirect = {
      affiliateId,
      productUrl: decodeURIComponent(productUrl),
      trackingCode: trackingCode || 'default',
      commission: affiliate?.commission_rate || 0.05, // Default 5% commission
      clickId,
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      referrer: request.headers.get('referer') || undefined,
    }

    // Log the click to affiliate tracking system
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/affiliate/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(redirectRecord),
      })
    } catch (error) {
      console.error('Failed to log affiliate click:', error)
    }

    // Add affiliate disclosure and tracking to the redirect URL
    const redirectUrl = new URL(decodeURIComponent(productUrl))
    
    // Add affiliate tracking parameters
    redirectUrl.searchParams.set('aff', affiliateId)
    redirectUrl.searchParams.set('click_id', clickId)
    redirectUrl.searchParams.set('tracking_code', trackingCode || 'default')
    
    // Add timestamp for conversion tracking
    redirectUrl.searchParams.set('click_time', Date.now().toString())

    // Redirect to affiliate product with tracking
    return NextResponse.redirect(redirectUrl.toString())

  } catch (error) {
    console.error('Affiliate redirect error:', error)
    return NextResponse.json({ 
      error: 'Failed to process affiliate redirect' 
    }, { status: 500 })
  }
} 