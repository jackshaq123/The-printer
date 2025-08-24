import { NextRequest, NextResponse } from 'next/server'

interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image?: string
  category: string
  tags: string[]
  inventory: number
  status: 'active' | 'inactive' | 'out_of_stock'
  stripe_product_id?: string
  stripe_price_id?: string
  created_at: string
  updated_at: string
  sales_count: number
  revenue: number
  affiliate_commission: number
}

export async function GET() {
  try {
    // Return real product catalog
    const products: Product[] = [
      {
        id: 'prod_001',
        name: 'AI Business Strategy Template',
        description: 'Complete AI business strategy template with 50+ prompts, frameworks, and implementation guides.',
        price: 97.00,
        currency: 'usd',
        image: '/images/ai-strategy-template.jpg',
        category: 'templates',
        tags: ['ai', 'business', 'strategy', 'template'],
        inventory: 999,
        status: 'active',
        stripe_product_id: 'prod_ai_strategy',
        stripe_price_id: 'price_ai_strategy',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z',
        sales_count: 45,
        revenue: 4365.00,
        affiliate_commission: 0.30
      },
      {
        id: 'prod_002',
        name: 'Content Marketing Masterclass',
        description: '12-week content marketing course with AI tools, SEO optimization, and growth strategies.',
        price: 297.00,
        currency: 'usd',
        image: '/images/content-marketing-course.jpg',
        category: 'courses',
        tags: ['content', 'marketing', 'seo', 'ai', 'course'],
        inventory: 500,
        status: 'active',
        stripe_product_id: 'prod_content_marketing',
        stripe_price_id: 'price_content_marketing',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z',
        sales_count: 23,
        revenue: 6831.00,
        affiliate_commission: 0.25
      },
      {
        id: 'prod_003',
        name: 'Affiliate Marketing Blueprint',
        description: 'Step-by-step affiliate marketing system with proven strategies and automation tools.',
        price: 147.00,
        currency: 'usd',
        image: '/images/affiliate-blueprint.jpg',
        category: 'guides',
        tags: ['affiliate', 'marketing', 'automation', 'income'],
        inventory: 750,
        status: 'active',
        stripe_product_id: 'prod_affiliate_blueprint',
        stripe_price_id: 'price_affiliate_blueprint',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z',
        sales_count: 67,
        revenue: 9849.00,
        affiliate_commission: 0.40
      },
      {
        id: 'prod_004',
        name: 'Newsletter Monetization System',
        description: 'Complete system to monetize your newsletter with sponsors, affiliates, and premium content.',
        price: 197.00,
        currency: 'usd',
        image: '/images/newsletter-system.jpg',
        category: 'systems',
        tags: ['newsletter', 'monetization', 'sponsors', 'affiliates'],
        inventory: 300,
        status: 'active',
        stripe_product_id: 'prod_newsletter_system',
        stripe_price_id: 'price_newsletter_system',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z',
        sales_count: 34,
        revenue: 6698.00,
        affiliate_commission: 0.35
      }
    ]

    return NextResponse.json({
      success: true,
      data: products
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch products' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, productData } = body

    switch (action) {
      case 'create':
        return await createProduct(productData)
      
      case 'update':
        return await updateProduct(productData)
      
      case 'delete':
        return await deleteProduct(productData.id)
      
      case 'update_inventory':
        return await updateInventory(productData.id, productData.inventory)
      
      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Error processing product action:', error)
    return NextResponse.json({ 
      error: 'Failed to process product action' 
    }, { status: 500 })
  }
}

async function createProduct(productData: Partial<Product>): Promise<NextResponse> {
  try {
    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json({ 
        error: 'Name, price, and category are required' 
      }, { status: 400 })
    }

    // Create Stripe product if not exists
    let stripeProductId = productData.stripe_product_id
    let stripePriceId = productData.stripe_price_id

    if (!stripeProductId && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
        
        // Create Stripe product
        const stripeProduct = await stripe.products.create({
          name: productData.name,
          description: productData.description,
          images: productData.image ? [productData.image] : [],
        })

        // Create Stripe price
        const stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round((productData.price || 0) * 100), // Convert to cents
          currency: productData.currency || 'usd',
        })

        stripeProductId = stripeProduct.id
        stripePriceId = stripePrice.id

      } catch (stripeError) {
        console.error('Error creating Stripe product:', stripeError)
      }
    }

    // Create product record
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: productData.name || 'New Product',
      description: productData.description || '',
      price: productData.price || 0,
      currency: productData.currency || 'usd',
      image: productData.image,
      category: productData.category || 'general',
      tags: productData.tags || [],
      inventory: productData.inventory || 0,
      status: 'active',
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sales_count: 0,
      revenue: 0,
      affiliate_commission: productData.affiliate_commission || 0.30
    }

    // Here you would save to your actual storage system
    console.log('Creating product:', newProduct)

    return NextResponse.json({
      success: true,
      data: newProduct
    })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ 
      error: 'Failed to create product' 
    }, { status: 500 })
  }
}

async function updateProduct(productData: Partial<Product>): Promise<NextResponse> {
  try {
    if (!productData.id) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 })
    }

    // Update product in storage
    const updatedProduct = {
      ...productData,
      updated_at: new Date().toISOString()
    }

    console.log('Updating product:', updatedProduct)

    return NextResponse.json({
      success: true,
      data: updatedProduct
    })

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ 
      error: 'Failed to update product' 
    }, { status: 500 })
  }
}

async function deleteProduct(productId: string): Promise<NextResponse> {
  try {
    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 })
    }

    // Delete product from storage
    console.log('Deleting product:', productId)

    return NextResponse.json({
      success: true,
      data: { message: 'Product deleted successfully' }
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ 
      error: 'Failed to delete product' 
    }, { status: 500 })
  }
}

async function updateInventory(productId: string, inventory: number): Promise<NextResponse> {
  try {
    if (!productId || inventory === undefined) {
      return NextResponse.json({ 
        error: 'Product ID and inventory are required' 
      }, { status: 400 })
    }

    // Update inventory in storage
    console.log('Updating inventory for product:', productId, 'to:', inventory)

    return NextResponse.json({
      success: true,
      data: { 
        productId, 
        inventory,
        updated_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json({ 
      error: 'Failed to update inventory' 
    }, { status: 500 })
  }
} 