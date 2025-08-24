import { NextRequest, NextResponse } from 'next/server'

interface NewsletterSubscription {
  id: string
  email: string
  name: string
  preferences: string[]
  status: 'active' | 'unsubscribed' | 'bounced'
  subscribed_at: string
  last_email_sent?: string
  sponsor_emails_received: number
  total_revenue_generated: number
}

interface NewsletterRequest {
  email: string
  name: string
  preferences: string[]
  action?: 'subscribe' | 'unsubscribe' | 'update_preferences'
}

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterRequest = await request.json()
    const { email, name, preferences, action = 'subscribe' } = body

    if (!email || !name) {
      return NextResponse.json({ 
        error: 'Email and name are required' 
      }, { status: 400 })
    }

    switch (action) {
      case 'subscribe':
        return await subscribeToNewsletter(email, name, preferences)
      
      case 'unsubscribe':
        return await unsubscribeFromNewsletter(email)
      
      case 'update_preferences':
        return await updateNewsletterPreferences(email, preferences)
      
      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json({ 
      error: 'Failed to process newsletter request' 
    }, { status: 500 })
  }
}

async function subscribeToNewsletter(email: string, name: string, preferences: string[]): Promise<NextResponse> {
  try {
    // Check if already subscribed
    const existingSubscriber = await getSubscriber(email)
    if (existingSubscriber) {
      return NextResponse.json({
        success: false,
        error: 'Email already subscribed'
      }, { status: 409 })
    }

    // Create new subscription
    const subscription: NewsletterSubscription = {
      id: `sub_${Date.now()}`,
      email,
      name,
      preferences: preferences || ['general'],
      status: 'active',
      subscribed_at: new Date().toISOString(),
      sponsor_emails_received: 0,
      total_revenue_generated: 0
    }

    // Save subscription to storage
    await saveSubscription(subscription)

    // Send welcome email
    await sendWelcomeEmail(email, name, preferences)

    // Check for immediate sponsor opportunities
    const sponsorRevenue = await checkSponsorOpportunities(email, preferences)

    return NextResponse.json({
      success: true,
      data: {
        subscription,
        sponsorRevenue,
        message: 'Successfully subscribed to newsletter'
      }
    })

  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json({ 
      error: 'Failed to subscribe' 
    }, { status: 500 })
  }
}

async function unsubscribeFromNewsletter(email: string): Promise<NextResponse> {
  try {
    const subscriber = await getSubscriber(email)
    if (!subscriber) {
      return NextResponse.json({
        success: false,
        error: 'Email not found'
      }, { status: 404 })
    }

    // Update status to unsubscribed
    subscriber.status = 'unsubscribed'
    await saveSubscription(subscriber)

    // Send unsubscribe confirmation
    await sendUnsubscribeEmail(email, subscriber.name)

    return NextResponse.json({
      success: true,
      data: {
        message: 'Successfully unsubscribed from newsletter'
      }
    })

  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return NextResponse.json({ 
      error: 'Failed to unsubscribe' 
    }, { status: 500 })
  }
}

async function updateNewsletterPreferences(email: string, preferences: string[]): Promise<NextResponse> {
  try {
    const subscriber = await getSubscriber(email)
    if (!subscriber) {
      return NextResponse.json({
        success: false,
        error: 'Email not found'
      }, { status: 404 })
    }

    // Update preferences
    subscriber.preferences = preferences
    await saveSubscription(subscriber)

    return NextResponse.json({
      success: true,
      data: {
        message: 'Preferences updated successfully',
        preferences
      }
    })

  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json({ 
      error: 'Failed to update preferences' 
    }, { status: 500 })
  }
}

async function checkSponsorOpportunities(email: string, preferences: string[]): Promise<number> {
  try {
    // Get available sponsors based on preferences
    const sponsorsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/sponsors`)
    if (!sponsorsResponse.ok) {
      return 0
    }

    const sponsorsData = await sponsorsResponse.json()
    const relevantSponsors = sponsorsData.data?.filter((sponsor: any) => 
      sponsor.status === 'active' && 
      sponsor.target_audience.some((audience: string) => preferences.includes(audience))
    ) || []

    let totalRevenue = 0

    // Check for immediate sponsor email opportunities
    for (const sponsor of relevantSponsors) {
      if (sponsor.immediate_opportunity && Math.random() > 0.7) { // 30% chance
        const revenue = await sendSponsorEmail(email, sponsor)
        totalRevenue += revenue
      }
    }

    return totalRevenue

  } catch (error) {
    console.error('Error checking sponsor opportunities:', error)
    return 0
  }
}

async function sendWelcomeEmail(email: string, name: string, preferences: string[]): Promise<void> {
  try {
    // Here you would integrate with a real email service like Resend, SendGrid, etc.
    console.log(`Sending welcome email to ${email} for ${name}`)
    
    // For now, simulate email sending
    await new Promise(resolve => setTimeout(resolve, 100))
    
  } catch (error) {
    console.error('Error sending welcome email:', error)
  }
}

async function sendUnsubscribeEmail(email: string, name: string): Promise<void> {
  try {
    console.log(`Sending unsubscribe confirmation to ${email} for ${name}`)
    await new Promise(resolve => setTimeout(resolve, 100))
  } catch (error) {
    console.error('Error sending unsubscribe email:', error)
  }
}

async function sendSponsorEmail(email: string, sponsor: any): Promise<number> {
  try {
    console.log(`Sending sponsor email from ${sponsor.name} to ${email}`)
    
    // Simulate email sending and revenue generation
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Calculate revenue based on sponsor's rate and subscriber value
    const baseRate = sponsor.email_rate || 0.05 // $0.05 per email
    const subscriberValue = sponsor.subscriber_value || 1.0
    const revenue = baseRate * subscriberValue
    
    return revenue
    
  } catch (error) {
    console.error('Error sending sponsor email:', error)
    return 0
  }
}

async function getSubscriber(email: string): Promise<NewsletterSubscription | null> {
  // Here you would fetch from your actual storage system
  // For now, return null to simulate new subscription
  return null
}

async function saveSubscription(subscription: NewsletterSubscription): Promise<void> {
  // Here you would save to your actual storage system
  // For now, just log it
  console.log('Saving subscription:', subscription)
}
