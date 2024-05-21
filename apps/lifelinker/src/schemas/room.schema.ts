import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const room = sqliteTable('room', {
id: text('id').primaryKey(),
password: text('passoword').notNull(),
});
