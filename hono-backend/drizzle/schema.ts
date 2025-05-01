import { pgTable, index, uuid, varchar, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



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

export const userTable = pgTable("userTable", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	email: varchar().notNull(),
	hashedPassword: varchar("hashed_password"),
	isGoogleAccount: boolean("is_google_account").notNull(),
	avatar: varchar(),
}, (table) => [
	uniqueIndex("ix_user_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("ix_user_id").using("btree", table.id.asc().nullsLast().op("text_ops")),
]);
