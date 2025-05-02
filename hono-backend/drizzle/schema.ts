import { pgTable, index, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core"



export const todos = pgTable("todos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar().notNull(),
	description: varchar(),
	completed: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_todo_id").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);
