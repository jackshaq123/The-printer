'use client'

import { useState } from 'react'
import { BookOpen, Search, Filter, ArrowRight } from 'lucide-react'

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const guides = [
    {
      id: 'guide_001',
      title: 'AI Content Marketing Strategy',
      description: 'Learn how to leverage AI tools for content creation and marketing automation',
      category: 'marketing',
      readTime: '8 min read',
      difficulty: 'Intermediate',
      tags: ['AI', 'Content Marketing', 'Automation']
    },
    {
      id: 'guide_002',
      title: 'Business Model Canvas',
      description: 'Create a comprehensive business model using the proven canvas framework',
      category: 'strategy',
      readTime: '12 min read',
      difficulty: 'Beginner',
      tags: ['Business Model', 'Strategy', 'Planning']
    },
    {
      id: 'guide_003',
      title: 'SEO for Startups',
      description: 'Essential SEO strategies to get your startup found online',
      category: 'seo',
      readTime: '15 min read',
      difficulty: 'Beginner',
      tags: ['SEO', 'Startup', 'Digital Marketing']
    },
    {
      id: 'guide_004',
      title: 'Social Media Growth',
      description: 'Build your brand presence across all major social platforms',
      category: 'social',
      readTime: '10 min read',
      difficulty: 'Intermediate',
      tags: ['Social Media', 'Branding', 'Growth']
    }
  ]

  const categories = [
    { id: 'all', name: 'All Guides', count: guides.length },
    { id: 'marketing', name: 'Marketing', count: guides.filter(g => g.category === 'marketing').length },
    { id: 'strategy', name: 'Strategy', count: guides.filter(g => g.category === 'strategy').length },
    { id: 'seo', name: 'SEO', count: guides.filter(g => g.category === 'seo').length },
    { id: 'social', name: 'Social Media', count: guides.filter(g => g.category === 'social').length }
  ]

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Guides</h1>
              <p className="text-gray-600 dark:text-gray-400">Expert insights to grow your business</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    guide.category === 'marketing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    guide.category === 'strategy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    guide.category === 'seo' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  }`}>
                    {guide.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{guide.readTime}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {guide.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {guide.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    guide.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    guide.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {guide.difficulty}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {guide.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  <span>Read Guide</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No guides found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
