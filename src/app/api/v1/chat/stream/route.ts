import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { message, conversationId } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    const startStreaming = async () => {
      // Mock streaming chunks
      const sendChunk = async (chunk: any) => {
        await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      }

      await sendChunk({ type: 'text', content: '我正在分析您的請求...\n\n' })
      await new Promise(r => setTimeout(r, 1000))

      await sendChunk({ type: 'tool_call', skill: 'alphaear-stock', params: { query: message } })
      await sendChunk({
          type: 'skill_progress',
          steps: [{ skill: 'alphaear-stock', status: 'running', label: '獲取 OHLCV 資料' }]
      })
      await new Promise(r => setTimeout(r, 1500))

      await sendChunk({ type: 'text', content: `根據目前資料，這是一份對於 "${message}" 的初步分析結果。` })
      await new Promise(r => setTimeout(r, 800))

      await writer.write(encoder.encode('data: [DONE]\n\n'))
      await writer.close()
    }

    startStreaming()

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in chat stream:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
