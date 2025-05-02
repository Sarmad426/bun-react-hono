import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from 'hono/cors'
import { zValidator } from "@hono/zod-validator";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "./db";
import { createTodoSchema, updateTodoSchema } from './zod-schema'

const app = new Hono()

// Enable CORS
app.use(
  "*", // Apply CORS to all routes
  cors({
    origin: ["http://localhost:5173"], // React vite
    allowMethods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowHeaders: ["Content-Type"], // Allowed headers
  })
);

app.use(logger());

// Routes
app.get("/", (c) => c.json({ message: "Todo API is running!" }));


// GET ALL TODOS
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
        message:
          "404: Todo not found"
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