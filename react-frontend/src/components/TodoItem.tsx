import { useState } from "react";
import { Todo } from "../types";
import { updateTodo, deleteTodo } from "../api/todoApi";
import { toast } from "react-toastify";

interface TodoItemProps {
  todo: Todo;
  onTodoUpdated: (todo: Todo) => void;
  onTodoDeleted: (id: string) => void;
}

export function TodoItem({
  todo,
  onTodoUpdated,
  onTodoDeleted,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    try {
      setIsLoading(true);
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      onTodoUpdated(updatedTodo);
    } catch (error) {
      toast.error("Failed to update todo status");
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setIsLoading(true);
      const updatedTodo = await updateTodo(todo.id, {
        title,
        description: description.trim() ? description : undefined,
      });

      onTodoUpdated(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update todo");
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setTitle(todo.title);
    setDescription(todo.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTodo(todo.id);
      onTodoDeleted(todo.id);
    } catch (error) {
      toast.error("Failed to delete todo");
      console.error("Error deleting todo:", error);
      setIsDeleting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={`border rounded-lg p-4 mb-4 transition-all ${
        todo.completed ? "bg-gray-50" : "bg-white"
      }`}
    >
      {isEditing ? (
        // Edit mode
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              title="todo title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              title="todo description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleSaveEdit}
              disabled={isLoading}
              className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300 transition"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // View mode
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-grow">
              <input
                title="todo status"
                type="checkbox"
                checked={todo.completed}
                onChange={handleToggleComplete}
                disabled={isLoading}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-grow">
                <h3
                  className={`text-lg font-medium ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={`mt-1 text-gray-600 ${
                      todo.completed ? "line-through opacity-70" : ""
                    }`}
                  >
                    {todo.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Created: {formatDate(todo.createdAt)}
                  {todo.updatedAt !== todo.createdAt &&
                    ` • Updated: ${formatDate(todo.updatedAt)}`}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                title="edit todo"
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
                disabled={isLoading || isDeleting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 focus:outline-none"
                disabled={isLoading || isDeleting}
              >
                {isDeleting ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
