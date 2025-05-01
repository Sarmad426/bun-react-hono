import { useState, useEffect } from "react";
import { TodoList } from "./components/TodoList";
import { TodoForm } from "./components/TodoForm";
import { fetchTodos } from "./api/todoApi";
import { Todo } from "./types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        const fetchedTodos = await fetchTodos();
        setTodos(fetchedTodos);
        setError(null);
      } catch (err) {
        setError("Failed to load todos. Please try again later.");
        toast.error("Failed to load todos");
        console.log("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    toast.success("Todo added successfully!");
  };

  const handleTodoUpdated = (updatedTodo: Todo) => {
    console.log("Updated todo:", updatedTodo);
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
    toast.success("Todo updated successfully!");
  };

  const handleTodoDeleted = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    toast.success("Todo deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Todo App
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
          <TodoForm onTodoAdded={handleTodoAdded} />
        </div>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
            <TodoList
              todos={todos}
              onTodoUpdated={handleTodoUpdated}
              onTodoDeleted={handleTodoDeleted}
            />
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
