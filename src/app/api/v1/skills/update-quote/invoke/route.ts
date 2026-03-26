import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { portfolioId } = await req.json()

    // Mock API delay
    await new Promise(r => setTimeout(r, 1500))

    // Mock response representing an updated portfolio with new quotes
    const mockUpdatedPortfolio = {
      holdings: [
        { ticker: '2330.TW', name: '台積電', shares: 1000, avgCost: 500, currentPrice: 535, marketValue: 535000, unrealizedPnl: 35000, exchange: 'TWSE' },
        { ticker: 'AAPL', name: 'Apple Inc.', shares: 100, avgCost: 150, currentPrice: 175, marketValue: 17500, unrealizedPnl: 2500, exchange: 'US' },
      ],
      totalValue: 552500, // 535000 + 17500
      valueDate: new Date().toISOString()
    }

    return NextResponse.json({
      skill: 'update-quote',
      status: 'completed',
      result: mockUpdatedPortfolio,
      executionTime: 1500,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
