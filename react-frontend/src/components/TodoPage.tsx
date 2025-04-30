import { TodoList } from "./TodoList";
import { useTodos } from "../hooks/useTodos";

// Mock user ID - in a real app you'd get this from authentication
const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";

export function TodoPage() {
  const {
    todos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    isLoading,
  } = useTodos({ userId: MOCK_USER_ID });

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-3xl mx-auto py-8">
        <TodoList
          todos={todos}
          onCreate={createTodo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onToggleComplete={toggleComplete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
