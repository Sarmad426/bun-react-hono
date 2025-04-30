export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TodoFormData {
    title: string;
    description?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}
