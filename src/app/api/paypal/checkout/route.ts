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

    // Check PayPal configuration
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({ 
        error: 'PayPal not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.' 
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

  // Determine PayPal environment
  const paypalMode = process.env.PAYPAL_MODE || 'sandbox'
  const paypalBaseUrl = paypalMode === 'live' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com'

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
            quantity: quantity.toString(),
            unit_amount: {
              currency_code: 'USD',
              value: product.price.toFixed(2)
            },
            category: 'DIGITAL_GOODS'
          }
        ]
      }
    ],
    application_context: {
      return_url: successUrl || `${baseUrl}/store/success`,
      cancel_url: cancelUrl || `${baseUrl}/store/cancel`,
      brand_name: 'THE PRINTER',
      landing_page: 'LOGIN',
      user_action: 'PAY_NOW',
      shipping_preference: 'NO_SHIPPING'
    }
  }

  // Create PayPal order
  const orderResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(orderPayload)
  })

  if (!orderResponse.ok) {
    const errorData = await orderResponse.json()
    console.error('PayPal order creation error:', errorData)
    throw new Error(`PayPal order creation failed: ${errorData.error_description || 'Unknown error'}`)
  }

  const orderData = await orderResponse.json()
  return orderData
}

async function getPayPalAccessToken(): Promise<string> {
  const paypalMode = process.env.PAYPAL_MODE || 'sandbox'
  const paypalBaseUrl = paypalMode === 'live' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com'

  const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  if (!authResponse.ok) {
    const errorData = await authResponse.json()
    console.error('PayPal authentication error:', errorData)
    throw new Error(`PayPal authentication failed: ${errorData.error_description || 'Unknown error'}`)
  }

  const authData = await authResponse.json()
  return authData.access_token
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const payerId = searchParams.get('PayerID')

    if (!token) {
      return NextResponse.json({ error: 'Missing order token' }, { status: 400 })
    }

    // Capture the PayPal order
    const paypalMode = process.env.PAYPAL_MODE || 'sandbox'
    const paypalBaseUrl = paypalMode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com'

    const accessToken = await getPayPalAccessToken()
    
    const captureResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${token}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    })

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json()
      console.error('PayPal capture error:', errorData)
      return NextResponse.json({ 
        error: 'Failed to capture payment',
        details: errorData.error_description || 'Unknown error'
      }, { status: 500 })
    }

    const captureData = await captureResponse.json()
    
    // Here you would typically:
    // 1. Update your database with the successful payment
    // 2. Send confirmation emails
    // 3. Grant access to purchased products
    // 4. Log the transaction

    return NextResponse.json({
      success: true,
      data: {
        orderId: captureData.id,
        status: captureData.status,
        captureId: captureData.purchase_units[0]?.payments?.captures?.[0]?.id,
        amount: captureData.purchase_units[0]?.amount?.value,
        currency: captureData.purchase_units[0]?.amount?.currency_code
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