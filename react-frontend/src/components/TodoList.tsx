import { useState, useMemo } from "react";
import { TodoItem } from "./TodoItem";
import { Todo } from "../types";
import { Tabs } from "./Tabs";

interface TodoListProps {
  todos: Todo[];
  onTodoUpdated: (todo: Todo) => void;
  onTodoDeleted: (id: string) => void;
}

export function TodoList({
  todos,
  onTodoUpdated,
  onTodoDeleted,
}: TodoListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    // Apply status filter
    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    }

    // Apply search filter if there's a search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(term) ||
          (todo.description && todo.description.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [todos, filter, searchTerm]);

  // Calculate counts for tabs
  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
    }),
    [todos]
  );

  const handleTabChange = (newTab: "all" | "active" | "completed") => {
    setFilter(newTab);
  };

  return (
    <div>
      <div className="mb-6">
        <Tabs
          currentTab={filter}
          onTabChange={handleTabChange}
          tabs={[
            { id: "all", label: `All (${counts.all})` },
            { id: "active", label: `Active (${counts.active})` },
            { id: "completed", label: `Completed (${counts.completed})` },
          ]}
        />
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? (
            <p>No todos match your search.</p>
          ) : filter === "all" ? (
            <p>You have no todos yet. Create one above!</p>
          ) : filter === "active" ? (
            <p>You have no active todos.</p>
          ) : (
            <p>You have no completed todos.</p>
          )}
        </div>
      ) : (
        <div>
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onTodoUpdated={onTodoUpdated}
              onTodoDeleted={onTodoDeleted}
            />
          ))}
          <p className="text-sm text-gray-500 mt-4 text-right">
            {filteredTodos.length}{" "}
            {filteredTodos.length === 1 ? "item" : "items"}
          </p>
        </div>
      )}
    </div>
  );
}
