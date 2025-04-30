import { Todo, TodoFormData, ApiResponse } from "../types";

const API_BASE_URL = "http://localhost:3000";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
    }
    return await response.json();
}

export const todoApi = {
    async getTodos(): Promise<Todo[]> {
        const url = `${API_BASE_URL}/todos`;

        const response = await fetch(url);
        const result = await handleResponse<Todo[]>(response);
        console.log("Fetched todos:", result.data);
        return result.data || [];
    },

    async getTodoById(id: string): Promise<Todo | null> {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`);
        const result = await handleResponse<Todo>(response);
        return result.data || null;
    },

    async createTodo(data: TodoFormData): Promise<Todo> {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data }),
        });
        const result = await handleResponse<Todo>(response);
        return result.data!;
    },

    async updateTodo(
        id: string,
        data: Partial<TodoFormData & { completed: boolean }>
    ): Promise<Todo> {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<Todo>(response);
        return result.data!;
    },

    async deleteTodo(id: string): Promise<Todo> {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: "DELETE",
        });
        const result = await handleResponse<Todo>(response);
        return result.data!;
    },
};
