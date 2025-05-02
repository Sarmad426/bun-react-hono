import { env } from 'bun'
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { todos } from "../drizzle/schema";

const db = drizzle(env.DATABASE_URL!);

export const getTodos = async (limit: number = 50) => {
    return await db
        .select()
        .from(todos)
        .orderBy(todos.createdAt).limit(limit);
};

export const getTodoById = async (id: string) => {
    const result = await db
        .select()
        .from(todos)
        .where(eq(todos.id, id));

    return result[0] || null;
};

export const createTodo = async (data: { title: string; description?: string }) => {
    const result = await db.insert(todos).values({
        title: data.title,
        description: data.description || "",
    }).returning();

    return result[0];
};

export const updateTodo = async (id: string, data: Partial<{ title: string; description: string; completed: boolean }>) => {
    const updatedData = {
        ...data,
        updatedAt: new Date().toISOString(),
    };

    const result = await db
        .update(todos)
        .set(updatedData)
        .where(eq(todos.id, id))
        .returning();

    return result[0] || null;
};

export const deleteTodo = async (id: string) => {
    const result = await db
        .delete(todos)
        .where(eq(todos.id, id))
        .returning();

    return result[0] || null;
};
