import React, { useState, useEffect, useTransition } from "react";
import { TodoFormData, Todo } from "../types";

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => Promise<Todo[] | void>;
  initialData?: Todo;
  onCancel?: () => void;
}

export function TodoForm({ onSubmit, initialData, onCancel }: TodoFormProps) {
  const [formData, setFormData] = useState<TodoFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      startTransition(async () => {
        await onSubmit(formData);
        if (!initialData) {
          // Only reset the form if we're creating a new todo
          setFormData({ title: "", description: "" });
        }
      });
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 mb-6 border rounded-lg bg-white"
    >
      {error && (
        <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter todo title"
          disabled={isPending}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description (optional)"
          disabled={isPending}
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
            disabled={isPending}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          disabled={isPending}
        >
          {isPending ? "Saving..." : initialData ? "Update Todo" : "Add Todo"}
        </button>
      </div>
    </form>
  );
}
