import { NextRequest, NextResponse } from 'next/server'

// This endpoint verifies if a user is a member of the Telegram channel
// Using Telegram Bot API
export async function POST(request: NextRequest) {
  try {
    const { userId, username } = await request.json()

    if (!userId && !username) {
      return NextResponse.json(
        { error: 'Missing user ID or username' },
        { status: 400 }
      )
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@COPEonBNB'

    if (!BOT_TOKEN) {
      return NextResponse.json({ 
        isMember: false,
        error: 'Telegram bot token not configured'
      }, { status: 500 })
    }

    try {
      // Telegram Bot API requires numeric user ID, not username
      if (!userId) {
        return NextResponse.json({ 
          isMember: false,
          error: 'Telegram User ID is required. Please get your User ID from @userinfobot on Telegram.'
        })
      }

      // Check if user is a member of the channel using user ID
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${CHAT_ID}&user_id=${userId}`
      )

      const data = await response.json()

      if (data.ok) {
        const status = data.result?.status
        // Status can be: 'member', 'administrator', 'creator', 'left', 'kicked', 'restricted'
        const isMember = ['member', 'administrator', 'creator'].includes(status)
        
        return NextResponse.json({ 
          isMember,
          status,
          userId: data.result?.user?.id
        })
      } else {
        return NextResponse.json({ 
          isMember: false,
          error: data.description || 'Failed to verify membership. Make sure you have joined the channel.'
        })
      }
    } catch (apiError: any) {
      console.error('Telegram API error:', apiError)
      return NextResponse.json({ 
        isMember: false,
        error: apiError.message || 'Telegram API error'
      })
    }
  } catch (error: any) {
    console.error('Verify Telegram error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

