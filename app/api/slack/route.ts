import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const response = await fetch(process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: body.text,
        blocks: body.blocks
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send Slack notification')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Slack notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
} 