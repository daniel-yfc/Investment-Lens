# 📊 Financial AI Agent Skills Repository

> 專為 Claude Code 設計的專業金融投資分析與量化研究 Skills 集合。
> 涵蓋從總體資產配置、個股 DCF 估值、機構級研究報告撰寫，到量化分析與市場訊號追蹤的全方位金融工具。

---

## 什麼是此專案？

這是一個針對 Claude Code 等 AI Agent 設計的專業金融技能（Skills）庫。每個 Skill 都是一個獨立的代理工具，具備明確的範圍、專門的 prompt 以及嚴格的工作流程，旨在讓 AI 能夠執行複雜、機構等級的金融分析任務。

此專案整合了傳統基本面分析、量化投資組合最佳化、市場新聞情緒追蹤以及符合國際標準（如 ISO 10962 CFI）的資產分類系統。

---

## 核心技能套件 (Skill Suites)

此儲存庫包含多個針對不同金融分析面向的 Skills 子系統：

### 📈 1. 投資分析與資產配置 (Investment & Asset Allocation)
- **`investment-lens`**：多資產投資分析主框架。提供質化與概念性的全天候 (All-Seasons) 投資組合診斷、個股反偏見分析。支援台灣投資人稅務優化與 CFI 資產分類。
- **`asset-allocation`**：基於 CFA 框架的個人財富管理與資產配置顧問。涵蓋風險評估、目標規劃與個人化投資組合建構。
- **`update-quote`**：報價更新工具。自動更新 CSV 投資組合檔案中的市場報價、淨值與匯率，支援多種資產類別。

### 🏢 2. 機構級公司研究 (Institutional Corporate Research)
- **`initiating-coverage`**：建立機構級首次涵蓋研究報告 (Initiation Reports) 的 5 步驟嚴謹工作流程（公司研究、財務建模、估值分析、圖表生成、報告組裝）。
- **`dcf-model`**：建立獨立、無公式錯誤的 Excel (.xlsx) 貼現現金流 (DCF) 估值模型，包含完整的 WACC 計算與敏感度分析。
- **`datapack-builder`**：從 CIM、SEC 備案等來源萃取資料，建構符合投資委員會標準的標準化 Excel 數據包。
- **`investor-materials`**：建立與更新募資簡報、投資人備忘錄與財務預測等創投/私募文件。

### 🧮 3. 量化與數據分析 (Quantitative & Data Analysis)
- **`quant-analysis`**：使用 Python/Jupyter 執行的量化金融分析。支援投資組合最佳化、數學風險建模 (VaR, GARCH) 與時間序列計量經濟學。
- **`value-at-risk-calculator`**：專門計算風險值 (VaR) 與相關金融風險指標的計算工具。

### 📡 4. AlphaEar 市場情報系統 (AlphaEar Intelligence System)
- **`alphaear-deepear-lite`**：從 DeepEar Lite 儀表板獲取最新的金融訊號與傳導鏈路分析。
- **`alphaear-news`**：獲取熱門財經新聞、市場趨勢與預測數據（如 Polymarket）。
- **`alphaear-sentiment`**：使用 FinBERT 或 LLM 分析財經文本的市場情緒。
- **`alphaear-stock`**：搜尋 A股/港股/美股 代碼，並獲取原始的歷史股價 (OHLCV) 數據。
- **`alphaear-signal-tracker`**：追蹤投資訊號的演變，根據最新市場資訊更新邏輯。
- **`alphaear-predictor`**：使用 Kronos 進行市場時間序列預測。
- **`alphaear-search`**：執行金融網頁搜尋與本地 RAG 上下文搜尋。
- **`alphaear-reporter`**：將分散的金融訊號叢集，編寫並編輯成結構化的財經報告。
- **`alphaear-logic-visualizer`**：建立視覺化的金融邏輯圖（如 Draw.io XML）以解釋複雜的傳導鏈路。

### 🛠️ 5. 開發工具 (Development Tools)
- **`skill-creator`**：建立或更新 AgentSkills，用於設計、建構與打包包含腳本和參考資料的新 Skills。

---

## 快速開始

### 安裝

這些 Skills 設計為放置於專案層級的 `.claude/skills/` 目錄中，讓 Claude Code 能夠自動發現並載入。

**步驟一：Clone 至你的專案**

```bash
git clone https://github.com/daniel-yfc/investment-lens.git  # 或此專案的實際 URL
cd your-project
mkdir -p .claude/
cp -r investment-lens/skills .claude/
```

**步驟二：確認目錄結構**

```
your-project/
└── .claude/
    └── skills/
        ├── alphaear-news/
        ├── asset-allocation/
        ├── dcf-model/
        ├── initiating-coverage/
        ├── investment-lens/
        ├── quant-analysis/
        ├── ... (其他 skills)
```

**步驟三：開始使用**

啟動 Claude Code 後，根據你的需求直接給予指令或呼叫對應的 Skill：

```
# 質化分析個股與市場
幫我分析一下台積電目前的估值狀況 (自動觸發 investment-lens)

# 建立量化 Excel 模型
請幫我建立 AAPL 的 DCF 估值 Excel 模型 (自動觸發 dcf-model)

# 獲取原始市場數據
幫我抓取特斯拉過去一個月的原始歷史股價 (自動觸發 alphaear-stock)
```

---

## Skills 協作與邊界 (Skill Boundaries)

為了確保 AI Agent 能夠準確選擇正確的工具，各 Skill 之間有著嚴格的使用邊界：

- **個股與市場質化分析** 👉 使用 `investment-lens`
- **獲取原始歷史股價數據** 👉 使用 `alphaear-stock` (非 investment-lens)
- **建立 Excel (.xlsx) 財務估值模型** 👉 使用 `dcf-model` (非 investment-lens)
- **撰寫完整的 5 步驟機構級研究報告** 👉 使用 `initiating-coverage` (非 alphaear-reporter)
- **個人 CFA 財富與退休資產配置** 👉 使用 `asset-allocation` (非 investment-lens)
- **程式化 (Python/Jupyter) 演算法投資組合最佳化** 👉 使用 `quant-analysis` (非 asset-allocation)

---

## 專案標準與相容性

- **相容性**：支援 Claude Code Skills（符合 [Agent Skills 開放標準](https://agentskills.io/)）。
- **目錄結構**：每個 Skill 皆包含一個定義範圍與觸發條件的 `SKILL.md`，並可包含輔助的參考文件 (`references/`)、腳本 (`scripts/`) 與資產 (`assets/`)。
- **授權**：Proprietary
- **語言**：主要支援繁體中文 (zh-TW) 與英文指令。

---

## 相關資源

- [Claude Code Skills 規格文件](https://code.claude.com/docs/en/skills)
- [Agent Skills 開放標準](https://agentskills.io/)
- [Claude Code 文件](https://docs.anthropic.com/en/docs/claude-code)
