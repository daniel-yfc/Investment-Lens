import { create } from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PortfolioPosition = any;

interface PortfolioState {
  activePortfolioId: string | null;
  positions: PortfolioPosition[]; // Placeholder for PortfolioPosition array
  totalValue: number;
  currency: string;
  isUpdating: boolean;
  setActivePortfolio: (id: string | null) => void;
  setPositions: (positions: PortfolioPosition[]) => void;
  updateTotalValue: (value: number) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  activePortfolioId: null,
  positions: [],
  totalValue: 0,
  currency: 'TWD',
  isUpdating: false,
  setActivePortfolio: (activePortfolioId) => set({ activePortfolioId }),
  setPositions: (positions) => set({ positions }),
  updateTotalValue: (totalValue) => set({ totalValue }),
}));
