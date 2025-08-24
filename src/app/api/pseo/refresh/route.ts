import { NextRequest, NextResponse } from 'next/server'

interface PSEOContent {
  id: string
  title: string
  slug: string
  content: string
  meta_description: string
  keywords: string[]
  category: string
  city?: string
  state?: string
  country: string
  created_at: string
  updated_at: string
  seo_score: number
  word_count: number
  affiliate_links: Array<{
    text: string
    url: string
    commission_rate: number
    product_category: string
  }>
  internal_links: string[]
  external_links: string[]
}

interface PSEORequest {
  action: 'generate' | 'refresh' | 'optimize'
  category?: string
  location?: string
  keywords?: string[]
  target_word_count?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: PSEORequest = await request.json()
    const { action, category, location, keywords, target_word_count = 1500 } = body

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured' 
      }, { status: 500 })
    }

    switch (action) {
      case 'generate':
        return await generatePSEOContent(category, location, keywords, target_word_count)
      
      case 'refresh':
        return await refreshExistingContent(category, location)
      
      case 'optimize':
        return await optimizeExistingContent(category, location, keywords)
      
      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('PSEO API error:', error)
    return NextResponse.json({ 
      error: 'Failed to process PSEO request' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return PSEO content overview
    const content = await getAllPSEOContent()
    
    return NextResponse.json({
      success: true,
      data: {
        content,
        total_pages: content.length,
        categories: [...new Set(content.map(c => c.category))],
        countries: [...new Set(content.map(c => c.country))],
        total_word_count: content.reduce((sum, c) => sum + c.word_count, 0),
        average_seo_score: content.reduce((sum, c) => sum + c.seo_score, 0) / content.length
      }
    })

  } catch (error) {
    console.error('Error fetching PSEO content:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch PSEO content' 
    }, { status: 500 })
  }
}

async function generatePSEOContent(category?: string, location?: string, keywords?: string[], target_word_count?: number): Promise<NextResponse> {
  try {
    const selectedCategory = category || 'business'
    const selectedLocation = location || 'United States'
    const selectedKeywords = keywords || ['business', 'growth', 'strategy']
    const wordCount = target_word_count || 1500

    // Generate AI-powered content
    const content = await generateAIContent(selectedCategory, selectedLocation, selectedKeywords, wordCount)
    
    // Optimize for SEO
    const optimizedContent = await optimizeForSEO(content, selectedKeywords)
    
    // Add affiliate links
    const contentWithAffiliates = await addAffiliateLinks(optimizedContent, selectedCategory)
    
    // Save content
    const savedContent = await savePSEOContent(contentWithAffiliates)
    
    // Generate sitemap entry
    await updateSitemap(savedContent)
    
    // Generate RSS feed entry
    await updateRSSFeed(savedContent)

    return NextResponse.json({
      success: true,
      data: {
        content: savedContent,
        seo_score: savedContent.seo_score,
        word_count: savedContent.word_count,
        affiliate_links: savedContent.affiliate_links.length,
        message: 'PSEO content generated successfully'
      }
    })

  } catch (error) {
    console.error('Error generating PSEO content:', error)
    return NextResponse.json({ 
      error: 'Failed to generate PSEO content' 
    }, { status: 500 })
  }
}

async function generateAIContent(category: string, location: string, keywords: string[], wordCount: number): Promise<Partial<PSEOContent>> {
  try {
    const prompt = `Create a comprehensive, SEO-optimized article about "${category}" in "${location}". 

Requirements:
- Target word count: ${wordCount} words
- Primary keywords: ${keywords.join(', ')}
- Include location-specific information and examples
- Write in a professional, engaging tone
- Include actionable tips and strategies
- Optimize for local SEO and search intent
- Include relevant statistics and data points

Structure:
1. Compelling headline with primary keyword
2. Introduction with hook and keyword usage
3. Main content with H2 and H3 headings
4. Local examples and case studies
5. Actionable takeaways
6. Conclusion with call-to-action

Make it valuable for readers searching for "${category}" information in "${location}".`

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO content writer specializing in local business content and PSEO (Parasitic SEO) strategies. Create high-quality, engaging content that ranks well in search engines.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.floor(wordCount * 1.5), // Allow for longer response
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error('Failed to generate AI content')
    }

    const openaiData = await openaiResponse.json()
    const aiContent = openaiData.choices[0]?.message?.content || ''

    // Parse the AI response and extract structured content
    const title = extractTitle(aiContent)
    const content = aiContent
    const metaDescription = generateMetaDescription(content, keywords)
    const slug = generateSlug(title, location)

    return {
      title,
      slug,
      content,
      meta_description: metaDescription,
      keywords,
      category,
      country: location,
      word_count: content.split(' ').length,
      seo_score: calculateSEOScore(content, keywords),
      affiliate_links: [],
      internal_links: [],
      external_links: []
    }

  } catch (error) {
    console.error('Error generating AI content:', error)
    throw error
  }
}

async function optimizeForSEO(content: Partial<PSEOContent>, keywords: string[]): Promise<Partial<PSEOContent>> {
  try {
    // Add semantic keywords
    const semanticKeywords = await generateSemanticKeywords(keywords)
    const optimizedKeywords = [...keywords, ...semanticKeywords]
    
    // Optimize content structure
    const optimizedContent = await optimizeContentStructure(content.content || '', optimizedKeywords)
    
    // Generate internal linking suggestions
    const internalLinks = await generateInternalLinks(content.category || '', content.country || '')
    
    // Generate external linking suggestions
    const externalLinks = await generateExternalLinks(content.category || '', content.country || '')

    return {
      ...content,
      content: optimizedContent,
      keywords: optimizedKeywords,
      internal_links: internalLinks,
      external_links: externalLinks,
      seo_score: calculateSEOScore(optimizedContent, optimizedKeywords)
    }

  } catch (error) {
    console.error('Error optimizing content for SEO:', error)
    return content
  }
}

async function addAffiliateLinks(content: Partial<PSEOContent>, category: string): Promise<Partial<PSEOContent>> {
  try {
    // Get relevant affiliate products
    const affiliateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/affiliates/products?category=${category}`)
    if (!affiliateResponse.ok) {
      return content
    }

    const affiliateData = await affiliateResponse.json()
    const relevantProducts = affiliateData.data || []

    // Strategically place affiliate links in content
    const contentWithAffiliates = await placeAffiliateLinks(content.content || '', relevantProducts)

    return {
      ...content,
      content: contentWithAffiliates,
      affiliate_links: relevantProducts.map(product => ({
        text: product.name,
        url: product.affiliate_url,
        commission_rate: product.commission_rate,
        product_category: product.category
      }))
    }

  } catch (error) {
    console.error('Error adding affiliate links:', error)
    return content
  }
}

async function savePSEOContent(content: Partial<PSEOContent>): Promise<PSEOContent> {
  try {
    const savedContent: PSEOContent = {
      id: `pseo_${Date.now()}`,
      title: content.title || 'Generated Content',
      slug: content.slug || 'generated-content',
      content: content.content || '',
      meta_description: content.meta_description || '',
      keywords: content.keywords || [],
      category: content.category || 'general',
      city: content.city,
      state: content.state,
      country: content.country || 'United States',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seo_score: content.seo_score || 0,
      word_count: content.word_count || 0,
      affiliate_links: content.affiliate_links || [],
      internal_links: content.internal_links || [],
      external_links: content.external_links || []
    }

    // Here you would save to your actual storage system
    console.log('Saving PSEO content:', savedContent)

    return savedContent

  } catch (error) {
    console.error('Error saving PSEO content:', error)
    throw error
  }
}

async function updateSitemap(content: PSEOContent): Promise<void> {
  try {
    // Update XML sitemap
    const sitemapEntry = `
  <url>
    <loc>${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/guides/${content.slug}</loc>
    <lastmod>${content.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`

    console.log('Adding to sitemap:', sitemapEntry)

  } catch (error) {
    console.error('Error updating sitemap:', error)
  }
}

async function updateRSSFeed(content: PSEOContent): Promise<void> {
  try {
    // Update RSS feed
    const rssEntry = `
  <item>
    <title>${content.title}</title>
    <link>${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/guides/${content.slug}</link>
    <description>${content.meta_description}</description>
    <pubDate>${content.created_at}</pubDate>
    <category>${content.category}</category>
  </item>`

    console.log('Adding to RSS feed:', rssEntry)

  } catch (error) {
    console.error('Error updating RSS feed:', error)
  }
}

// Helper functions
function extractTitle(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      return line.trim().substring(0, 60) + '...'
    }
  }
  return 'Generated Content'
}

function generateMetaDescription(content: string, keywords: string[]): string {
  const cleanContent = content.replace(/\s+/g, ' ').trim()
  const description = cleanContent.substring(0, 160)
  return description + (description.length === 160 ? '...' : '')
}

function generateSlug(title: string, location: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60)
}

function calculateSEOScore(content: string, keywords: string[]): number {
  let score = 0
  
  // Keyword density
  const wordCount = content.split(' ').length
  for (const keyword of keywords) {
    const keywordCount = (content.match(new RegExp(keyword, 'gi')) || []).length
    const density = keywordCount / wordCount
    if (density > 0.01 && density < 0.03) score += 20 // Optimal density
    else if (density > 0.005 && density < 0.05) score += 10 // Acceptable density
  }
  
  // Content length
  if (wordCount >= 1500) score += 20
  else if (wordCount >= 1000) score += 15
  else if (wordCount >= 500) score += 10
  
  // Headings structure
  const h2Count = (content.match(/##\s+/g) || []).length
  const h3Count = (content.match(/###\s+/g) || []).length
  if (h2Count >= 3) score += 15
  if (h3Count >= 5) score += 10
  
  return Math.min(score, 100)
}

async function generateSemanticKeywords(keywords: string[]): Promise<string[]> {
  // Generate semantic keywords using AI
  try {
    const prompt = `Generate 5 semantic keywords related to: ${keywords.join(', ')}. Return only the keywords, one per line.`
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.3,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      const content = data.choices[0]?.message?.content || ''
      return content.split('\n').filter(k => k.trim()).slice(0, 5)
    }
  } catch (error) {
    console.error('Error generating semantic keywords:', error)
  }
  
  return []
}

async function optimizeContentStructure(content: string, keywords: string[]): Promise<string> {
  // Basic content optimization
  let optimized = content
  
  // Ensure proper heading structure
  if (!optimized.includes('## ')) {
    optimized = `## Key Takeaways\n\n${optimized}`
  }
  
  // Add conclusion if missing
  if (!optimized.toLowerCase().includes('conclusion')) {
    optimized += '\n\n## Conclusion\n\nIn summary, this guide provides comprehensive insights into the topic. Take action on the strategies discussed to achieve your goals.'
  }
  
  return optimized
}

async function generateInternalLinks(category: string, country: string): Promise<string[]> {
  // Generate internal linking suggestions
  return [
    `/guides/${category}`,
    `/guides/${category}-${country.toLowerCase().replace(' ', '-')}`,
    `/store?category=${category}`
  ]
}

async function generateExternalLinks(category: string, country: string): Promise<string[]> {
  // Generate external linking suggestions
  return [
    `https://www.google.com/search?q=${category}+${country}`,
    `https://en.wikipedia.org/wiki/${category}`,
    `https://www.linkedin.com/company/${category}`
  ]
}

async function placeAffiliateLinks(content: string, products: any[]): Promise<string> {
  // Strategically place affiliate links in content
  let modifiedContent = content
  
  for (const product of products.slice(0, 3)) { // Limit to 3 affiliate links
    const linkText = product.name
    const affiliateUrl = product.affiliate_url
    
    // Find a good place to insert the affiliate link
    const sentences = modifiedContent.split('. ')
    if (sentences.length > 3) {
      const insertIndex = Math.floor(sentences.length / 2)
      const affiliateSentence = `Check out ${linkText} for the best solutions in this area.`
      sentences.splice(insertIndex, 0, affiliateSentence)
      modifiedContent = sentences.join('. ')
    }
  }
  
  return modifiedContent
}

async function getAllPSEOContent(): Promise<PSEOContent[]> {
  // Return sample content for now
  return [
    {
      id: 'pseo_001',
      title: 'AI Business Strategy Guide',
      slug: 'ai-business-strategy-guide',
      content: 'Comprehensive guide to AI business strategy...',
      meta_description: 'Learn how to implement AI strategies in your business',
      keywords: ['ai', 'business', 'strategy'],
      category: 'business',
      country: 'United States',
      created_at: '2025-01-15T10:00:00Z',
      updated_at: '2025-01-15T10:00:00Z',
      seo_score: 85,
      word_count: 1800,
      affiliate_links: [],
      internal_links: [],
      external_links: []
    }
  ]
}

async function refreshExistingContent(category?: string, location?: string): Promise<NextResponse> {
  // Refresh existing content
  return NextResponse.json({
    success: true,
    data: { message: 'Content refresh initiated' }
  })
}

async function optimizeExistingContent(category?: string, location?: string, keywords?: string[]): Promise<NextResponse> {
  // Optimize existing content
  return NextResponse.json({
    success: true,
    data: { message: 'Content optimization initiated' }
  })
} 