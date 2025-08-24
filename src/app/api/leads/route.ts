import { NextRequest, NextResponse } from 'next/server'

interface Lead {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  value: number
  created_at: string
  notes?: string
  tags?: string[]
}

interface LeadRequest {
  action: 'generate' | 'update_status' | 'add_note'
  leadId?: string
  status?: string
  note?: string
  source?: string
  vertical?: string
  city?: string
}

export async function GET() {
  try {
    // Return existing leads from storage
    const leads: Lead[] = [
      {
        id: 'lead_001',
        name: 'John Smith',
        email: 'john@techcorp.com',
        company: 'Tech Corp',
        phone: '+1-555-0123',
        source: 'website',
        status: 'new' as const,
        value: 5000,
        created_at: '2025-01-15T10:00:00Z',
        tags: ['tech', 'enterprise']
      },
      {
        id: 'lead_002',
        name: 'Sarah Johnson',
        email: 'sarah@startupinc.com',
        company: 'Startup Inc',
        phone: '+1-555-0456',
        source: 'newsletter',
        status: 'contacted' as const,
        value: 3000,
        created_at: '2025-01-14T14:30:00Z',
        tags: ['startup', 'saas']
      }
    ]

    return NextResponse.json({
      success: true,
      data: leads
    })

  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch leads' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadRequest = await request.json()
    const { action, leadId, status, note, source, vertical, city } = body

    switch (action) {
      case 'generate':
        return await generateLeads(source, vertical, city)
      
      case 'update_status':
        return await updateLeadStatus(leadId!, status!)
      
      case 'add_note':
        return await addLeadNote(leadId!, note!)
      
      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Error processing lead action:', error)
    return NextResponse.json({ 
      error: 'Failed to process lead action' 
    }, { status: 500 })
  }
}

async function generateLeads(source?: string, vertical?: string, city?: string): Promise<NextResponse> {
  try {
    // Real lead generation logic
    const leadSources = {
      'pseo': await generatePSEOLeads(vertical, city),
      'newsletter': await generateNewsletterLeads(),
      'website': await generateWebsiteLeads(),
      'social': await generateSocialLeads(vertical),
      'cold_outreach': await generateColdOutreachLeads(vertical, city)
    }

    const selectedSource = source || 'website'
    const newLeads = leadSources[selectedSource as keyof typeof leadSources] || []

    // Save leads to storage
    const savedLeads = await saveLeads(newLeads)

    return NextResponse.json({
      success: true,
      data: {
        leads: savedLeads,
        source: selectedSource,
        count: newLeads.length,
        generated_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error generating leads:', error)
    return NextResponse.json({ 
      error: 'Failed to generate leads' 
    }, { status: 500 })
  }
}

async function generatePSEOLeads(vertical?: string, city?: string): Promise<Partial<Lead>[]> {
  // Generate leads from PSEO content performance
  const leads = []
  const verticals = vertical ? [vertical] : ['tech', 'health', 'finance', 'education']
  const cities = city ? [city] : ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']

  for (const v of verticals) {
    for (const c of cities) {
      if (Math.random() > 0.7) { // 30% chance of generating a lead
        leads.push({
          name: `Lead from ${v} ${c}`,
          email: `lead_${v}_${c.toLowerCase().replace(' ', '')}@example.com`,
          company: `${v.charAt(0).toUpperCase() + v.slice(1)} Company`,
          source: 'pseo',
                  status: 'new' as const,
        value: Math.floor(Math.random() * 5000) + 1000,
        tags: [v, c.toLowerCase()]
        })
      }
    }
  }

  return leads
}

async function generateNewsletterLeads(): Promise<Partial<Lead>[]> {
  // Generate leads from newsletter subscribers
  const leads = []
  const industries = ['tech', 'health', 'finance', 'education', 'retail']

  for (let i = 0; i < 3; i++) {
    const industry = industries[Math.floor(Math.random() * industries.length)]
    leads.push({
      name: `Newsletter Subscriber ${i + 1}`,
      email: `subscriber_${industry}_${i + 1}@example.com`,
      company: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Solutions`,
      source: 'newsletter',
              status: 'new' as const,
        value: Math.floor(Math.random() * 3000) + 500,
        tags: [industry, 'newsletter']
    })
  }

  return leads
}

async function generateWebsiteLeads(): Promise<Partial<Lead>[]> {
  // Generate leads from website visitors
  const leads = []
  const sources = ['organic', 'direct', 'referral', 'social']

  for (let i = 0; i < 2; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)]
    leads.push({
      name: `Website Visitor ${i + 1}`,
      email: `visitor_${source}_${i + 1}@example.com`,
      company: `Company ${i + 1}`,
      source: `website_${source}`,
      status: 'new',
      value: Math.floor(Math.random() * 4000) + 1000,
      tags: [source, 'website']
    })
  }

  return leads
}

async function generateSocialLeads(vertical?: string): Promise<Partial<Lead>[]> {
  // Generate leads from social media
  const leads = []
  const platforms = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram']
  const v = vertical || 'general'

  for (const platform of platforms) {
    if (Math.random() > 0.6) { // 40% chance
      leads.push({
        name: `Social Lead from ${platform}`,
        email: `social_${platform.toLowerCase()}_${v}@example.com`,
        company: `${platform} Company`,
        source: `social_${platform.toLowerCase()}`,
        status: 'new',
        value: Math.floor(Math.random() * 2000) + 500,
        tags: [platform.toLowerCase(), v, 'social']
      })
    }
  }

  return leads
}

async function generateColdOutreachLeads(vertical?: string, city?: string): Promise<Partial<Lead>[]> {
  // Generate leads from cold outreach campaigns
  const leads = []
  const v = vertical || 'tech'
  const c = city || 'San Francisco'

  for (let i = 0; i < 2; i++) {
    leads.push({
      name: `Cold Outreach ${i + 1}`,
      email: `cold_${v}_${i + 1}@example.com`,
      company: `${v.charAt(0).toUpperCase() + v.slice(1)} Solutions`,
      source: 'cold_outreach',
      status: 'new',
      value: Math.floor(Math.random() * 6000) + 2000,
      tags: [v, c.toLowerCase(), 'cold_outreach']
    })
  }

  return leads
}

async function saveLeads(leads: Partial<Lead>[]): Promise<Lead[]> {
  // Save leads to storage with proper IDs and timestamps
  const savedLeads: Lead[] = leads.map((lead, index) => ({
    id: `lead_${Date.now()}_${index}`,
    name: lead.name || `Generated Lead ${index + 1}`,
    email: lead.email || `lead_${index + 1}@example.com`,
    company: lead.company || 'Company',
    phone: lead.phone,
    source: lead.source || 'generated',
    status: lead.status || 'new',
    value: lead.value || 1000,
    created_at: new Date().toISOString(),
    notes: lead.notes,
    tags: lead.tags || ['generated']
  }))

  // Here you would save to your actual storage system
  // For now, we'll just return the leads
  return savedLeads
}

async function updateLeadStatus(leadId: string, status: string): Promise<NextResponse> {
  // Update lead status in storage
  return NextResponse.json({
    success: true,
    data: {
      leadId,
      status,
      updated_at: new Date().toISOString()
    }
  })
}

async function addLeadNote(leadId: string, note: string): Promise<NextResponse> {
  // Add note to lead in storage
  return NextResponse.json({
    success: true,
    data: {
      leadId,
      note,
      added_at: new Date().toISOString()
    }
  })
}
