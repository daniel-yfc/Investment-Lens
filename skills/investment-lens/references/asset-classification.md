---
name: asset-classification
description: ISO 10962:2021 CFI 代碼資產分類標準參考表。用於將持倉標的映射至標準化資產類別，供組合診斷、全天候配置比對、eToro 智慧投資組合解構使用。
version: 1.0
last_updated: 2026-03-21
standard: ISO 10962:2021 (CFI Codes)
---

# 資產分類標準參考 — ISO 10962:2021 CFI Codes

本文件依 ISO 10962:2021《金融工具分類代碼（CFI）》標準，建立 Investment Lens 框架的資產分類對照表。所有持倉標的均應對應至本表的 CFI 代碼與資產類別，確保組合診斷、全天候配置比對、稅務分類的一致性。

> **完整持倉清單請使用 CSV 檔案版本**（`assets/portfolio-snapshot.csv`）。

---

## CFI 代碼完整對照表

### 權益類（Equity）

| CFI 代碼 | 資產類別 | 類別細項 | 說明與代表標的 | 性質 | 全天候映射 |
|---------|---------|---------|-------------|------|-----------|
| `ESVTFR` | 權益 | 已開發市場大盤股 (Developed Large-Cap) | S&P 500 (US)、STOXX 600 (Europe)、Nikkei 225 (Japan) | 高流動性、相對穩健 | **股票 30%** |
| `ESVUFR` | 權益 | 已開發市場大盤股（含台股） | TWSE 加權指數、元大台灣50（0050）、台積電（2330） | 高流動性、相對穩健 | **股票 30%** |
| `CEOGEU` | 權益 | 新興市場股票 (Emerging Markets) | MSCI Emerging Markets、台灣加權指數（TWSE）、滬深 300 | 高成長、高波動、受匯率影響 | **股票 30%** |
| `CEOGDU` | 權益 | 中小型股 (Small/Mid-Cap) | Russell 2000、VBK（Vanguard Small-Cap Growth ETF） | 成長潛力大，景氣敏感度極高 | **股票 30%** |
| `CEOGMU` | 權益 | 產業/主題型 (Sector/Thematic) | 科技（CIBR、SKYY）、醫療保健（LLY）、半導體 | 結構性趨勢帶動 | **股票 30%** |
| `CEOGBU` | 權益 | 私募股權 (Private Equity) | 槓桿收購（LBO）、風險投資（Venture Capital） | 流動性極低，溢價回報高 | 不適用（組合中無此類）|

---

### 固定收益類（Fixed Income）

| CFI 代碼 | 資產類別 | 類別細項 | 說明與代表標的 | 性質 | 全天候映射 |
|---------|---------|---------|-------------|------|-----------|
| `CEOGCU` | 固定收益 | 主權國家債券 (Sovereign Bonds) | 美國國債（US Treasuries）、德國公債（Bunds） | 市場避險（Risk-off）的終極資產 | **長期債券 40%** |
| `CEOJEU` | 固定收益 | 通膨連結債券 (Inflation-Linked) | 美國抗通膨債券（TIPS） | 專門對抗「通膨高於預期」的風險 | **長期債券 40%**（通膨對沖） |
| `CEOIBU` | 固定收益 | 投資等級公司債 (Investment Grade) | 信用評等 BBB- 以上公司債、00720B（元大投資級公司債） | 收益率略高於公債，波動度中等 | **中期債券 15%** |
| `CEOIEU` | 固定收益 | 高收益債/非投資等級 (High Yield) | 俗稱垃圾債券（Junk Bonds） | 走勢與股市正相關性較高 | 混合（偏股票相關性） |
| `CEOIRU` | 固定收益 | 新興市場債 (Emerging Market Debt) | 以美元或當地貨幣計價的政府債 | 包含信用風險與匯率風險 | **中期債券 15%** |

---

### 實質資產類（Real Assets）

| CFI 代碼 | 資產類別 | 類別細項 | 說明與代表標的 | 性質 | 全天候映射 |
|---------|---------|---------|-------------|------|-----------|
| `CEOJLU` | 實質資產 | 房地產 (Real Estate) | 商辦、住宅、REITs（不動產投資信託） | 現金流穩定，具備稅務優勢 | **商品/實質資產 7.5%** |
| `CBCIXU` | 實質資產 | 貴金屬 (Precious Metals) | 黃金（Gold）、白銀（Silver）、WGLD.L（WisdomTree 實體黃金） | 避險與對沖貨幣貶值的核心 | **黃金 7.5%** |
| `CMXXXU` | 實質資產 | 大宗商品 (Commodities) | 原油（Energy）、農產品（Agriculture）、工業金屬、XLE（能源 ETF） | 與經濟循環強烈相關，抗通膨強 | **商品 7.5%** |
| `CIOGEU` | 實質資產 | 基礎設施 (Infrastructure) | 電網、收費道路、5G 塔台 | 特許經營權性質，抗跌且配息穩 | **商品/實質資產 7.5%** |

---

### 現金及等價物（Cash & Equivalents）

| CFI 代碼 | 資產類別 | 類別細項 | 說明與代表標的 | 性質 | 全天候映射 |
|---------|---------|---------|-------------|------|-----------|
| `CIOIRU` | 現金及等價物 | 貨幣市場工具 (Money Market) | 國庫券（T-Bills）、商業票據（Commercial Paper） | 期限通常短於 1 年 | 現金等價物（緩衝） |
| `CIOGRU` | 現金及等價物 | 定存與活存 (Time Deposits) | 銀行存款 | 幾乎零風險，但實質利率可能為負 | 現金等價物（緩衝） |
| `CFOGEU` | 現金及等價物 | 外幣 (Foreign Currencies) | 美元、日圓、瑞郎 | 作為避險貨幣或套利交易用途 | 現金等價物（匯率敞口）|

---

### 另類投資與衍生工具（Alternatives & Derivatives）

| CFI 代碼 | 資產類別 | 類別細項 | 說明與代表標的 | 性質 | 全天候映射 |
|---------|---------|---------|-------------|------|-----------|
| `CIOGLU` | 另類投資 | 對沖基金 (Hedge Funds) | 長短倉策略（Long/Short）、宏觀策略（Global Macro）、**Momentum-LS** | 降低與大盤的相關性 | 另類（低相關） |
| `CIOGBU` | 另類投資 | 數位資產 (Digital Assets) | 比特幣（Bitcoin）、以太幣（Ethereum） | 高波動、極具爭議的「數位黃金」 | 另類（高風險）|
| `CIOIBU` | 另類投資 | 衍生性商品 (Derivatives) | 期貨（Futures）、選擇權（Options）、掉期（Swaps） | 用於槓桿或對沖（Hedging） | 不適用（本框架不使用）|
| `CIOILU` | 另類投資 | 收藏品 (Collectibles) | 藝術品、名錶、稀有威士忌 | 市場透明度低，估值主觀 | 不適用（組合中無此類）|

---

### 特殊結構型產品（Structured / Target Date）

| CFI 代碼 | 資產類別 | 類別細項 | 說明與代表標的 | 性質 | 全天候映射 |
|---------|---------|---------|-------------|------|-----------|
| `CIOJLU` | 另類投資 | 結構型產品（一般） | 結構型票據、保本型商品 | 依結構而定 | 混合 |
| `CFOGIU` | 現金及等價物 | 結構型存款 | 連結利率或匯率的存款型商品 | 低風險，收益有限 | 現金等價物 |
| `CFOIIU` | 現金及等價物 | 保險連結型 | 投資型保單 | 流動性低 | 混合 |
| `CIOIEU` | 另類投資 | 結構型票據（私募） | 私募發行的結構型商品 | 低透明度 | 混合 |
| `CIOGMU` | 另類投資 | 多重資產結構型組合 | ETF 智慧組合、目標日期組合 | 依內部配置而定 | 混合（需解構） |
| `CIOIMU` | 另類投資 | 資本保護型產品 | **Target2030-FT（Capital Guarantee 版）** | 具備本金保護承諾（Capital Guarantee） | 現金/債券為主 |

---

## 持倉 CFI 對照（你的組合）

以下為你的實際持倉對應 CFI 代碼的快速參照表：

| 標的 | 名稱 | CFI 代碼 | 資產類別細項 | 全天候映射 |
|------|------|---------|------------|-----------|
| 0050 | 元大台灣50 | `ESVUFR` | 已開發市場大盤股 | 股票 |
| 00905 | FT台灣Smart | `CEOGMU` | 產業/主題型 | 股票 |
| 00919 | 群益台灣精選高息 | `ESVUFR` | 已開發市場大盤股 | 股票 |
| 00720B | 元大投資級公司債 | `CEOIBU` | 投資等級公司債 | 中期債券 |
| 2536 | 宏普 | `ESVUFR` | 已開發市場（台股個股） | 股票 |
| 2540 | 愛山林 | `ESVUFR` | 已開發市場（台股個股） | 股票 |
| 元大台灣加權指數基金 | TW000T0574Y1 | `ESVUFR` | 已開發市場大盤股 | 股票 |
| 元大台灣50連結基金 | TW000T05B2A6 | `ESVUFR` | 已開發市場大盤股 | 股票 |
| 國泰泰享退2049 | TW000T3781E1 | `CIOGMU` | 目標日期多重資產 | 混合（依滑降） |
| 復華傳家基金 | TW000T2206Y8 | `CIOGMU` | 多重資產 | 混合 |
| 元大10年投資級企業債 | TW000T05B9B9 | `CEOIBU` | 投資等級公司債 | 中期債券 |
| 路博邁收益成長多重資產 | TW000T5003W0 | `CIOGMU` | 多重資產（疑似已贖回） | — |
| 施羅德環球多元收益 | LU1516354237 | `CIOGMU` | 多重資產 | 混合 |
| 東方匯理美元短期債券 | LU1882441907 | `CIOIRU` | 貨幣市場/短期債券 | 現金等價物 |
| 霸菱優先順位資產抵押債 | IE00BK71B469 | `CEOIBU` | 投資等級公司債（ABS） | 中期債券 |
| 富達全球多重資產收益 | LU0757359368 | `CIOGMU` | 多重資產（疑似已贖回） | — |
| 富蘭克林全球平衡基金 | LU0128525689 | `CIOGMU` | 多重資產平衡型 | 混合 |
| GOOG / GOOG-RTH | Alphabet Inc | `ESVTFR` | 已開發市場大盤股 | 股票 |
| LLY | Eli Lilly | `CEOGMU` | 產業/主題型（醫療保健） | 股票 |
| TEAM | Atlassian | `CEOGMU` | 產業/主題型（科技） | 股票 |
| LDO | Leonardo S.p.A. | `ESVTFR` | 已開發市場大盤股（歐股）| 股票 |
| NET | Cloudflare | `CEOGMU` | 產業/主題型（科技/資安） | 股票 |
| CRM | Salesforce | `CEOGMU` | 產業/主題型（科技） | 股票 |
| COST | Costco | `ESVTFR` | 已開發市場大盤股 | 股票 |
| MSI | Motorola Solutions | `CEOGMU` | 產業/主題型（科技） | 股票 |
| ORCL | Oracle | `CEOGMU` | 產業/主題型（科技） | 股票 |
| ABN | ABN AMRO Bank | `ESVTFR` | 已開發市場大盤股（歐股）| 股票 |
| ANZ | ANZ Banking Group | `ESVTFR` | 已開發市場大盤股（澳股）| 股票 |
| BABA | Alibaba | `CEOGEU` | 新興市場股票 | 股票 |
| MCD | McDonald's | `ESVTFR` | 已開發市場大盤股 | 股票 |
| MSFT | Microsoft | `ESVTFR` | 已開發市場大盤股 | 股票 |
| VOO | Vanguard S&P 500 | `ESVTFR` | 已開發市場大盤股 | 股票 |
| CIBR | First Trust Cybersecurity | `CEOGMU` | 產業/主題型（資安） | 股票 |
| SKYY | First Trust Cloud Computing | `CEOGMU` | 產業/主題型（雲端） | 股票 |
| VEA | Vanguard FTSE Developed | `ESVTFR` | 已開發市場大盤股 | 股票 |
| IEFA | iShares Core MSCI EAFE | `ESVTFR` | 已開發市場大盤股 | 股票 |
| XLE | Energy Select Sector SPDR | `CMXXXU` | 大宗商品（能源） | 商品 |
| VBK | Vanguard Small-Cap Growth | `CEOGDU` | 中小型股 | 股票 |
| BTC | Bitcoin | `CIOGBU` | 數位資產 | 另類（高風險）|
| The-Chameleon | Gioben Capital ETF Quant | `CIOGMU` | 多重資產（量化自適應） | 混合（需解構）|
| Target2030-FT | Franklin Templeton 目標日期 | `CIOIMU` ⚠️ / `CIOGMU` | 資本保護型（視登記狀態）| 混合（偏債券）|
| Momentum-LS | eToro AI 多空動能 | `CIOGLU` | 對沖基金類策略 | 另類（低相關）|

---

## 系統使用規則

### 1. 組合診斷時的 CFI 映射優先順序

當持倉的「資產類別」欄位與 CFI 代碼衝突時，**以 CFI 代碼為準**。例如 XLE 在 CSV 中標記為 `ETF`，但 CFI 映射為 `CMXXXU`（大宗商品），應歸入全天候的商品類別，而非股票類別。

### 2. 智慧投資組合的解構原則

eToro 三個智慧投資組合（The-Chameleon、Target2030-FT、Momentum-LS）均歸類為 `CIOGMU` 或 `CIOGLU`，在全天候配置診斷前必須先進行內部解構：

- **The-Chameleon**：依最新月報持倉（SPY5.L + WGLD.L 為主），拆分為股票 + 黃金
- **Target2030-FT**：依當前滑降路徑比例（2026 年估算約 25% 股票 / 75% 債券），拆分後歸類
- **Momentum-LS**：多空策略，淨暴露視當月持倉而定，預設為低市場相關性，歸入另類投資

### 3. 台灣稅務分類的 CFI 依據

| CFI 類別 | 台灣稅務性質 | 備註 |
|---------|------------|------|
| `ESVUFR` / `ESVTFR`（台股） | 證所稅免徵；股利課綜所稅 | 適用股利抵減 8.5% |
| `ESVTFR` / `CEOGMU`（美股） | 股利 30% 預扣稅；資本利得屬海外所得 | eToro 持倉全數為海外所得 |
| `CEOIBU`（境內債券ETF） | 配息併入綜所稅；注意二代健保 | 00720B 月配，注意單筆門檻 |
| `CIOGMU`（境內基金） | 收益課綜所稅（非海外所得） | 元大、基富通境內基金 |
| `CIOGMU`（境外基金） | 屬海外所得 | 中信智投境外基金 |
| `CIOGBU`（數位資產） | 財產交易所得，屬海外所得 | BTC 出售損益需申報 |
