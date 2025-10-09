import { NextRequest, NextResponse } from 'next/server'

const SERP_WEBHOOK_URL = 'https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach'

export async function POST(request: NextRequest) {
  try {
    console.log('[API] SERP proxy request received')
    
    const body = await request.json()
    console.log('[API] Payload:', body)
    
    const startTime = Date.now()
    
    // Forward request to n8n webhook
    const response = await fetch(SERP_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      // No timeout - let it take as long as needed
    })
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`[API] Response received in ${elapsed}s, status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API] Error from webhook:', errorText)
      return NextResponse.json(
        { error: `Webhook error: ${response.status}` },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log(`[API] Success! Returning ${Array.isArray(data) ? data.length : 0} results`)
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error: any) {
    console.error('[API] Error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Unknown error',
        details: 'Error connecting to SERP webhook'
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

