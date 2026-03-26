import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Portfolio, Holding } from '@/types/portfolio.types'

export interface PortfolioState {
  portfolios:        Portfolio[]
  activePortfolioId: string | null
  isRefreshing:      boolean
  lastUpdated:       string | null

  setActivePortfolio: (id: string) => void
  refreshQuotes:      () => Promise<void>
  updateHolding:      (portfolioId: string, holding: Holding) => void
  addPortfolio:       (portfolio: Portfolio) => void
  removePortfolio:    (id: string) => void
  importFromCSV:      (file: File) => Promise<void>
}

export const usePortfolioStore = create<PortfolioState>()(
  devtools(
    (set, get) => ({
      portfolios: [],
      activePortfolioId: null,
      isRefreshing: false,
      lastUpdated: null,

      setActivePortfolio: (id) => set({ activePortfolioId: id }),

      refreshQuotes: async () => {
        set({ isRefreshing: true })
        try {
          const res = await fetch('/api/v1/skills/update-quote/invoke', {
             method: 'POST',
             body: JSON.stringify({ portfolioId: get().activePortfolioId })
          })
          if (res.ok) {
            const data = await res.json()
            if (data.status === 'completed' && data.result) {
              set(s => ({
                 portfolios: s.portfolios.map(p =>
                   p.id === s.activePortfolioId
                     ? { ...p, ...data.result, valueDate: new Date().toISOString() }
                     : p
                 ),
                 lastUpdated: new Date().toISOString()
              }))
            }
          }
        } finally {
          set({ isRefreshing: false })
        }
      },

      updateHolding: (portfolioId, holding) => {
         // Mock update logic
      },
      addPortfolio: (portfolio) => set(s => ({ portfolios: [...s.portfolios, portfolio], activePortfolioId: portfolio.id })),
      removePortfolio: (id) => set(s => ({ portfolios: s.portfolios.filter(p => p.id !== id) })),

      importFromCSV: async (file: File) => {
         // Mock CSV parse
         return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = async (e) => {
               const content = e.target?.result as string
               const lines = content.split('\n')

               const holdings: Holding[] = []
               lines.slice(1).forEach(line => {
                  if (!line.trim()) return
                  const [ticker, name, sharesStr, avgCostStr] = line.split(',')
                  const shares = parseFloat(sharesStr)
                  const avgCost = parseFloat(avgCostStr)

                  holdings.push({
                     ticker,
                     name,
                     shares,
                     avgCost,
                     currentPrice: avgCost, // Temp
                     marketValue: shares * avgCost, // Temp
                     unrealizedPnl: 0,
                     exchange: ticker.includes('.TW') ? 'TWSE' : 'US'
                  })
               })

               const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0)

               const newPortfolio: Portfolio = {
                 id: Math.random().toString(36).substring(7),
                 name: file.name.replace('.csv', ''),
                 baseCurrency: 'TWD',
                 holdings,
                 totalValue,
                 valueDate: new Date().toISOString()
               }

               get().addPortfolio(newPortfolio)
               await get().refreshQuotes() // Trigger update-quote automatically
               resolve()
            }
            reader.readAsText(file)
         })
      }
    }),
    { name: 'portfolio-store' }
  )
)
