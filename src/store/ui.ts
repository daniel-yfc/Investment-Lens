import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type Locale = 'zh-TW' | 'en'
export type Theme = 'dark' | 'light'
export type ActivePanel = 'chat' | 'chart' | 'report' | 'portfolio' | null

export interface UIState {
  sidebarOpen: boolean
  theme: Theme
  locale: Locale
  activePanel: ActivePanel
  isMobile: boolean

  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void
  setTheme: (theme: Theme) => void
  setLocale: (locale: Locale) => void
  setActivePanel: (panel: ActivePanel) => void
  setIsMobile: (v: boolean) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        theme: 'dark',
        locale: 'zh-TW',
        activePanel: null,
        isMobile: false,

        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (v) => set({ sidebarOpen: v }),
        setTheme: (theme) => set({ theme }),
        setLocale: (locale) => set({ locale }),
        setActivePanel: (panel) => set({ activePanel: panel }),
        setIsMobile: (v) => set({ isMobile: v }),
      }),
      {
        name: 'ui-store',
      }
    )
  )
)
