import { useState, useMemo, useTransition } from "react";
import { Todo, TodoFormData } from "../types";
import { TodoItem } from "./TodoItem";
import { TodoForm } from "./TodoForm";
import { TodoFilter } from "./TodoFilter";

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: TodoFormData) => Promise<void>;
  onCreate: (data: TodoFormData) => Promise<Todo[] | void>;
  isLoading: boolean;
}

export function TodoList({
  todos,
  onToggleComplete,
  onDelete,
  onUpdate,
  onCreate,
  isLoading,
}: TodoListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isPending, startTransition] = useTransition();

  // Calculate filtered todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  // Calculate counts for the filter component
  const counts = useMemo(
    () => ({
      total: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
    }),
    [todos]
  );

  const handleEditSubmit = async (data: TodoFormData) => {
    if (!editingTodo) return;

    await onUpdate(editingTodo.id, data);
    setEditingTodo(null);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    startTransition(async () => {
      await onToggleComplete(id, completed);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await onDelete(id);
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-900">
        My Todo List
      </h1>

      <TodoForm onSubmit={onCreate} />

      <TodoFilter
        activeFilter={filter}
        onFilterChange={setFilter}
        totalTodos={counts.total}
        activeTodos={counts.active}
        completedTodos={counts.completed}
      />

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoading && filteredTodos.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
          {filter === "all" ? (
            <p>You have no todos yet. Add one above!</p>
          ) : filter === "active" ? (
            <p>No active todos found.</p>
          ) : (
            <p>No completed todos found.</p>
          )}
        </div>
      ) : (
        <div className={`space-y-2 ${isPending ? "opacity-70" : ""}`}>
          {filteredTodos.map((todo) =>
            editingTodo?.id === todo.id ? (
              <TodoForm
                key={todo.id}
                initialData={todo}
                onSubmit={handleEditSubmit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
