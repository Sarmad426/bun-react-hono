import { z } from 'zod'


// Create Zod schemas for validation
export const createTodoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
});

export const updateTodoSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
});