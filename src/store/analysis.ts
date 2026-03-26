import { create } from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvestmentSignal = any;

interface AnalysisState {
  currentSymbol: string | null;
  result: InvestmentSignal | null; // Placeholder for InvestmentSignal
  isAnalyzing: boolean;
  setCurrentSymbol: (symbol: string | null) => void;
  setResult: (result: InvestmentSignal | null) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentSymbol: null,
  result: null,
  isAnalyzing: false,
  setCurrentSymbol: (currentSymbol) => set({ currentSymbol }),
  setResult: (result) => set({ result }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
}));
