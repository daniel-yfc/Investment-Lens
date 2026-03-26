# Investment-Lens 系統開發計畫與任務分解

本文件整合自專案的 `Project_Phases.md`、`Milestones.md` 與 `Acceptance_Criteria.md`，提供映射 P0 到 P6 開發階段、對應里程碑與驗收標準的可執行任務清單。

---

## 階段 P0：基礎建設 (W1–W2)
**主要交付物**：專案骨架、Auth、DB、CI/CD、Tailwind 設定

### 任務清單 (Task Breakdown)
- [ ] 建立 Next.js 15 + TypeScript 5 專案 (`create-next-app --typescript`)
- [ ] 設定 Tailwind CSS v4 + shadcn/ui（含 2xl 斷點宣告）
- [ ] 整合 Auth.js 5（Google OAuth）
- [ ] 建立 Drizzle ORM + PostgreSQL Schema
- [ ] 設定 Upstash Redis 連接
- [ ] 設置 GitHub Actions CI/CD（lint → test → deploy）
- [ ] 建立 Zustand stores 骨架（chat / analysis / portfolio / ui）

### 相關驗收標準 (Acceptance Criteria)
- **FA-07**: 未登入者存取任何 `/dashboard/*` 路由，自動重導 `/login`
- **SE-01**: 未帶 JWT 呼叫 `/api/v1/*` 回傳 HTTP 401
- **SE-03**: CSP Header 正確設定（`script-src 'self'`），無 unsafe-inline

---

## 階段 P1：核心對話 (W3–W5)
**主要交付物**：SSE 串流、Zustand Chat Store、Skill Progress UI

### 任務清單 (Task Breakdown)
- [ ] 實作 `POST /api/v1/chat/stream`（Vercel AI SDK `streamText`）
- [ ] 開發 `useStreamingChat` hook 與 `handleStreamWithFallback` 邏輯
- [ ] 開發 `SkillProgressTracker` 元件
- [ ] 開發 `StreamingTextBlock` 元件（處理 Markdown 渲染）
- [ ] 開發 `GenerativeErrorBoundary` 元件以處理渲染錯誤
- [ ] 開發 `ChatInput` 與 `MessageFeed` 核心對話介面元件
- [ ] 實作 Stream 中斷的 Fallback 機制（指數退避重試）

### 對應里程碑 (Milestones)
- **M1**: 用戶可登入並送出訊息，收到 AI 串流回應（無 Skill）

### 相關驗收標準 (Acceptance Criteria)
- **FA-02**: SSE 串流首個 token 出現時間 < 2 秒（P95）
- **FA-04**: Stream 中斷時保留已接收部分回應，顯示 `[⚠️ 回應不完整]` 標示與重試按鈕，不發生白屏
- **PE-04**: CLS < 0.1（串流輸出不觸發版面位移）
- **PE-06**: Bundle size（first load JS）< 200KB（gzip）

---

## 階段 P2：分析引擎 (W6–W9)
**主要交付物**：`AnalysisResultCard` 元件、`investment-lens` 技能整合

### 任務清單 (Task Breakdown)
- [ ] 整合 `investment-lens` Mode A (Security Analysis)
- [ ] 開發 `AnalysisResultCard`，支援 Buy/Hold/Sell/Neutral 等評級顯示
- [ ] 實作 `AnalysisResultCard` 的 L1/L2/L3 三層次漸進披露與無版面位移點擊展開
- [ ] 優化 API 與股票查詢效能
- [ ] 設置多語系架構，確保元件支援 zh-TW 與 en 切換

### 對應里程碑 (Milestones)
- **M2**: `investment-lens` Mode A 完整串流，顯示 `AnalysisResultCard`

### 相關驗收標準 (Acceptance Criteria)
- **FA-01**: 輸入任意全球股票代碼，15 秒內完成分析並顯示 `AnalysisResultCard`，包含正確評級
- **FA-06**: `AnalysisResultCard` L1/L2/L3 三層披露行為正常，點擊展開無版面位移
- **FA-08**: 所有頁面支援 zh-TW / en 語言切換，切換後 UI 完整翻譯
- **PE-05**: 股票查詢 API P95 回應時間 < 500ms

---

## 階段 P3：投資組合 (W10–W12)
**主要交付物**：`PortfolioHeatmap`、`update-quote` 技能、組合管理 UI

### 任務清單 (Task Breakdown)
- [ ] 開發投資組合管理 UI
- [ ] 實作投資組合 CSV 上傳與解析邏輯
- [ ] 整合 `update-quote` 技能以更新現行報價、NAV 與外匯匯率
- [ ] 開發 `PortfolioHeatmap` 視覺化持倉狀態熱力圖
- [ ] 實作重新整理後正確計算與顯示持倉市值的機制

### 對應里程碑 (Milestones)
- **M3**: 投資組合 CSV 上傳、報價更新、持倉熱力圖可用

### 相關驗收標準 (Acceptance Criteria)
- **FA-05**: 投資組合 CSV 上傳後正確解析並觸發 `update-quote`，重新整理後持倉市值正確更新

---

## 階段 P4：量化與信號 (W13–W15)
**主要交付物**：`quant-analysis` 整合、`SignalChainGraph`

### 任務清單 (Task Breakdown)
- [ ] 整合 `quant-analysis` 技能提供量化風險運算支援 (VaR, 最佳化等)
- [ ] 實現跨技能無縫串連（例如：investment-lens 將結果交付給 quant-analysis）
- [ ] 開發 `SignalChainGraph` 元件，將複雜信號鏈條視覺化呈現
- [ ] 更新 `SkillProgressTracker` 以準確反映多步驟與多技能流程進度

### 對應里程碑 (Milestones)
- **M4**: `quant-analysis` + `SignalChainGraph` 完整串接

### 相關驗收標準 (Acceptance Criteria)
- **FA-03**: 多技能串接（investment-lens → quant-analysis）執行完整，`SkillProgressTracker` 所有步驟正確更新

---

## 階段 P5：報告輸出 (W16–W17)
**主要交付物**：`alphaear-reporter`、PDF 匯出、報告閱讀器

### 任務清單 (Task Breakdown)
- [ ] 整合 `alphaear-reporter` 技能，產生專業研究筆記與投資報告
- [ ] 實作並整合客戶端或後端 PDF 匯出功能
- [ ] 開發報告閱讀器 UI 供用戶在應用內閱覽長篇文檔與報告
- [ ] 確保長文本或大範圍內容產生之效能與安全性

### 相關驗收標準 (Acceptance Criteria)
- **SE-02**: (跨所有串流與大篇幅生成) AI 對話超過 20 messages/min 回傳 HTTP 429

---

## 階段 P6：效能與上線 (W18–W19)
**主要交付物**：CWV 調校、E2E 測試、安全稽核、Vercel 生產部署

### 任務清單 (Task Breakdown)
- [ ] 進行全系統的 Core Web Vitals (CWV) 效能調校
- [ ] 改善元件渲染、延遲加載資源以優化 LCP 及 Accessibility 指標
- [ ] 撰寫並執行端到端 (E2E) 測試套件
- [ ] 使用 ZAP 或同等工具進行 OWASP Top 10 基本安全掃描
- [ ] 設定 Vercel 生產部署環境並進行上線發布

### 對應里程碑 (Milestones)
- **M5**: Lighthouse Performance ≥ 90，所有 CWV 達標
- **M6**: 生產環境部署，通過安全稽核

### 相關驗收標準 (Acceptance Criteria)
- **PE-01**: Lighthouse 桌機版 Performance 分數 ≥ 90
- **PE-02**: Lighthouse 桌機版 Accessibility 分數 ≥ 95
- **PE-03**: LCP < 2.5s（Vercel Analytics 量測，P75）
- **SE-04**: OWASP Top 10 基本掃描通過（使用 ZAP 或同等工具）
