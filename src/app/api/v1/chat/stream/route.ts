import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { AnalysisResultCardProps } from '@/types/skill.types'

export const runtime = 'edge'

// SE-02: Ticker whitelist — only allow safe stock ticker formats
// Allows: AAPL, TSLA, 2330.TW, 005930.KS, BRK.B, etc.
const TICKER_REGEX = /^[A-Z0-9]{1,6}(\.[A-Z]{1,3})?$/

function sanitizeTicker(raw: string): string | null {
  const candidate = raw.trim().toUpperCase().split(' ')[0]
  return TICKER_REGEX.test(candidate) ? candidate : null
}

// Simple in-memory rate limiter for edge runtime (per-request, resets on cold start)
// For production, replace with Upstash Redis via @upstash/ratelimit
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 60_000

function checkRateLimit(identifier: string): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { success: true, remaining: RATE_LIMIT - 1, resetAt: now + RATE_WINDOW_MS }
  }

  if (entry.count >= RATE_LIMIT) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: RATE_LIMIT - entry.count, resetAt: entry.resetAt }
}

export async function POST(req: Request) {
  try {
    // SE-01: Auth guard — 401 for unauthenticated requests
    const session = await auth()
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // SE-02: Rate limiting — 20 requests/min per user
    const identifier = session.user.id ?? 'anonymous'
    const { success, remaining, resetAt } = checkRateLimit(identifier)
    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'You have exceeded the maximum number of requests allowed per minute.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(RATE_LIMIT),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(resetAt),
            'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          },
        }
      )
    }

    const body = await req.json()
    const { message, conversationId: _conversationId } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Input sanitization — extract and validate ticker
    const ticker = sanitizeTicker(message) ?? 'N/A'

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    const startStreaming = async () => {
      const sendChunk = async (chunk: unknown) => {
        await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      }

      try {
        await sendChunk({ type: 'text', content: `啟動 investment-lens Mode A 進行證券分析...\n\n` })
        await new Promise(r => setTimeout(r, 800))

        await sendChunk({ type: 'tool_call', skill: 'alphaear-stock', params: { query: message } })
        await sendChunk({
          type: 'skill_progress',
          steps: [{ skill: 'alphaear-stock', status: 'running', label: '獲取 OHLCV 資料' }],
        })
        await new Promise(r => setTimeout(r, 1000))

        await sendChunk({
          type: 'skill_progress',
          steps: [{ skill: 'alphaear-stock', status: 'done', label: '獲取 OHLCV 資料', durationMs: 450 }],
        })

        await sendChunk({ type: 'text', content: `分析完成。以下是針對 ${ticker} 的詳細評估：` })
        await new Promise(r => setTimeout(r, 500))

        const analysisData: AnalysisResultCardProps = {
          ticker,
          recommendation: 'Buy',
          confidence: 'High',
          thesis: '強勁的自由現金流與持續擴張的市佔率。AI 基礎設施建設的資本支出將在未來幾個季度轉化為實質營收增長。',
          counterThesis: '面臨反壟斷調查壓力，且短期估值偏高，若總體經濟放緩將首當其衝。',
          keyRisks: [
            { id: 'r1', label: '法規風險', severity: 'medium', detail: '歐盟 DMA 影響' },
            { id: 'r2', label: '供應鏈集中', severity: 'high', detail: '過度依賴單一供應商' },
          ],
          killConditions: ['連續兩季營收未達預期', '核心產品毛利率跌破 40%'],
          validAsOf: new Date().toISOString(),
        }

        await sendChunk({ type: 'tool_result', component: 'AnalysisResultCard', props: analysisData })
        await new Promise(r => setTimeout(r, 500))
        await writer.write(encoder.encode('data: [DONE]\n\n'))
      } catch (streamError) {
        console.error('Streaming error:', streamError)
        await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Stream interrupted' })}\n\n`))
      } finally {
        await writer.close()
      }
    }

    startStreaming()

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-RateLimit-Remaining': String(remaining),
      },
    })
  } catch (error) {
    console.error('Error in chat stream:', error)
    return new NextResponse(JSON.stringify({ error: 'INTERNAL_ERROR' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
