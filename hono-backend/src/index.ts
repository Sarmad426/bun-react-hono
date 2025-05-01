import { Hono } from "hono";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { logger } from "hono/logger";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { todos } from "../drizzle/schema";
import { cors } from 'hono/cors'


const db = drizzle(process.env.DATABASE_URL!);


// Create Zod schemas for validation
const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// Define database queries
export const getTodos = async () => {
  return await db
    .select()
    .from(todos)
    .orderBy(todos.createdAt);
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

// Initialize Hono app
const app = new Hono()

// Enable CORS
app.use(
  "*", // Apply CORS to all routes
  cors({
    origin: "*", // Next js frontend URL
    allowMethods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowHeaders: ["Content-Type"], // Allowed headers
  })
);

app.use(logger());

// Routes
app.get("/", (c) => c.json({ message: "Todo API is running!" }));

app.get("/todos", async (c) => {
  try {
    const todos = await getTodos();
    return c.json({
      success: true,
      data: todos
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return c.json({
      success: false,
      message: "Failed to fetch todos"
    }, 500);
  }
});

// GET a single todo by ID
app.get("/todos/todo/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const todo = await getTodoById(id);
    if (!todo) {
      return c.json({
        success: false,
        message: "Todo not found"
      }, 404);
    }
    return c.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error("Error fetching todo:", error);
    return c.json({
      success: false,
      message: "Failed to fetch todo"
    }, 500);
  }
});

// POST create a new todo
app.post("/todos/new", zValidator("json", createTodoSchema), async (c) => {
  const data = c.req.valid("json");
  try {
    const newTodo = await createTodo(data);
    return c.json({
      success: true,
      data: newTodo
    }, 201);
  } catch (error) {
    console.error("Error creating todo:", error);
    return c.json({
      success: false,
      message: "Failed to create todo"
    }, 500);
  }
});

// PUT update a todo
app.put("/todos/edit/:id", zValidator("json", updateTodoSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  console.log("Todo to be updated:", data)
  try {
    const existingTodo = await getTodoById(id);
    if (!existingTodo) {
      return c.json({
        success: false,
        message: "Todo not found"
      }, 404);
    }

    const updatedTodo = await updateTodo(id, data);
    return c.json({
      success: true,
      data: updatedTodo
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return c.json({
      success: false,
      message: "Failed to update todo"
    }, 500);
  }
});

// DELETE remove a todo
app.delete("/todos/delete/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const existingTodo = await getTodoById(id);
    if (!existingTodo) {
      return c.json({
        success: false,
        message: "Todo not found"
      }, 404);
    }

    const deletedTodo = await deleteTodo(id);
    return c.json({
      success: true,
      data: deletedTodo,
      message: "Todo deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return c.json({
      success: false,
      message: "Failed to delete todo"
    }, 500);
  }
});

export default app;