import { memo } from "react";
import { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export const TodoItem = memo(function TodoItem({
  todo,
  onToggleComplete,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const handleToggle = () => {
    onToggleComplete(todo.id, todo.completed);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  return (
    <div
      className={`p-4 mb-2 border rounded-lg ${
        todo.completed ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <input
            title="Toggle Todo Completion"
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className="w-4 h-4 mr-2 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <h3
              className={`text-lg font-medium ${
                todo.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p
                className={`mt-1 text-sm ${
                  todo.completed ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {todo.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-xs text-red-600 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Updated: {new Date(todo.updatedAt).toLocaleString()}
      </div>
    </div>
  );
});
