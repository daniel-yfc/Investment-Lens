import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

interface AnalysisResult {
  ticker: string;
  rating: 'Buy' | 'Hold' | 'Sell' | 'Neutral';
  l1Summary: string;
  l2Details: string;
  l3DeepDive: string;
}

const cache = new Map<string, AnalysisResult>();

async function analyzeSecurity(ticker: string): Promise<AnalysisResult> {
  const normalizedTicker = ticker.toUpperCase();
  const cacheKey = `analysis_${normalizedTicker}`;

  if (cache.has(cacheKey)) {
     return cache.get(cacheKey)!;
  }

  await new Promise(resolve => setTimeout(resolve, 200));

  const ratingMap = ['Buy', 'Hold', 'Sell', 'Neutral'];
  const rating = ratingMap[Math.floor(Math.random() * ratingMap.length)] as 'Buy' | 'Hold' | 'Sell' | 'Neutral';

  const result: AnalysisResult = {
    ticker: normalizedTicker,
    rating,
    l1Summary: `The outlook for ${normalizedTicker} is currently ${rating}.`,
    l2Details: `${normalizedTicker} has shown mixed signals in recent earnings. Margins are stable but forward guidance was cautious.`,
    l3DeepDive: `In a deeper fundamental analysis, ${normalizedTicker}'s P/E ratio sits at historical averages. The DCF model suggests limited upside unless macro conditions improve significantly. Risks include supply chain constraints and regulatory headwinds.`
  };

  cache.set(cacheKey, result);
  return result;
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o'),
      messages,
      system: 'You are a professional financial AI assistant. Use the `analyze_security` tool when asked to analyze a stock, ETF, or cryptocurrency. Use the `update_quote` tool when asked to update portfolio prices, NAV, or FX rates.',
      tools: {
        // We use any type casting to bypass the type definitions which conflicts across versions for tool configuration
        analyze_security: {
          description: 'Analyze a single security (stock, ETF, crypto) using investment-lens Mode A.',
          parameters: z.object({
            ticker: z.string().describe('The ticker symbol of the security to analyze (e.g., AAPL, 2330.TW).'),
          }),
          execute: async ({ ticker }: { ticker: string }) => {
            return await analyzeSecurity(ticker);
          },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        update_quote: {
          description: 'Update the live quotes, NAV, and FX rates for a portfolio.',
          parameters: z.object({
            portfolioId: z.string().describe('The ID of the portfolio to update.'),
          }),
          execute: async ({ portfolioId }: { portfolioId: string }) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
              portfolioId,
              status: 'success',
              updatedPositions: 5,
              newTotalValueBase: 1250000,
              currencyBase: 'TWD',
              lastUpdated: new Date().toISOString()
            };
          },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Stream error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
