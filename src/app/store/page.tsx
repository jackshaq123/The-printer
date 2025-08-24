'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Check, Star, ArrowRight, CreditCard } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  features: string[]
  billing_cycle?: string
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/store/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data)
      } else {
        // Fallback to local data
        const localProducts = [
          {
            id: 'pro-pack',
            name: 'Pro Pack',
            description: 'Complete business toolkit with templates, guides, and premium support',
            price: 997,
            currency: 'usd',
            features: [
              '50+ Business Templates',
              'Premium AI Prompts',
              '1-on-1 Strategy Session',
              'Lifetime Updates',
              'Priority Support'
            ],

          },
          {
            id: 'monthly-subscription',
            name: 'Monthly Subscription',
            description: 'Ongoing business support and fresh content monthly',
            price: 97,
            currency: 'usd',
            billing_cycle: 'monthly',
            features: [
              'Monthly Content Calendar',
              'Weekly Strategy Calls',
              'Market Research Reports',
              'Community Access',
              'Cancel Anytime'
            ]
          },
          {
            id: 'quarterly-plan',
            name: 'Quarterly Plan',
            description: 'Strategic business planning and execution support',
            price: 247,
            currency: 'usd',
            billing_cycle: 'quarterly',
            features: [
              'Quarterly Strategy Review',
              'Goal Setting & Tracking',
              'Performance Analytics',
              'Custom Templates',
              'Email Support'
            ]
          }
        ]
        setProducts(localProducts)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (product: Product) => {
    setSelectedProduct(product)
    setShowCheckout(true)
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Business Tools & Services
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose the perfect plan to accelerate your business growth with AI-powered tools and expert support.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {product.description}
              </p>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.billing_cycle && (
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /{product.billing_cycle}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(product)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Get Started</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Complete Purchase
            </h3>
            
            <div className="mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedProduct.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {selectedProduct.description}
                </p>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(selectedProduct.price, selectedProduct.currency)}
                  {selectedProduct.billing_cycle && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      /{selectedProduct.billing_cycle}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={async () => {
                  // Create PayPal order
                  try {
                    const response = await fetch('/api/paypal/checkout', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        productId: selectedProduct.id,
                        quantity: 1
                      })
                    })
                    
                    if (response.ok) {
                      const data = await response.json()
                      if (data.success && data.data.approvalUrl) {
                        window.location.href = data.data.approvalUrl
                      } else {
                        alert('Failed to create PayPal order')
                      }
                    } else {
                      alert('Failed to create PayPal order')
                    }
                  } catch (error) {
                    console.error('Checkout error:', error)
                    alert('Failed to create PayPal order')
                  }
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Pay with PayPal</span>
              </button>
              
              <button
                onClick={() => setShowCheckout(false)}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Why Choose THE PRINTER?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Proven Results
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join thousands of entrepreneurs who have grown their businesses with our tools.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Expert Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get help from business experts and AI assistance whenever you need it.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Continuous Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access to the latest business tools, templates, and strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 