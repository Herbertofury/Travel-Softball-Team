import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  payload: text('payload').notNull(),
  updatedAt: text('updated_at').notNull()
});
export const rsvps = sqliteTable('rsvps', {
  eventId: text('event_id').notNull(),
  userId: text('user_id').notNull(),
  displayName: text('display_name').notNull(),
  status: text('status').notNull(),
  guests: integer('guests').notNull().default(0),
  note: text('note').notNull().default(''),
  updatedAt: text('updated_at').notNull()
}, table => [primaryKey({columns:[table.eventId,table.userId]}),index('rsvp_user_idx').on(table.userId)]);
export const appConnections = sqliteTable('app_connections', {
  requestId: text('request_id').primaryKey(), challenge: text('challenge').notNull(),
  platform: text('platform').notNull(), expiresAt: integer('expires_at').notNull(),
  userId: text('user_id'), email: text('email')
});
export const appSessions = sqliteTable('app_sessions', {
  tokenHash: text('token_hash').primaryKey(), userId: text('user_id').notNull(),
  email: text('email'), expiresAt: integer('expires_at').notNull()
}, table => [index('app_session_user_idx').on(table.userId)]);
