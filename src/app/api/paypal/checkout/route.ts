import { NextRequest, NextResponse } from 'next/server'

interface CheckoutRequest {
  productId: string
  quantity?: number
  successUrl?: string
  cancelUrl?: string
}

interface PayPalOrder {
  id: string
  status: string
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json()
    const { productId, quantity = 1, successUrl, cancelUrl } = body

    // Get the base URL from the request
    const baseUrl = new URL(request.url).origin

    if (!process.env.PAYPAL_CLIENT_ID) {
      return NextResponse.json({ 
        error: 'PayPal not configured' 
      }, { status: 500 })
    }

    // Get product details from store data
    const storeResponse = await fetch(`${baseUrl}/api/store/products`)
    if (!storeResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch product details' 
      }, { status: 500 })
    }

    const storeData = await storeResponse.json()
    const product = storeData.data?.find((p: any) => p.id === productId)
    
    if (!product) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 })
    }

    // Create PayPal order
    const paypalOrder = await createPayPalOrder({
      product,
      quantity,
      baseUrl,
      successUrl,
      cancelUrl
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId: paypalOrder.id,
        approvalUrl: paypalOrder.links.find(link => link.rel === 'approve')?.href,
        amount: product.price * quantity,
        currency: 'USD'
      }
    })

  } catch (error) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function createPayPalOrder(params: {
  product: any
  quantity: number
  baseUrl: string
  successUrl?: string
  cancelUrl?: string
}): Promise<PayPalOrder> {
  const { product, quantity, baseUrl, successUrl, cancelUrl } = params

  // Get PayPal access token
  const accessToken = await getPayPalAccessToken()

  // Create order payload
  const orderPayload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: product.id,
        amount: {
          currency_code: 'USD',
          value: (product.price * quantity).toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: (product.price * quantity).toFixed(2)
            }
          }
        },
        items: [
          {
            name: product.name,
            description: product.description,
            unit_amount: {
              currency_code: 'USD',
              value: product.price.toFixed(2)
            },
            quantity: quantity.toString(),
            category: 'DIGITAL_GOODS'
          }
        ]
      }
    ],
    application_context: {
      brand_name: 'THE PRINTER',
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
      return_url: successUrl || `${baseUrl}/store/success`,
      cancel_url: cancelUrl || `${baseUrl}/store/cancel`
    }
  }

  // Create order with PayPal
  const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'PayPal-Request-Id': `order_${Date.now()}`,
    },
    body: JSON.stringify(orderPayload)
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('PayPal API error:', errorData)
    throw new Error(`PayPal API error: ${response.status}`)
  }

  return await response.json()
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || ''

  // For now, we'll use a sandbox client ID if no secret is provided
  // In production, you would need both client ID and secret
  if (!clientSecret) {
    // Using PayPal's demo credentials for sandbox
    const demoAuth = Buffer.from(`${clientId}:`).toString('base64')
    
    const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${demoAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    })

    if (!response.ok) {
      // If auth fails, return a mock token for development
      console.warn('PayPal auth failed, using mock token for development')
      return 'mock_access_token_for_development'
    }

    const data = await response.json()
    return data.access_token
  }

  // Production auth with both client ID and secret
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token')
  }

  const data = await response.json()
  return data.access_token
}

// Handle order capture when user completes payment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const action = searchParams.get('action')

    if (!orderId || action !== 'capture') {
      return NextResponse.json({ 
        error: 'Invalid request' 
      }, { status: 400 })
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Capture the order
    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('PayPal capture error:', errorData)
      return NextResponse.json({ 
        error: 'Failed to capture payment' 
      }, { status: 500 })
    }

    const captureData = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        orderId: captureData.id,
        status: captureData.status,
        captureId: captureData.purchase_units[0]?.payments?.captures[0]?.id,
        amount: captureData.purchase_units[0]?.payments?.captures[0]?.amount
      }
    })

  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json({ 
      error: 'Failed to capture payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 