import { NextRequest, NextResponse } from 'next/server'

interface ChatRequest {
  message: string
  saveToDocument?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, saveToDocument = false } = body

    // Real OpenAI API integration
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
      }, { status: 500 })
    }

    // Call real OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are THE PRINTER, an AI business assistant that helps entrepreneurs with content creation, marketing strategies, business planning, and revenue generation. You provide practical, actionable advice and can help with:

- Business strategy and planning
- Content marketing and SEO
- Affiliate marketing and monetization
- Lead generation and sales
- Newsletter and email marketing
- E-commerce and store optimization
- Risk assessment and opportunity analysis

Always be helpful, professional, and focused on practical business outcomes.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json({ 
        error: 'Failed to get AI response',
        details: errorData.error?.message || 'Unknown error'
      }, { status: 500 })
    }

    const openaiData = await openaiResponse.json()
    const aiResponse = openaiData.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // If requested, save to document
    let documentId = null
    if (saveToDocument) {
      try {
        // Use the current request's origin for the documents API
        const baseUrl = new URL(request.url).origin
        const docResponse = await fetch(`${baseUrl}/api/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'create',
            title: `AI Chat - ${new Date().toLocaleDateString()}`,
            content: `User: ${message}\n\nAI: ${aiResponse}`,
            tags: ['ai-chat', 'business-advice'],
            type: 'chat-export'
          }),
        })
        
        if (docResponse.ok) {
          const docData = await docResponse.json()
          documentId = docData.data?.id
        }
      } catch (error) {
        console.error('Failed to save to document:', error)
        // Don't fail the chat if document saving fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse,
        documentId,
        timestamp: new Date().toISOString(),
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
