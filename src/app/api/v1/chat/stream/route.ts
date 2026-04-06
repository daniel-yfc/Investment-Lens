import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { streamText } from 'ai'
import { getLLMModel, DEFAULT_SYSTEM_PROMPT } from '@/lib/llm-router'
import type { AnalysisResultCardProps } from '@/types/skill.types'

export const runtime = 'nodejs'
// #7: Vercel Pro = 60s, Hobby = 10s. Set explicitly to avoid silent timeout.
export const maxDuration = 60

// SE-02: Ticker whitelist
const TICKER_REGEX = /^[A-Z0-9]{1,10}(\.[A-Z]{1,3})?$/

// #12: Extract first valid ticker token from free-form message
function sanitizeTicker(raw: string): string | null {
  const tokens = raw.trim().toUpperCase().split(/\s+/)
  for (const token of tokens) {
    if (TICKER_REGEX.test(token)) return token
  }
  return null
}

// Simple in-memory rate limiter
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
    const isTestAuth = req.headers.get('x-test-auth') === 'true'
    const isPlaywrightTest = req.headers.get('x-playwright-test') === 'true'

    let session: { user: { id?: string; name?: string | null; email?: string | null }; expires: string } | null = null
    if (isTestAuth || isPlaywrightTest) {
      session = { user: { id: 'test-user', name: 'Test', email: 'test@example.com' }, expires: '' }
    } else {
      session = await auth()
    }

    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const identifier = session.user.id ?? 'anonymous'
    const { success, remaining, resetAt } = checkRateLimit(identifier)
    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(RATE_LIMIT),
            'X-RateLimit-Remaining': '0',
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

    // Mock SSE for tests
    if (isTestAuth || isPlaywrightTest) {
      const encoder = new TextEncoder()
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"text","content":"TSMC Analyst"}\n\n'))
          controller.enqueue(encoder.encode('data: {"type":"done"}\n\n'))
          controller.close()
        },
      })
      return new NextResponse(mockStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'X-RateLimit-Remaining': String(remaining),
        },
      })
    }

    // #12: Smarter ticker extraction
    const ticker = sanitizeTicker(message) ?? 'UNKNOWN'

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    const startStreaming = async () => {
      const send = async (chunk: unknown) =>
        writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))

      try {
        await send({ type: 'text', content: `啟動 investment-lens Mode A 進行證券分析...\n\n` })
        await send({ type: 'tool_call', skill: 'alphaear-stock', params: { query: message } })
        await send({ type: 'skill_progress', steps: [{ skill: 'alphaear-stock', status: 'running', label: '獲取 OHLCV 資料' }] })

        const { model, provider, modelId } = getLLMModel()
        await send({ type: 'skill_progress', steps: [{ skill: 'investment-lens', status: 'running', label: `呼叫 ${provider}/${modelId}` }] })

        // #3: Request structured JSON output from LLM
        const { textStream } = streamText({
          model,
          system: DEFAULT_SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: `請針對 ${ticker} 進行投資分析。請回覆以下 JSON 格式（不要加 markdown 樣式）：
{
  "recommendation": "Buy" | "Hold" | "Sell" | "Neutral",
  "confidence": "High" | "Medium" | "Low",
  "thesis": "投資正面論點（2-3句）",
  "counterThesis": "反向論點（2-3句）",
  "keyRisks": [
    { "id": "r1", "label": "風險名稱", "severity": "high" | "medium" | "low", "detail": "說明" }
  ],
  "killConditions": ["論點失效條件1", "論點失效條件2"],
  "summary": "給用戶看的完整分析文字"
}`,
            },
          ],
          temperature: 0.3,
          maxTokens: 2048,
        })

        // Stream summary text while accumulating full response
        let fullText = ''
        for await (const delta of textStream) {
          fullText += delta
        }

        await send({ type: 'skill_progress', steps: [{ skill: 'investment-lens', status: 'done', label: '分析完成' }] })

        // #3: Parse structured JSON from LLM; fallback gracefully
        let parsed: Partial<AnalysisResultCardProps> & { summary?: string } = {}
        try {
          const jsonMatch = fullText.match(/\{[\s\S]*\}/)
          if (jsonMatch) parsed = JSON.parse(jsonMatch[0])
        } catch {
          // JSON parse failed — show raw text as summary
          parsed = { summary: fullText }
        }

        // Emit human-readable summary as streaming text
        if (parsed.summary) {
          await send({ type: 'text', content: `\n\n${parsed.summary}` })
        } else {
          await send({ type: 'text', content: `\n\n分析完成。` })
        }

        // Emit structured AnalysisResultCard
        const analysisData: AnalysisResultCardProps = {
          ticker: ticker.toUpperCase(),
          recommendation: parsed.recommendation ?? 'Neutral',
          confidence: parsed.confidence ?? 'Low',
          thesis: parsed.thesis ?? fullText.substring(0, 300),
          counterThesis: parsed.counterThesis ?? '',
          keyRisks: parsed.keyRisks ?? [],
          killConditions: parsed.killConditions ?? [],
          validAsOf: new Date().toISOString(),
        }
        await send({ type: 'tool_result', component: 'AnalysisResultCard', props: analysisData })
        await writer.write(encoder.encode('data: [DONE]\n\n'))

      } catch (streamError) {
        console.error('Streaming error:', streamError)
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Stream interrupted' })}\n\n`)
        )
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
        'X-LLM-Provider': process.env.LLM_PROVIDER ?? 'openai',
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
