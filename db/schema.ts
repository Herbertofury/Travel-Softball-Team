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
