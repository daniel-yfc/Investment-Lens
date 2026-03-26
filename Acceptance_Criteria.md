# 系統驗收標準 (Acceptance Criteria)

本文件列出了 Investment-Lens Web 專案的驗收標準，包含功能、效能與安全三個面向。

## 15.1 功能驗收 (Functional Acceptance)

- `[ ]` **FA-01**：輸入任意全球股票代碼（如 `2330.TW`、`AAPL`、`7203.T`），15 秒內完成分析並顯示 `AnalysisResultCard`，包含 Buy/Hold/Sell/Neutral 評級
- `[ ]` **FA-02**：SSE 串流首個 token 出現時間 < 2 秒（P95）
- `[ ]` **FA-03**：多技能串接（investment-lens → quant-analysis）執行完整，`SkillProgressTracker` 所有步驟正確更新
- `[ ]` **FA-04**：Stream 中斷時保留已接收部分回應，顯示 `[⚠️ 回應不完整]` 標示與重試按鈕，不發生白屏
- `[ ]` **FA-05**：投資組合 CSV 上傳後正確解析並觸發 `update-quote`，重新整理後持倉市值正確更新
- `[ ]` **FA-06**：`AnalysisResultCard` 的 L1/L2/L3 三層披露行為正常，點擊展開無版面位移
- `[ ]` **FA-07**：未登入者存取任何 `/dashboard/*` 路由，自動重導 `/login`
- `[ ]` **FA-08**：所有頁面支援 zh-TW / en 語言切換，切換後 UI 完整翻譯

## 15.2 效能驗收 (Performance Acceptance)

- `[ ]` **PE-01**：Lighthouse 桌機版 Performance 分數 ≥ 90
- `[ ]` **PE-02**：Lighthouse 桌機版 Accessibility 分數 ≥ 95
- `[ ]` **PE-03**：LCP < 2.5s（Vercel Analytics 量測，P75）
- `[ ]` **PE-04**：CLS < 0.1（串流輸出不觸發版面位移）
- `[ ]` **PE-05**：股票查詢 API P95 回應時間 < 500ms
- `[ ]` **PE-06**：Bundle size（first load JS）< 200KB（gzip）

## 15.3 安全驗收 (Security Acceptance)

- `[ ]` **SE-01**：未帶 JWT 呼叫 `/api/v1/*` 回傳 HTTP 401
- `[ ]` **SE-02**：AI 對話超過 20 messages/min 回傳 HTTP 429
- `[ ]` **SE-03**：CSP Header 正確設定（`script-src 'self'`），無 unsafe-inline
- `[ ]` **SE-04**：OWASP Top 10 基本掃描通過（使用 ZAP 或同等工具）
