import { NextResponse } from 'next/server'
import { AnalysisResultCardProps } from '@/types/skill.types'

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
      const sendChunk = async (chunk: any) => {
        await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      }

      await sendChunk({ type: 'text', content: '啟動 investment-lens Mode A 進行證券分析...\n\n' })
      await new Promise(r => setTimeout(r, 800))

      await sendChunk({ type: 'tool_call', skill: 'alphaear-stock', params: { query: message } })
      await sendChunk({
          type: 'skill_progress',
          steps: [{ skill: 'alphaear-stock', status: 'running', label: '獲取 OHLCV 資料' }]
      })
      await new Promise(r => setTimeout(r, 1000))

      await sendChunk({
          type: 'skill_progress',
          steps: [{ skill: 'alphaear-stock', status: 'done', label: '獲取 OHLCV 資料', durationMs: 450 }]
      })

      await sendChunk({ type: 'text', content: `分析完成。以下是針對 ${message} 的詳細評估：` })
      await new Promise(r => setTimeout(r, 500))

      // Emit AnalysisResultCard props
      const analysisData: AnalysisResultCardProps = {
        ticker: message.split(' ')[0] || 'AAPL',
        recommendation: 'Buy',
        confidence: 'High',
        thesis: '強勁的自由現金流與持續擴張的市佔率。AI 基礎設施建設的資本支出將在未來幾個季度轉化為實質營收增長。',
        counterThesis: '面臨反壟斷調查壓力，且短期估值偏高，若總體經濟放緩將首當其衝。',
        keyRisks: [
          { id: 'r1', label: '法規風險', severity: 'medium', detail: '歐盟 DMA 影響' },
          { id: 'r2', label: '供應鏈集中', severity: 'high', detail: '過度依賴單一供應商' }
        ],
        killConditions: [
          '連續兩季營收未達預期',
          '核心產品毛利率跌破 40%'
        ],
        validAsOf: new Date().toISOString()
      }

      await sendChunk({
        type: 'tool_result',
        component: 'AnalysisResultCard',
        props: analysisData
      })

      await new Promise(r => setTimeout(r, 500))
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
