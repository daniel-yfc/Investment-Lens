import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getLLMModel } from '../llm-router'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(),
}))

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: vi.fn(),
}))

describe('getLLMModel', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    // Reset env vars to ensure a clean state for each test
    vi.stubEnv('LLM_PROVIDER', undefined)
    vi.stubEnv('OPENAI_API_KEY', '')
    vi.stubEnv('OPENROUTER_API_KEY', '')
    vi.stubEnv('GOOGLE_GENERATIVE_AI_API_KEY', '')
    vi.stubEnv('OPENAI_MODEL', undefined)
    vi.stubEnv('OPENROUTER_MODEL', undefined)
    vi.stubEnv('GEMINI_MODEL', undefined)
    vi.stubEnv('NEXT_PUBLIC_APP_URL', undefined)

    // Default mocks for provider functions
    const mockModel = { id: 'mock-model' };
    (createOpenAI as any).mockReturnValue(vi.fn(() => mockModel));
    (createGoogleGenerativeAI as any).mockReturnValue(vi.fn(() => mockModel))
  })

  describe('openai provider (default)', () => {
    it('should return openai config by default when LLM_PROVIDER is not set', () => {
      vi.stubEnv('OPENAI_API_KEY', 'test-openai-key')
      const openaiMock = vi.fn().mockReturnValue({ id: 'gpt-4o' });
      (createOpenAI as any).mockReturnValue(openaiMock)

      const config = getLLMModel()

      expect(config.provider).toBe('openai')
      expect(config.modelId).toBe('gpt-4o')
      expect(createOpenAI).toHaveBeenCalledWith({ apiKey: 'test-openai-key' })
      expect(openaiMock).toHaveBeenCalledWith('gpt-4o')
    })

    it('should use custom OPENAI_MODEL if provided', () => {
      vi.stubEnv('LLM_PROVIDER', 'openai')
      vi.stubEnv('OPENAI_API_KEY', 'test-openai-key')
      vi.stubEnv('OPENAI_MODEL', 'gpt-4-turbo')
      const openaiMock = vi.fn().mockReturnValue({ id: 'gpt-4-turbo' });
      (createOpenAI as any).mockReturnValue(openaiMock)

      const config = getLLMModel()

      expect(config.modelId).toBe('gpt-4-turbo')
      expect(openaiMock).toHaveBeenCalledWith('gpt-4-turbo')
    })

    it('should throw if OPENAI_API_KEY is missing', () => {
      vi.stubEnv('LLM_PROVIDER', 'openai')
      vi.stubEnv('OPENAI_API_KEY', '')
      expect(() => getLLMModel()).toThrow('OPENAI_API_KEY is not set')
    })
  })

  describe('openrouter provider', () => {
    it('should return openrouter config', () => {
      vi.stubEnv('LLM_PROVIDER', 'openrouter')
      vi.stubEnv('OPENROUTER_API_KEY', 'test-openrouter-key')
      vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://test.app')
      const openrouterMock = vi.fn().mockReturnValue({ id: 'anthropic/claude-3.5-sonnet' });
      (createOpenAI as any).mockReturnValue(openrouterMock)

      const config = getLLMModel()

      expect(config.provider).toBe('openrouter')
      expect(config.modelId).toBe('anthropic/claude-3.5-sonnet')
      expect(createOpenAI).toHaveBeenCalledWith({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: 'test-openrouter-key',
        headers: {
          'HTTP-Referer': 'https://test.app',
          'X-Title': 'Investment-Lens',
        },
      })
      expect(openrouterMock).toHaveBeenCalledWith('anthropic/claude-3.5-sonnet')
    })

    it('should use default referer if NEXT_PUBLIC_APP_URL is missing', () => {
        vi.stubEnv('LLM_PROVIDER', 'openrouter')
        vi.stubEnv('OPENROUTER_API_KEY', 'test-openrouter-key')
        vi.stubEnv('NEXT_PUBLIC_APP_URL', undefined)
        const openrouterMock = vi.fn().mockReturnValue({ id: 'anthropic/claude-3.5-sonnet' });
        (createOpenAI as any).mockReturnValue(openrouterMock)

        getLLMModel()

        expect(createOpenAI).toHaveBeenCalledWith(expect.objectContaining({
          headers: expect.objectContaining({
            'HTTP-Referer': 'https://investment-lens.vercel.app',
          }),
        }))
      })

    it('should throw if OPENROUTER_API_KEY is missing', () => {
      vi.stubEnv('LLM_PROVIDER', 'openrouter')
      vi.stubEnv('OPENROUTER_API_KEY', '')
      expect(() => getLLMModel()).toThrow('OPENROUTER_API_KEY is not set')
    })
  })

  describe('gemini provider', () => {
    it('should return gemini config', () => {
      vi.stubEnv('LLM_PROVIDER', 'gemini')
      vi.stubEnv('GOOGLE_GENERATIVE_AI_API_KEY', 'test-gemini-key')
      const geminiMock = vi.fn().mockReturnValue({ id: 'gemini-2.0-flash' });
      (createGoogleGenerativeAI as any).mockReturnValue(geminiMock)

      const config = getLLMModel()

      expect(config.provider).toBe('gemini')
      expect(config.modelId).toBe('gemini-2.0-flash')
      expect(createGoogleGenerativeAI).toHaveBeenCalledWith({ apiKey: 'test-gemini-key' })
      expect(geminiMock).toHaveBeenCalledWith('gemini-2.0-flash')
    })

    it('should throw if GOOGLE_GENERATIVE_AI_API_KEY is missing', () => {
      vi.stubEnv('LLM_PROVIDER', 'gemini')
      vi.stubEnv('GOOGLE_GENERATIVE_AI_API_KEY', '')
      expect(() => getLLMModel()).toThrow('GOOGLE_GENERATIVE_AI_API_KEY is not set')
    })
  })
})
