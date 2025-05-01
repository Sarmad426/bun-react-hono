// Type definition for Todo item
export interface Todo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

// Type definition for API responses
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// Type for todo creation payload
export interface CreateTodoPayload {
    title: string;
    description?: string;
}

// Type for todo update payload
export interface UpdateTodoPayload {
    title?: string;
    description?: string;
    completed?: boolean;
}