import { pgTable, text, timestamp, varchar, integer, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 用戶表
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 對話記錄
export const chats = pgTable('chats', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  systemPrompt: text('system_prompt'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 對話訊息
export const messages = pgTable('messages', {
  id: varchar('id', { length: 255 }).primaryKey(),
  chatId: varchar('chat_id', { length: 255 }).notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull(), // 'user' | 'assistant' | 'system' | 'data'
  content: text('content').notNull(),
  uiState: jsonb('ui_state'), // 儲存 Generative UI 狀態
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 投資組合快照
export const portfolios = pgTable('portfolios', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  totalValueBase: integer('total_value_base'), // 基準貨幣總值
  currencyBase: varchar('currency_base', { length: 10 }).default('TWD').notNull(),
  isLive: boolean('is_live').default(false).notNull(), // 是否啟用自動更新報價
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

// 投資組合持倉項目
export const portfolioPositions = pgTable('portfolio_positions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  portfolioId: varchar('portfolio_id', { length: 255 }).notNull().references(() => portfolios.id, { onDelete: 'cascade' }),
  symbol: varchar('symbol', { length: 50 }).notNull(),
  cfiCode: varchar('cfi_code', { length: 6 }), // ISO 10962 資產分類
  quantity: integer('quantity').notNull(), // 使用整數儲存，小數點後 4 位
  averageCostBase: integer('average_cost_base'), // 基準貨幣平均成本
  currencyTrade: varchar('currency_trade', { length: 10 }).notNull(), // 交易貨幣
  exchangeRate: integer('exchange_rate'), // 交易貨幣對基準貨幣匯率 (x10000)
  currentPriceTrade: integer('current_price_trade'), // 現價 (交易貨幣)
  currentValueBase: integer('current_value_base'), // 現值 (基準貨幣)
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats),
  portfolios: many(portfolios),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  positions: many(portfolioPositions),
}));

export const portfolioPositionsRelations = relations(portfolioPositions, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioPositions.portfolioId],
    references: [portfolios.id],
  }),
}));
