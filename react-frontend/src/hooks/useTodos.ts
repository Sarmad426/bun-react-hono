import { useCallback, useMemo } from "react";
import { use, useDeferredValue, useOptimistic } from "react";
import { todoApi } from "../api/todoApi";
import { Todo, TodoFormData } from "../types";


export function useTodos() {
    // Use the new React 19 'use' hook for data fetching
    const todosPromise = useMemo(() => {
        return todoApi.getTodos();
    }, []);

    const initialTodos = use(todosPromise);

    // Optimistic updates for better UX
    const [optimisticTodos, addOptimisticTodo] = useOptimistic(
        initialTodos,
        (state: Todo[], newTodo: Todo) => [...state, newTodo]
    );

    const [optimisticTodosWithUpdate, updateOptimisticTodo] = useOptimistic(
        optimisticTodos,
        (state: Todo[], updatedTodo: Partial<Todo> & { id: string }) =>
            state.map((todo) =>
                todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
            )
    );

    const [finalTodos, deleteOptimisticTodo] = useOptimistic(
        optimisticTodosWithUpdate,
        (state: Todo[], todoId: string) =>
            state.filter((todo) => todo.id !== todoId)
    );

    // Create function with optimistic update
    const createTodo = useCallback(
        async (data: TodoFormData) => {
            // Create an optimistic version
            const optimisticTodo: Todo = {
                id: `temp-${Date.now()}`,
                title: data.title,
                description: data.description || "",
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Update UI optimistically
            addOptimisticTodo(optimisticTodo);

            try {
                // Make the actual API call
                await todoApi.createTodo(data);

                // Refresh the list to get the server-generated ID
                const refreshedTodos = await todoApi.getTodos();
                return refreshedTodos;
            } catch (error) {
                console.error("Error creating todo:", error);
                throw error;
            }
        },
        [addOptimisticTodo]
    );

    // Update function with optimistic update
    const updateTodo = useCallback(
        async (
            id: string,
            data: Partial<TodoFormData & { completed: boolean }>
        ) => {
            // Update UI optimistically
            updateOptimisticTodo({
                id,
                ...data,
                updatedAt: new Date().toISOString(),
            });

            try {
                // Make the actual API call
                await todoApi.updateTodo(id, data);
            } catch (error) {
                console.error("Error updating todo:", error);
                throw error;
            }
        },
        [updateOptimisticTodo]
    );

    // Delete function with optimistic update
    const deleteTodo = useCallback(
        async (id: string) => {
            // Update UI optimistically
            deleteOptimisticTodo(id);

            try {
                // Make the actual API call
                await todoApi.deleteTodo(id);
            } catch (error) {
                console.error("Error deleting todo:", error);
                throw error;
            }
        },
        [deleteOptimisticTodo]
    );

    // Extra utility functions
    const toggleComplete = useCallback(
        (id: string, currentStatus: boolean) => {
            return updateTodo(id, { completed: !currentStatus });
        },
        [updateTodo]
    );

    const deferredTodos = useDeferredValue(finalTodos);

    return {
        todos: deferredTodos,
        createTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        isLoading: deferredTodos !== finalTodos,
    };
}
