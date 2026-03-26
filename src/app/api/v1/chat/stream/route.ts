import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { chatRateLimiter } from '@/lib/utils/rate-limiter';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const session = await auth();

    // SE-01: 未帶 JWT 呼叫 /api/v1/* 回傳 HTTP 401
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Rate limiting using user ID or IP as identifier
    const identifier = session.user.id || req.headers.get('x-forwarded-for') || 'anonymous';
    const { success, limit, reset, remaining } = await chatRateLimiter.limit(identifier);

    // SE-02: AI 對話超過 20 messages/min 回傳 HTTP 429
    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'You have exceeded the maximum number of requests allowed per minute.'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-4o'),
      messages,
      system: 'You are a professional financial AI assistant.',
      tools: {
        generateReport: tool({
          description: 'Execute the report_agent.py script from the alphaear-reporter skill to generate a professional investment report or research note.',
          parameters: z.object({
            ticker: z.string().describe('The stock ticker symbol (e.g., AAPL, 2330.TW).'),
            mode: z.enum(['A', 'B', 'C']).describe('Report mode: A for Research Note, B for Initiating Coverage, C for Investor Materials.'),
          }),
          execute: async ({ ticker, mode }: { ticker: string; mode: string }) => {
            try {
              const { stdout } = await execAsync(`python3 skills/alphaear-reporter/scripts/report_agent.py --ticker ${ticker} --mode ${mode}`);
              return stdout;
            } catch (error: any) {
              console.error('Error executing alphaear-reporter:', error);
              return `Error: ${error.message || 'Unknown error occurred'}`;
            }
          },
        }),
        generateVisualizer: tool({
          description: 'Execute the visualizer.py script from the alphaear-reporter skill to generate visualizations.',
          parameters: z.object({
            ticker: z.string().describe('The stock ticker symbol (e.g., AAPL, 2330.TW).'),
          }),
          execute: async ({ ticker }: { ticker: string }) => {
            try {
              const { stdout } = await execAsync(`python3 skills/alphaear-reporter/scripts/visualizer.py --ticker ${ticker}`);
              return stdout;
            } catch (error: any) {
              console.error('Error executing visualizer:', error);
              return `Error: ${error.message || 'Unknown error occurred'}`;
            }
          },
        }),
      },
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.error('Stream error:', error);
    return new NextResponse(JSON.stringify({ error: 'INTERNAL_ERROR' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
