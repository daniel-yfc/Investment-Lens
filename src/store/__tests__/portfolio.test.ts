import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { usePortfolioStore } from '../portfolio';
import type { PortfolioState } from '../portfolio';
import { Portfolio } from '@/types/portfolio.types';

const mockPortfolio: Portfolio = {
  id: 'p1',
  name: 'Test Portfolio',
  baseCurrency: 'TWD',
  holdings: [
    {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      avgCost: 150,
      currentPrice: 150,
      marketValue: 1500,
      unrealizedPnl: 0,
      exchange: 'US'
    }
  ],
  totalValue: 1500,
  valueDate: new Date().toISOString()
};

describe('usePortfolioStore', () => {
  beforeEach(() => {
    usePortfolioStore.setState({
      portfolios: [],
      activePortfolioId: null,
      isRefreshing: false,
      lastUpdated: null,
    });
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct initial state', () => {
    const state = usePortfolioStore.getState();
    expect(state.portfolios).toEqual([]);
    expect(state.activePortfolioId).toBeNull();
    expect(state.isRefreshing).toBe(false);
    expect(state.lastUpdated).toBeNull();
  });

  describe('addPortfolio', () => {
    it('should add a portfolio and set it as active', () => {
      usePortfolioStore.getState().addPortfolio(mockPortfolio);

      const state = usePortfolioStore.getState();
      expect(state.portfolios).toHaveLength(1);
      expect(state.portfolios[0]).toEqual(mockPortfolio);
      expect(state.activePortfolioId).toBe('p1');
    });
  });

  describe('setActivePortfolio', () => {
    it('should set active portfolio id', () => {
      usePortfolioStore.getState().addPortfolio(mockPortfolio);
      usePortfolioStore.getState().setActivePortfolio('p1');

      expect(usePortfolioStore.getState().activePortfolioId).toBe('p1');
    });
  });

  describe('removePortfolio', () => {
    it('should remove a portfolio by id', () => {
      usePortfolioStore.getState().addPortfolio(mockPortfolio);
      usePortfolioStore.getState().addPortfolio({ ...mockPortfolio, id: 'p2' });

      expect(usePortfolioStore.getState().portfolios).toHaveLength(2);

      usePortfolioStore.getState().removePortfolio('p1');

      const state = usePortfolioStore.getState();
      expect(state.portfolios).toHaveLength(1);
      expect(state.portfolios[0].id).toBe('p2');
    });
  });

  describe('refreshQuotes', () => {
    it('should set isRefreshing to true while fetching', async () => {
      usePortfolioStore.getState().addPortfolio(mockPortfolio);

      let resolveFetch: any;
      global.fetch = vi.fn().mockReturnValue(new Promise(resolve => {
        resolveFetch = resolve;
      }));

      const promise = usePortfolioStore.getState().refreshQuotes();

      expect(usePortfolioStore.getState().isRefreshing).toBe(true);

      resolveFetch({ ok: true, json: () => Promise.resolve({}) });
      await promise;

      expect(usePortfolioStore.getState().isRefreshing).toBe(false);
    });

    it('should update portfolio and lastUpdated on successful fetch', async () => {
      usePortfolioStore.getState().addPortfolio(mockPortfolio);

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          status: 'completed',
          result: {
            totalValue: 2000,
            holdings: [
              { ...mockPortfolio.holdings[0], currentPrice: 200, marketValue: 2000, unrealizedPnl: 500 }
            ]
          }
        })
      });

      await usePortfolioStore.getState().refreshQuotes();

      const state = usePortfolioStore.getState();
      expect(state.portfolios[0].totalValue).toBe(2000);
      expect(state.portfolios[0].holdings[0].currentPrice).toBe(200);
      expect(state.lastUpdated).not.toBeNull();
    });

    it('should handle fetch errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));

      try {
          await usePortfolioStore.getState().refreshQuotes();
      } catch (e) {
          // ignore
      }

      expect(usePortfolioStore.getState().isRefreshing).toBe(false);
    });
  });

  describe('updateHolding', () => {
    it('should call updateHolding logic (currently mocked)', () => {
      // The implementation is currently empty, but we can verify it doesn't crash
      expect(() => {
        usePortfolioStore.getState().updateHolding('p1', mockPortfolio.holdings[0]);
      }).not.toThrow();
    });
  });

  describe('importFromCSV', () => {
    it('should parse CSV and add new portfolio', async () => {
      const csvContent = `Ticker,Name,Shares,AvgCost
AAPL,Apple Inc.,10,150
2330.TW,TSMC,1000,500`;

      // Mock File
      const file = new File([csvContent], 'test_portfolio.csv', { type: 'text/csv' });

      // Mock FileReader
      class MockFileReader {
        onload: any;
        readAsText() {
          if (this.onload) {
            this.onload({ target: { result: csvContent } });
          }
        }
      }
      global.FileReader = MockFileReader as any;

      // Mock refreshQuotes so we don't actually fetch
      const refreshQuotesSpy = vi.fn().mockResolvedValue(undefined);
      usePortfolioStore.setState({ refreshQuotes: refreshQuotesSpy as any });

      await usePortfolioStore.getState().importFromCSV(file);

      const state = usePortfolioStore.getState();
      expect(state.portfolios).toHaveLength(1);
      const imported = state.portfolios[0];

      expect(imported.name).toBe('test_portfolio');
      expect(imported.holdings).toHaveLength(2);
      expect(imported.holdings[0].ticker).toBe('AAPL');
      expect(imported.holdings[0].shares).toBe(10);
      expect(imported.holdings[0].exchange).toBe('US');
      expect(imported.holdings[1].ticker).toBe('2330.TW');
      expect(imported.holdings[1].shares).toBe(1000);
      expect(imported.holdings[1].exchange).toBe('TWSE');

      expect(refreshQuotesSpy).toHaveBeenCalled();
    });
  });
});
