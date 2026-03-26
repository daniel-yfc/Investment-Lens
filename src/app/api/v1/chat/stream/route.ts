import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const session = await auth();

    // SE-01: 未帶 JWT 呼叫 /api/v1/* 回傳 HTTP 401
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o'),
      messages,
      system: 'You are a professional financial AI assistant.',
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Stream error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
