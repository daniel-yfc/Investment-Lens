# 系統測試案例 (Testing Cases)

本文件列出了 Investment-Lens Web 專案的測試案例，涵蓋單元測試、整合測試與端到端(E2E)測試。

## 16.1 單元測試（Unit Testing）

### AnalysisResultCard 元件
- **TC-001**: `isStreaming=true` 時顯示 Skeleton，不顯示評級徽章
- **TC-002**: Buy 評級顯示 emerald 左邊框
- **TC-003**: `confidence=Low` 顯示警示列
- **TC-004**: 點擊展開按鈕後顯示 L2 內容

### ChatStore 狀態管理
- **TC-010**: `setStreaming(false)` + `streamError` 在 stream 中斷時正確設定
- **TC-011**: `retryLastMessage` 遞增 `retryCount`

### RiskBadge 元件
- **TC-020**: critical 等級套用 rose-700 底色
- **TC-021**: tooltip 存在時渲染 title 屬性

## 16.2 整合測試（Integration Testing）

### /api/v1/chat/stream 路由
- **TC-030**: 正常回應包含 `text/event-stream` Content-Type
- **TC-031**: 缺少 JWT 回傳 401
- **TC-032**: 超過速率限制回傳 429

### DataProviderChain (資料源備援)
- **TC-040**: P1 失敗時自動切換至 P2
- **TC-041**: 所有源失敗時回傳 stale 快取並標記 `_stale=true`

## 16.3 端到端測試（E2E Testing - Playwright）

### 證券分析完整流程
- **TC-050**: 輸入股票代碼後顯示 `AnalysisResultCard`（Happy Path），無 CLS
- **TC-051**: Stream 中斷時顯示部分結果與重試按鈕
- **TC-052**: L1→L2 展開不發生 CLS

### 認證流程
- **TC-060**: 未登入者存取 `/portfolio` 重導 `/login`

### 效能量測
- **TC-070**: 首頁 LCP < 2500ms
