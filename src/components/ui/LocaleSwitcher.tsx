'use client'

import { useTranslate } from '@/hooks/useTranslate'

export function LocaleSwitcher() {
  const { locale, setLocale } = useTranslate()

  return (
    <div className="flex bg-zinc-800 rounded-md p-0.5 border border-zinc-700">
      <button
        onClick={() => setLocale('zh-TW')}
        className={`px-2 py-1 text-xs rounded-sm transition-colors ${
          locale === 'zh-TW' ? 'bg-zinc-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        繁
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-2 py-1 text-xs rounded-sm transition-colors ${
          locale === 'en' ? 'bg-zinc-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        EN
      </button>
    </div>
  )
}
