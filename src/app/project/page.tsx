'use client'

import { useState, useEffect } from 'react'
import { Save, FileText, Users, Target, Zap, TrendingUp } from 'lucide-react'

interface ProjectBrief {
  audience: string
  tone: string
  offers: string
  competitors: string
  phrases: string
  businessName: string
  industry: string
  goals: string
  challenges: string
}

export default function ProjectPage() {
  const [projectBrief, setProjectBrief] = useState<ProjectBrief>({
    audience: '',
    tone: '',
    offers: '',
    competitors: '',
    phrases: '',
    businessName: '',
    industry: '',
    goals: '',
    challenges: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    // Load saved project brief from localStorage
    const saved = localStorage.getItem('projectBrief')
    if (saved) {
      try {
        setProjectBrief(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading project brief:', error)
      }
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Save to localStorage
      localStorage.setItem('projectBrief', JSON.stringify(projectBrief))
      
      // Save to API (optional)
      await fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectBrief),
      })
      
      setLastSaved(new Date())
      
      // Show success message
      setTimeout(() => setLastSaved(null), 3000)
    } catch (error) {
      console.error('Error saving project brief:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof ProjectBrief, value: string) => {
    setProjectBrief(prev => ({ ...prev, [field]: value }))
  }

  const sections = [
    {
      title: 'Business Overview',
      icon: FileText,
      fields: [
        {
          key: 'businessName' as keyof ProjectBrief,
          label: 'Business Name',
          placeholder: 'Enter your business name...',
          type: 'text'
        },
        {
          key: 'industry' as keyof ProjectBrief,
          label: 'Industry',
          placeholder: 'e.g., E-commerce, Consulting, SaaS...',
          type: 'text'
        },
        {
          key: 'goals' as keyof ProjectBrief,
          label: 'Business Goals',
          placeholder: 'What are your main business objectives?',
          type: 'textarea'
        },
        {
          key: 'challenges' as keyof ProjectBrief,
          label: 'Current Challenges',
          placeholder: 'What challenges are you facing?',
          type: 'textarea'
        }
      ]
    },
    {
      title: 'Target Audience',
      icon: Users,
      fields: [
        {
          key: 'audience' as keyof ProjectBrief,
          label: 'Target Audience',
          placeholder: 'Describe your ideal customer in detail...',
          type: 'textarea'
        }
      ]
    },
    {
      title: 'Brand & Messaging',
      icon: Target,
      fields: [
        {
          key: 'tone' as keyof ProjectBrief,
          label: 'Brand Tone & Style',
          placeholder: 'Professional, casual, friendly, authoritative...',
          type: 'textarea'
        },
        {
          key: 'phrases' as keyof ProjectBrief,
          label: 'Key Phrases & Keywords',
          placeholder: 'Important terms, slogans, or keywords...',
          type: 'textarea'
        }
      ]
    },
    {
      title: 'Products & Competition',
      icon: TrendingUp,
      fields: [
        {
          key: 'offers' as keyof ProjectBrief,
          label: 'Products/Services',
          placeholder: 'What do you offer? Describe your main products or services...',
          type: 'textarea'
        },
        {
          key: 'competitors' as keyof ProjectBrief,
          label: 'Competitors',
          placeholder: 'Who are your main competitors? What makes you different?',
          type: 'textarea'
        }
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Project Brief
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Define your business context to get more personalized AI assistance and content recommendations.
        </p>
      </div>

      {/* Save Status */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
          {lastSaved && (
            <span className="text-sm text-green-600 dark:text-green-400">
              ✓ Saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Project Brief Form */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <section.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            
            <div className="grid gap-6">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={projectBrief[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      rows={4}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={projectBrief[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          💡 Tips for Better AI Assistance
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
          <li>• Be specific about your target audience - include demographics, pain points, and motivations</li>
          <li>• Describe your unique value proposition and what makes you different from competitors</li>
          <li>• Use consistent terminology and brand voice throughout your brief</li>
          <li>• Update this brief regularly as your business evolves</li>
          <li>• The more detailed your brief, the more personalized your AI assistance will be</li>
        </ul>
      </div>
    </div>
  )
} 