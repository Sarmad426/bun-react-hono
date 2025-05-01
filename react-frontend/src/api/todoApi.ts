import { Todo, ApiResponse, CreateTodoPayload, UpdateTodoPayload } from '../types';

const API_URL = 'http://localhost:3000';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An unexpected error occurred');
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
        throw new Error(data.message || 'Operation failed');
    }

    return data.data as T;
}

// Fetch all todos
export async function fetchTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todos`);
    return handleResponse<Todo[]>(response);
}

// Fetch a single todo by ID
export async function fetchTodoById(id: string): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/todo/${id}`);
    return handleResponse<Todo>(response);
}

// Create a new todo
export async function createTodo(todoData: CreateTodoPayload): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
    });

    return handleResponse<Todo>(response);
}

// Update an existing todo
export async function updateTodo(id: string, todoData: UpdateTodoPayload): Promise<Todo> {
    console.log("Todo update data:", todoData);
    const response = await fetch(`${API_URL}/todos/edit/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
    });

    return handleResponse<Todo>(response);
}

// Delete a todo
export async function deleteTodo(id: string): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/delete/${id}`, {
        method: 'DELETE',
    });

    return handleResponse<Todo>(response);
}