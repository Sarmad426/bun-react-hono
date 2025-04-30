import { Suspense } from "react";

import "./App.css";
import { TodoPage } from "./components/TodoPage";

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-10 h-10 border-4 border-t-blue-600 rounded-full animate-spin"></div>
            <div>Loading...</div>
          </div>
        }
      >
        <TodoPage />
      </Suspense>
    </>
  );
}

export default App;
