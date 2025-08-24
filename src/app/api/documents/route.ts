import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return sample documents
    const documents = [
      {
        id: 'doc_001',
        title: 'Business Strategy 2024',
        content: '# Business Strategy 2024\n\n## Overview\nOur comprehensive business strategy for the upcoming year...',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['strategy', 'business', 'planning'],
        status: 'active'
      },
      {
        id: 'doc_002',
        title: 'Marketing Campaign Plan',
        content: '# Marketing Campaign Plan\n\n## Campaign Goals\n- Increase brand awareness\n- Generate qualified leads...',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['marketing', 'campaign', 'strategy'],
        status: 'active'
      }
    ]

    return NextResponse.json({ success: true, data: documents })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch documents' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, tags } = body

    if (!title || !content) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title and content are required' 
      }, { status: 400 })
    }

    const newDocument = {
      id: `doc_${Date.now()}`,
      title,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: tags || [],
      status: 'active'
    }

    console.log('Document created:', newDocument)

    return NextResponse.json({ 
      success: true, 
      message: 'Document created successfully',
      data: newDocument
    })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create document' 
    }, { status: 500 })
  }
}
