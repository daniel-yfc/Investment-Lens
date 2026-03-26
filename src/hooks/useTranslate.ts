import { useUIStore } from '@/store/ui'
import { dictionaries } from '@/lib/i18n/dictionaries'

export function useTranslate() {
  const locale = useUIStore((state) => state.locale)
  return {
    t: dictionaries[locale],
    locale,
    setLocale: useUIStore.getState().setLocale
  }
}
