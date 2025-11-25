import { NextRequest, NextResponse } from 'next/server'

// This endpoint verifies if a user is a member of the Telegram channel
// Using Telegram Bot API
export async function POST(request: NextRequest) {
  try {
    const { userId, username } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      )
    }

    // TODO: Get bot token from environment variables
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
    const CHANNEL_USERNAME = 'COPEonBNB' // @COPEonBNB

    if (!BOT_TOKEN) {
      // For development, allow manual verification
      return NextResponse.json({ 
        isMember: false,
        message: 'Telegram bot token not configured. Manual verification required.'
      })
    }

    try {
      // Check if user is a member of the channel
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=@${CHANNEL_USERNAME}&user_id=${userId}`
      )

      const data = await response.json()

      if (data.ok) {
        const status = data.result?.status
        // Status can be: 'member', 'administrator', 'creator', 'left', 'kicked', 'restricted'
        const isMember = ['member', 'administrator', 'creator'].includes(status)
        
        return NextResponse.json({ 
          isMember,
          status 
        })
      } else {
        return NextResponse.json({ 
          isMember: false,
          error: data.description || 'Failed to verify membership'
        })
      }
    } catch (apiError: any) {
      return NextResponse.json({ 
        isMember: false,
        error: apiError.message || 'Telegram API error'
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

