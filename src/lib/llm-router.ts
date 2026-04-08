/**
 * LLM Router — unified provider selection via LLM_PROVIDER env var
 *
 * Supported values:
 *   openai        (default) — uses OPENAI_API_KEY
 *   openrouter    — uses OPENROUTER_API_KEY, model via OPENROUTER_MODEL
 *   gemini        — uses GOOGLE_GENERATIVE_AI_API_KEY, model via GEMINI_MODEL
 */
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { LanguageModelV2 } from '@ai-sdk/provider'

export type LLMProvider = 'openai' | 'openrouter' | 'gemini'

export interface LLMConfig {
  model: LanguageModelV2
  provider: LLMProvider
  modelId: string
}

export const DEFAULT_SYSTEM_PROMPT = `You are an expert investment analyst with deep knowledge of global financial markets, 
equity valuation, portfolio construction, and quantitative finance. 
Respond in Traditional Chinese (zh-TW) unless the user explicitly requests another language. 
Be concise, data-driven, and structured in your responses.`

export function getLLMModel(): LLMConfig {
  const provider = (process.env.LLM_PROVIDER ?? 'openai') as LLMProvider

  switch (provider) {
    case 'openrouter': {
      const apiKey = process.env.OPENROUTER_API_KEY
      if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set')
      const modelId = process.env.OPENROUTER_MODEL ?? 'anthropic/claude-3.5-sonnet'
      const openrouter = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey,
        headers: {
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://investment-lens.vercel.app',
          'X-Title': 'Investment-Lens',
        },
      })
      return { model: openrouter(modelId) as unknown as LanguageModelV2, provider: 'openrouter', modelId }
    }

    case 'gemini': {
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
      if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set')
      const modelId = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
      const google = createGoogleGenerativeAI({ apiKey })
      return { model: google(modelId) as unknown as LanguageModelV2, provider: 'gemini', modelId }
    }

    case 'openai':
    default: {
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) throw new Error('OPENAI_API_KEY is not set')
      const modelId = process.env.OPENAI_MODEL ?? 'gpt-4o'
      const openai = createOpenAI({ apiKey })
      return { model: openai(modelId) as unknown as LanguageModelV2, provider: 'openai', modelId }
    }
  }
}
