'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, 
  Search, 
  Play, 
  Pause, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Rocket
} from 'lucide-react'

interface Opportunity {
  id: string
  title: string
  category: string
  confidence: number
  estimatedRevenue: number
  estimatedCost: number
  risk: 'low' | 'medium' | 'high'
  status: 'discovered' | 'simulated' | 'launched' | 'completed'
  discoveredAt: string
}

interface Venture {
  id: string
  title: string
  strategy: string
  status: 'active' | 'paused' | 'completed' | 'failed'
  budget: number
  spent: number
  revenue: number
  roi: number
  launchedAt: string
  ai_notes?: string
  milestones?: {
    id: string
    title: string
    description: string
    cost: number
    status: string
  }[]
}

export default function AutonomyPage() {
  const [mode, setMode] = useState<'observe' | 'auto'>('observe')
  const [isScanning, setIsScanning] = useState(false)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [ventures, setVentures] = useState<Venture[]>([])
  const [budget, setBudget] = useState({
    total: 1000,
    spent: 0,
    remaining: 1000
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load opportunities
      const oppsResponse = await fetch('/api/opportunities')
      if (oppsResponse.ok) {
        const oppsData = await oppsResponse.json()
        if (oppsData.success && oppsData.data) {
          // Map API response to component state format
          const mappedOpportunities = oppsData.data.map((opp: any) => ({
            id: opp.id,
            title: opp.title,
            category: opp.category,
            confidence: opp.confidence || 0.5,
            estimatedRevenue: opp.potential_revenue || 0,
            estimatedCost: opp.estimated_cost || 0,
            risk: 'low' as const,
            status: opp.status || 'discovered',
            discoveredAt: opp.discovered_at || new Date().toISOString()
          }))
          setOpportunities(mappedOpportunities)
        }
      }

      // Load ventures
      const venturesResponse = await fetch('/api/ventures')
      if (venturesResponse.ok) {
        const venturesData = await venturesResponse.json()
        if (venturesData.success && venturesData.data) {
          // Map API response to component state format
          const mappedVentures = venturesData.data.map((venture: any) => ({
            id: venture.id,
            title: venture.name,
            strategy: venture.category,
            status: venture.status,
            budget: venture.budget || 0,
            spent: venture.spent || 0,
            revenue: venture.revenue || 0,
            roi: venture.revenue > 0 && venture.spent > 0 ? (venture.revenue / venture.spent) : 0,
            launchedAt: venture.created_at || new Date().toISOString(),
            ai_notes: venture.ai_notes,
            milestones: venture.milestones
          }))
          setVentures(mappedVentures)
        }
      }

      // Load budget
      const budgetResponse = await fetch('/api/autonomy/budget')
      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json()
        if (budgetData.success && budgetData.data) {
          // Map API response to component state format
          const totalBudget = Object.values(budgetData.data.categories).reduce((sum: number, cat: any) => sum + cat.budget, 0)
          setBudget({
            total: totalBudget,
            spent: budgetData.data.total_spent || 0,
            remaining: budgetData.data.budget_remaining || totalBudget
          })
        }
      }
    } catch (error) {
      console.error('Error loading autonomy data:', error)
      // Load sample data
      loadSampleData()
    }
  }

  const loadSampleData = () => {
    setOpportunities([
      {
        id: '1',
        title: 'Web Hosting Affiliate Guide',
        category: 'pseo_affiliate',
        confidence: 0.78,
        estimatedRevenue: 450,
        estimatedCost: 50,
        risk: 'low',
        status: 'discovered',
        discoveredAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Email Marketing Tools Comparison',
        category: 'pseo_affiliate',
        confidence: 0.72,
        estimatedRevenue: 380,
        estimatedCost: 50,
        risk: 'low',
        status: 'discovered',
        discoveredAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Etsy Template Collection',
        category: 'etsy_templates',
        confidence: 0.65,
        estimatedRevenue: 600,
        estimatedCost: 25,
        risk: 'low',
        status: 'simulated',
        discoveredAt: new Date().toISOString()
      }
    ])

    setVentures([
      {
        id: '1',
        title: 'Design Tools Guide',
        strategy: 'pseo_affiliate',
        status: 'active',
        budget: 50,
        spent: 25,
        revenue: 120,
        roi: 3.8,
        launchedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        ai_notes: 'This venture was generated by the AI with a focus on SEO and affiliate marketing.',
        milestones: [
          { id: '1', title: 'Website Setup', description: 'Created a basic website structure for the affiliate campaign.', cost: 100, status: 'completed' },
          { id: '2', title: 'Content Creation', description: 'Generated 5 high-quality blog posts on SEO and affiliate marketing.', cost: 50, status: 'completed' },
          { id: '3', title: 'Social Media Presence', description: 'Established a presence on Twitter and LinkedIn for content distribution.', cost: 20, status: 'completed' },
          { id: '4', title: 'Email List Building', description: 'Collected 100 email subscribers for future marketing efforts.', cost: 10, status: 'completed' },
          { id: '5', title: 'Keyword Research', description: 'Performed keyword research for targeted traffic.', cost: 15, status: 'completed' },
        ]
      }
    ])
  }

  const startScanning = async () => {
    setIsScanning(true)
    try {
      const response = await fetch('/api/opportunities/scan', {
        method: 'POST'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setOpportunities(prev => [...prev, ...data.data])
        }
      }
    } catch (error) {
      console.error('Error starting scan:', error)
    } finally {
      setIsScanning(false)
    }
  }

  const launchVenture = async (opportunity: Opportunity) => {
    try {
      const response = await fetch('/api/ventures/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          opportunityId: opportunity.id,
          mode: mode 
        }),
      })
      
      if (response.ok) {
        const ventureData = await response.json()
        if (ventureData.success && ventureData.data) {
          // Add the new venture to the list
          setVentures(prev => [...prev, ventureData.data])
          
          // Update the opportunity status
          setOpportunities(prev => prev.map(opp => 
            opp.id === opportunity.id ? { ...opp, status: 'launched' } : opp
          ))
          
          // Show success message
          alert(`Venture ${mode === 'observe' ? 'planned' : 'launched'} successfully by AI!`)
        }
      } else {
        const errorData = await response.json()
        alert(`Failed to launch venture: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Error launching venture:', error)
      alert('Failed to launch venture. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400'
      case 'paused': return 'text-yellow-600 dark:text-yellow-400'
      case 'completed': return 'text-blue-600 dark:text-blue-400'
      case 'failed': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'high': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Autonomy Engine
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          AI-powered opportunity discovery and automated business ventures.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Control Panel
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Mode:</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'observe' | 'auto')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="observe">Observe Only</option>
                <option value="auto">Auto-Launch</option>
              </select>
            </div>
            <button
              onClick={startScanning}
              disabled={isScanning}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isScanning ? <Pause className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              <span>{isScanning ? 'Scanning...' : 'Scan Opportunities'}</span>
            </button>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Budget</div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  ${(budget.total || 0).toLocaleString()}
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 dark:text-green-400">Spent</div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  ${(budget.spent || 0).toLocaleString()}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Remaining</div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  ${(budget.remaining || 0).toLocaleString()}
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Discovered Opportunities
          </h2>
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {opportunity.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    opportunity.risk === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    opportunity.risk === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {opportunity.risk.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Category: {opportunity.category.replace('_', ' ').toUpperCase()}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Confidence</div>
                                      <div className="font-medium text-gray-900 dark:text-white">
                    {((opportunity.confidence || 0) * 100).toFixed(0)}%
                  </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Est. Revenue</div>
                                      <div className="font-medium text-green-600 dark:text-green-400">
                    ${opportunity.estimatedRevenue || 0}
                  </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Est. Cost</div>
                                      <div className="font-medium text-red-600 dark:text-red-400">
                    ${opportunity.estimatedCost || 0}
                  </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Discovered {new Date(opportunity.discoveredAt).toLocaleDateString()}
                  </div>
                  {opportunity.status === 'discovered' && (
                    <button
                      onClick={() => launchVenture(opportunity)}
                      disabled={mode === 'observe'}
                      className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Rocket className="h-3 w-3" />
                      <span>{mode === 'observe' ? 'Observe' : 'Launch'}</span>
                    </button>
                  )}
                  {opportunity.status === 'launched' && (
                    <span className="text-green-600 dark:text-green-400 text-sm">
                      ✓ Launched
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Ventures */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Active Ventures
          </h2>
          <div className="space-y-4">
            {ventures.map((venture) => (
              <div
                key={venture.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {venture.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    venture.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    venture.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    venture.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {venture.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Strategy: {venture.strategy?.replace('_', ' ').toUpperCase() || 'GENERAL'}
                </div>
                
                {venture.ai_notes && (
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
                    <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">AI Analysis:</div>
                    <div className="whitespace-pre-line text-xs">{venture.ai_notes}</div>
                  </div>
                )}
                
                {venture.milestones && venture.milestones.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Milestones:</div>
                    <div className="space-y-2">
                      {venture.milestones.slice(0, 2).map((milestone) => (
                        <div key={milestone.id} className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <div className="font-medium text-gray-800 dark:text-gray-200">{milestone.title}</div>
                          <div className="text-gray-600 dark:text-gray-400">{milestone.description}</div>
                          <div className="flex justify-between text-gray-500 dark:text-gray-500 mt-1">
                            <span>${milestone.cost}</span>
                            <span>{milestone.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                      ))}
                      {venture.milestones.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          +{venture.milestones.length - 2} more milestones
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Budget</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      ${venture.budget || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Spent</div>
                    <div className="font-medium text-red-600 dark:text-red-400">
                      ${venture.spent || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Revenue</div>
                    <div className="font-medium text-green-600 dark:text-green-400">
                      ${venture.revenue || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">ROI</div>
                    <div className="font-medium text-blue-600 dark:text-blue-400">
                      {venture.roi ? venture.roi.toFixed(1) : '0.0'}x
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Launched {venture.launchedAt ? new Date(venture.launchedAt).toLocaleDateString() : 'Recently'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mode Warning */}
      {mode === 'observe' && (
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-yellow-800 dark:text-yellow-200 font-medium">
              Observe Mode Active
            </span>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 mt-2">
            You're currently in observe mode. Opportunities will be discovered and simulated, but no ventures will be automatically launched. 
            Switch to auto mode to enable automatic venture launching within budget constraints.
          </p>
        </div>
      )}
    </div>
  )
} 