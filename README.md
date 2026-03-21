# 📊 Investment Lens

> 機構等級的投資分析框架，作為 Claude Code Skill 運行。
> 支援個股、ETF、加密貨幣、全天候投資組合，整合 ISO 10962 CFI 資產分類與台灣投資人稅務優化。

---

## 什麼是 Investment Lens？

Investment Lens 是一套結構化的投資分析 Skill，設計給在 Claude Code 中工作的投資人與分析師使用。啟用後，Claude 會依據輸入（個股代碼、ETF、加密貨幣、投資組合 CSV 或組合描述）自動路由至對應的分析框架，載入估值模型、投資哲學、反偏見檢查表，並輸出具備明確操作建議的結構化報告。

本框架強制執行**批判性思維流程**：每份報告都包含 Pre-Mortem 失敗路徑分析、多維反偏見稽核，以及具體的監控計畫。持倉管理面則透過 ISO 10962:2021 CFI 代碼標準化資產分類，搭配 `value_date` 機制確保報價新鮮度，並以 `/update-quote` Skill 實現一鍵刷新。

---

## 功能亮點

- **四大資產類型全覆蓋**：個股 / ETF 與市場指數 / 比特幣與加密貨幣 / 全天候投資組合
- **六大投資哲學路由**：根據資產特性自動選擇適配的分析視角
- **六種估值模型工具箱**：DCF、相對估值、週期調整等多大師模型並用
- **ISO 10962:2021 CFI 資產分類**：國際標準 CFI 代碼映射，自動歸類至全天候五大資產類別
- **強制反偏見稽核**：每次分析結束後自動執行，輸出 🔴🟡✅ 風險信號
- **Pre-Mortem 失敗路徑**：至少 3 條失敗場景，含觸發條件與 Kill Condition
- **台灣投資人稅務優化**：二代健保補充保費試算、海外所得 750 萬門檻監控、股利抵減優化
- **eToro 智慧組合解構**：The-Chameleon / Target2030-FT / Momentum-LS 自動解構後歸類
- **value_date 報價新鮮度管控**：自動判斷報價是否過期並分級警示
- **`/update-quote` 一鍵刷新**：自動查詢最新報價，重新計算市值與損益，更新 `value_date`
- **快速模式 / 深度模式**：依可用時間選擇 15–20 分鐘快速掃描或 45–60 分鐘完整深潛

---

## 適用情境

| 你的需求 | Investment Lens 的對應 |
|---------|----------------------|
| 分析 AAPL、台積電財報與買賣點 | 個股財報深度分析框架 |
| 評估 VOO、0050、QQQ 當前位置 | 市場資產分析框架 |
| 判斷 BTC 是否接近週期底部 | BTC 底部週期模型 |
| 診斷現有投資組合並比對全天候配置 | 全天候組合診斷框架（含 eToro 解構）|
| 計算台股持倉的二代健保負擔 | 台灣稅務優化模組 |
| 查詢持倉的 CFI 代碼與資產類別 | ISO 10962 資產分類參考表 |
| 一鍵刷新多平台持倉的最新報價 | `/update-quote` Skill |
| 不確定如何輸入組合資訊 | 組合輸入格式引導（A/B/C/D 四格式）|

---

## 快速開始

### 安裝

本專案包含兩個 Project-level Skill，放置於 `.claude/skills/` 目錄下即可被 Claude Code 自動發現。

**步驟一：Clone 至你的專案**

```bash
git clone https://github.com/daniel-yfc/investment-lens.git
cd your-project
cp -r investment-lens/.claude .claude
```

**步驟二：確認目錄結構**

```
your-project/
└── .claude/
    └── skills/
        ├── investment-lens/
        │   ├── SKILL.md
        │   ├── assets/
        │   │   └── portfolio-template.md
        │   └── references/
        │       ├── instruction.md
        │       ├── asset-classification.md      ← ISO 10962 CFI 分類表
        │       ├── tech-earnings-deepdive.md
        │       ├── market-asset-analysis.md
        │       ├── all-seasons-portfolio.md
        │       ├── btc-bottom-model.md
        │       ├── investing-philosophies.md
        │       ├── investing-philosophies-ref.md
        │       ├── valuation-models.md
        │       ├── bias-checklist.md
        │       ├── market-bias-checklist.md
        │       ├── macro-liquidity.md
        │       └── us-value-investing.md
        └── update-quote/
            └── SKILL.md
```

**步驟三：開始使用**

```
# 分析個股（自動觸發）
幫我分析一下台積電目前的估值狀況

# 直接呼叫
/investment-lens NVDA

# 更新組合報價
/update-quote [貼上 CSV 內容]
```

---

## Skills 說明

### `investment-lens` — 投資分析主框架

Claude 偵測到以下關鍵字時自動啟用，無需手動呼叫：

- 個股代碼或名稱（AAPL、TSMC、台積電、2330…）
- ETF 或指數代碼（VOO、0050、QQQ、00878…）
- 加密貨幣（BTC、ETH、比特幣…）
- 組合相關語意（全天候、資產配置、退休規劃、組合診斷…）
- 台灣稅務關鍵字（二代健保、補充保費、海外所得、750萬、股利抵減…）
- CFI 查詢（CFI 代碼、ISO 10962、資產分類…）

**手動呼叫：**

```
/investment-lens [分析目標]

/investment-lens NVDA
/investment-lens 我的全天候組合
/investment-lens BTC 目前值得買嗎
```

**選擇分析深度：**

| 模式 | 個股 | ETF／指數 | 投資組合 |
|------|------|----------|---------|
| **快速模式** | 約 15 分鐘 | 約 20 分鐘 | 快速掃描 |
| **深度模式** | 約 60 分鐘 | 約 45 分鐘 | 含稅務優化 |

---

### `update-quote` — 報價更新 Skill

接收投資組合 CSV，自動查詢最新報價，重新計算市值、未實現損益與報酬率，在頁首記錄 `value_date`。

**觸發方式：**

```
/update-quote [貼上 CSV 內容]

# 僅更新單一標的
更新 GOOG 報價

# 同時更新匯率
更新匯率：USD=32.5，然後重新計算所有台幣市值
```

**報價來源分層策略：**

| 資產類別 | CFI 代碼 | 查詢格式 | 來源 | 自動化 |
|---------|---------|---------|------|--------|
| 台股 ETF / 個股 | CEOGDU / ESVUFR | `{代碼}.TW` | Yahoo Finance | ✅ 自動 |
| 台股債券 ETF（00720B） | CEOBDU | `00720B.TW` | Yahoo Finance | ✅ 自動 |
| 美股個股 / ETF | ESVUFR / CEORDU / EDSXFR | 直接代碼 | Yahoo Finance | ✅ 自動 |
| 歐股（EUR） | ESVUFR | `LDO.MI`、`ABN.AS` | Yahoo Finance | ✅ 自動 |
| 澳股（AUD） | ESVUFR | `ANZ.AX` | Yahoo Finance | ✅ 自動 |
| 加密貨幣 | CIOGBU | CoinGecko API | CoinGecko | ✅ 自動 |
| 匯率 | — | USD/EUR/AUD 對台幣 | 台銀牌告匯率 | ✅ 自動 |
| 境內基金（TW000T 系列） | CMOGEU / CFOGEU | ISIN 查詢 | 投信投顧公會 | ⚠️ T+1 手動 |
| 境外基金（LU / IE ISIN） | CEOGEU / CMOGEU | 各基金公司官網 | 無統一 API | ❌ 手動 |
| eToro 智慧投資組合 | CIOGMU / CIOGLU / CIOIMU | 需登入確認 | eToro 平台 | ❌ 手動 |

**報價過期警示：**

| 距 `value_date` 天數 | 警示 | 系統行為 |
|---------------------|------|---------|
| ≤ 1 個交易日 | ✅ 新鮮 | 直接分析 |
| 2–3 個交易日 | 🟡 稍舊 | 提示建議更新，可選擇繼續 |
| 4–7 個交易日 | 🟠 過期 | 警告，建議先執行 `/update-quote` |
| > 7 個交易日 | 🔴 嚴重過期 | 強制提示，分析結論加註「基於過期報價，僅供參考」 |

> **關於 Stock Events**：[stockevents.app](https://stockevents.app) 是優質的盯盤與股息事件追蹤工具，但**無公開 API 且不支援持倉市值匯出**，無法作為自動報價來源。建議作為並行的日常盯盤工具使用。

---

## 分析輸出結構

**所有分析類型的標準輸出：**

1. **結論首行** — 操作建議 + 信心水準 + 核心驅動力（一句話摘要）
2. **估值判斷** — 採用的估值方法與當前價格所處位置
3. **Pre-Mortem** — ≥ 3 條失敗路徑，含各自的觸發信號與 Kill Condition
4. **反偏見結果** — 🔴 紅旗 / 🟡 黃旗 / ✅ 綠燈，附驗證依據
5. **監控計畫** — 下次檢視時間 + 關鍵觀察指標

**投資組合分析額外輸出：**

6. **偏離度診斷** — 現況配置 vs 全天候標準配置的百分比差距（含 eToro 智慧組合解構後數值）
7. **稅務優化建議** — 二代健保試算 + 海外所得管理 + 執行優先順序

---

## 框架架構

```
Investment Lens v3.1
│
├── Layer 0：資產分類基礎（新增）
│   └── asset-classification.md     ISO 10962:2021 CFI 完整對照表 v1.0
│
├── Layer 1：主要分析框架（依資產類型路由）
│   ├── tech-earnings-deepdive.md   個股財報深度分析 v5.0
│   ├── market-asset-analysis.md    市場/ETF/資產配置分析 v1.0
│   ├── all-seasons-portfolio.md    全天候組合診斷與建構 v1.2
│   └── btc-bottom-model.md         比特幣週期底部判斷 v2.0
│
├── Layer 2：方法工具箱（與主框架同步載入）
│   ├── investing-philosophies.md   6大投資哲學（個股專用）v3.0
│   ├── investing-philosophies-ref.md 6大投資哲學（市場/組合通用）v2.1
│   └── valuation-models.md         多大師估值模型工具箱 v2.0
│
├── Layer 3：專家模組（條件觸發）
│   ├── macro-liquidity.md          宏觀流動性監控（Key Force = 宏觀時載入）
│   └── us-value-investing.md       美股價值投資四維評分（深度美股分析時載入）
│
├── 反偏見系統（每次分析後強制執行）
│   ├── bias-checklist.md           個股／加密貨幣反偏見 v2.0
│   └── market-bias-checklist.md    市場配置反偏見 v1.0
│
└── 資產
    └── portfolio-template.md       組合輸入格式引導 v3.0（A/B/C/D 四格式）
```

---

## ISO 10962:2021 CFI 資產分類

本框架採用國際標準 CFI 代碼統一分類所有持倉，取代純文字「資產類別」欄位，確保分類一致性。常用代碼速查：

| CFI 代碼 | 資產類型 | 全天候映射 |
|---------|---------|-----------|
| `ESVUFR` / `ESVTFR` | 已開發市場大盤股（台股、美股、歐股） | 股票 30% |
| `EDSXFR` | 已開發市場個股（中概股 ADR） | 股票 30% |
| `ESNXFR` | 盤後交易標的 | 股票 30% |
| `CEOGDU` | 中小型股 / 主題型 ETF | 股票 30% |
| `CEORDU` | 大盤指數型 ETF（VOO） | 股票 30% |
| `CEOBDU` | 投資等級公司債 ETF（00720B） | 長期債券 40% |
| `CMOBDU` | 境內債券基金 | 中期債券 15% |
| `CBCIXU` | 貴金屬（黃金、白銀） | 黃金 7.5% |
| `CMXXXU` / `ESVUFR`（XLE） | 大宗商品 / 能源 ETF | 商品 7.5% |
| `CMOGEU` | 境內多重資產基金 | 混合 |
| `CFOGEU` | 目標日期基金 | 混合 |
| `CIOGLU` | 對沖基金策略（Momentum-LS） | 另類投資 |
| `CIOGMU` | 多重資產智慧組合（The-Chameleon） | 混合（需解構）|
| `CIOIMU` | 資本保護型產品（Target2030-FT ✅） | 混合（偏債券）|
| `CIOGBU` | 數位資產（BTC） | 另類（高風險）|

完整對照表見 `references/asset-classification.md`。

---

## 台灣投資人專屬功能

當分析內容涉及以下任一情境時，台灣稅務框架自動啟用：

- **台股代碼**（00xxx 系列、0050、2330 等）
- **稅務關鍵字**：二代健保、補充保費、海外所得、750 萬、股利抵減、8.5%

啟用後自動執行：

- **二代健保補充保費試算**：逐筆檢查配息是否超過 NT$20,000 單筆門檻，計算實際費用並提出安全持股上限
- **海外所得管理**：加總 eToro（全數為海外所得）+ 中信智投（境外基金）的年度已實現收益，監控 NT$750 萬最低稅負門檻
- **綜所稅優化比較**：台股股利（含抵減 8.5%）vs 海外累積型 ETF 的稅後實際報酬差異
- **執行優先順序**：考慮稅務成本後的最佳調整序列

---

## eToro 智慧組合說明

本框架支援以下三個 eToro Smart Portfolio 的深度分析與全天候解構：

| 組合 | CFI | 策略類型 | 管理人 | 全天候解構方式 |
|------|-----|---------|--------|--------------|
| The-Chameleon | `CIOGMU` | ETF 量化自適應 | Gioben Capital LLC | 依月報持倉拆分（SPY5.L 股票 + WGLD.L 黃金）|
| Target2030-FT | `CIOIMU` ✅ | 目標日期滑降路徑 | Franklin Templeton | 依滑降比例拆分（2026 年估 25% 股 / 75% 債）|
| Momentum-LS | `CIOGLU` | AI 多空動能 | eToro 量化部門 | 低市場相關性，歸入另類投資 |

> ✅ Target2030-FT 已確認適用 Capital Guarantee（`CIOIMU`）。

---

## 資料品質規範

| 等級 | 來源 | 使用方式 |
|------|------|---------|
| **Tier 1（必須引用）** | 央行、SEC、交易所、財政部等官方資料 | 所有核心數據必須來自此層級 |
| **Tier 2（可用）** | Bloomberg、Morningstar、FRED、S&P | 可作為補充與交叉驗證 |
| **Tier 3（僅供參考）** | 分析師報告、專業意見 | 不得作為結論依據 |

**明確禁止：** 趨勢外推、模糊描述、捏造數值、主觀詮釋台灣稅法、接受異常報價而不標記（如 BTC @ $31.05）。

---

## 專案結構

```
investment-lens/
├── README.md
├── .gitignore
└── .claude/
    └── skills/
        ├── investment-lens/
        │   ├── SKILL.md
        │   ├── assets/
        │   │   └── portfolio-template.md      v3.0
        │   └── references/
        │       ├── instruction.md
        │       ├── asset-classification.md    ISO 10962:2021 v1.0
        │       ├── tech-earnings-deepdive.md
        │       ├── market-asset-analysis.md
        │       ├── all-seasons-portfolio.md
        │       ├── btc-bottom-model.md
        │       ├── investing-philosophies.md
        │       ├── investing-philosophies-ref.md
        │       ├── valuation-models.md
        │       ├── bias-checklist.md
        │       ├── market-bias-checklist.md
        │       ├── macro-liquidity.md
        │       └── us-value-investing.md
        └── update-quote/
            └── SKILL.md
```

---

## 版本資訊

| 項目 | 內容 |
|------|------|
| 框架版本 | investment-lens v3.1 |
| portfolio-template | v3.0 |
| asset-classification | v1.0（ISO 10962:2021）|
| update-quote skill | v1.0 |
| 更新日期 | 2026-03-21 |
| 作者 | daniel-yf-chen |
| 語言 | 繁體中文（zh-TW）|
| 相容性 | Claude Code Skills（[agentskills.io](https://agentskills.io) 開放標準）|
| 授權 | Proprietary |

---

## 相關資源

- [Claude Code Skills 規格文件](https://code.claude.com/docs/en/skills)
- [Agent Skills 開放標準](https://agentskills.io/)
- [Claude Code 文件](https://docs.anthropic.com/en/docs/claude-code)
- [Stock Events — 日常盯盤工具](https://stockevents.app)（並行使用，非整合來源）
- [CoinGecko API](https://www.coingecko.com/en/api)（加密貨幣報價）
- [投信投顧公會基金查詢](https://www.fundclear.com.tw/)（境內基金 T+1 淨值）
- [台灣銀行牌告匯率](https://rate.bot.com.tw/xrt?Lang=zh-TW)（匯率更新來源）
- [ISO 10962:2021 CFI Standard](https://www.iso.org/standard/81140.html)（資產分類標準）

```
**變更摘要：**
| 檔案 | 版本 | 主要變更 |
|------|------|---------|
| `SKILL.md` | v3.0 → v3.1 | 移除無效 frontmatter（`license`/`metadata`/`compatibility`）；加入 `argument-hint`；新增 Step 6 `value_date` 檢查；新增 Step 7 eToro 智慧組合解構規則；Step 1 路由加入 CFI 查詢與 `/update-quote` 觸發；Data Integrity 加入異常報價禁止規則 |
| `README.md` | placeholder → v1.0 | 全新完整版；整合所有功能（CFI 分類、`update-quote`、eToro 三組合、`value_date`、Stock Events 定位說明、版本資訊）|
```