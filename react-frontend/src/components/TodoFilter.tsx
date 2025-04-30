type FilterOption = "all" | "active" | "completed";

interface TodoFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  totalTodos: number;
  activeTodos: number;
  completedTodos: number;
}

export function TodoFilter({
  activeFilter,
  onFilterChange,
  totalTodos,
  activeTodos,
  completedTodos,
}: TodoFilterProps) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
      <div className="text-sm text-gray-500">
        <span className="font-medium">{totalTodos}</span> todos •
        <span className="font-medium ml-1">{activeTodos}</span> active •
        <span className="font-medium ml-1">{completedTodos}</span> completed
      </div>

      <div className="flex p-1 border rounded-lg bg-gray-50">
        <button
          onClick={() => onFilterChange("all")}
          className={`px-3 py-1 text-sm rounded-md ${
            activeFilter === "all"
              ? "bg-white shadow-sm text-blue-600 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange("active")}
          className={`px-3 py-1 text-sm rounded-md ${
            activeFilter === "active"
              ? "bg-white shadow-sm text-blue-600 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => onFilterChange("completed")}
          className={`px-3 py-1 text-sm rounded-md ${
            activeFilter === "completed"
              ? "bg-white shadow-sm text-blue-600 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
