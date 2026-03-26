export const dictionaries = {
  'zh-TW': {
    chat: {
      placeholder: '輸入想分析的股票代號，例如 2330.TW 或 AAPL...',
      welcome: '歡迎使用 Investment-Lens',
      welcomeSub: '請輸入你想分析的股票代號，例如 2330.TW',
      send: '發送',
      streamInterrupted: '⚠️ 回應中斷，以上為已接收內容。',
      analyzing: '正在執行分析程序...',
      analysisComplete: '分析程序已完成',
      errorOccurred: '發生錯誤',
    },
    analysis: {
      recommendation: {
        Buy: '買進',
        Hold: '持有',
        Sell: '賣出',
        Neutral: '中立'
      },
      confidence: {
        High: '高',
        Medium: '中',
        Low: '低'
      },
      lowConfidenceWarning: '⚠️ 信心度低，請審慎參考',
      keyRisks: '主要風險',
      killConditions: '論點失效條件 (Kill Conditions)',
      expand: '展開詳細分析',
      collapse: '收合詳細分析',
      export: '匯出',
      thesis: '投資論點',
      counterThesis: '反向論點'
    },
    portfolio: {
      title: '投資組合',
      uploadCSV: '上傳 CSV',
      refreshQuotes: '更新報價',
      heatmap: '持倉熱力圖',
      metric: {
        pnl_pct: '損益 %',
        weight: '權重',
        volatility: '波動率',
        beta: 'Beta'
      }
    }
  },
  'en': {
    chat: {
      placeholder: 'Enter a ticker to analyze, e.g., AAPL or MSFT...',
      welcome: 'Welcome to Investment-Lens',
      welcomeSub: 'Please enter a ticker symbol to analyze, e.g., AAPL',
      send: 'Send',
      streamInterrupted: '⚠️ Response interrupted. Showing received content.',
      analyzing: 'Executing analysis procedure...',
      analysisComplete: 'Analysis complete',
      errorOccurred: 'An error occurred',
    },
    analysis: {
      recommendation: {
        Buy: 'Buy',
        Hold: 'Hold',
        Sell: 'Sell',
        Neutral: 'Neutral'
      },
      confidence: {
        High: 'High',
        Medium: 'Medium',
        Low: 'Low'
      },
      lowConfidenceWarning: '⚠️ Low confidence. Please reference with caution.',
      keyRisks: 'Key Risks',
      killConditions: 'Kill Conditions',
      expand: 'Expand Details',
      collapse: 'Collapse Details',
      export: 'Export',
      thesis: 'Thesis',
      counterThesis: 'Counter Thesis'
    },
    portfolio: {
      title: 'Portfolio',
      uploadCSV: 'Upload CSV',
      refreshQuotes: 'Refresh Quotes',
      heatmap: 'Holdings Heatmap',
      metric: {
        pnl_pct: 'P&L %',
        weight: 'Weight',
        volatility: 'Volatility',
        beta: 'Beta'
      }
    }
  }
}

export type Dictionary = typeof dictionaries['zh-TW']
