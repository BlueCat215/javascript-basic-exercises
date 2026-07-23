import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { ProductApp } from "./components/ProductApp";
import { TodoApp } from "./components/TodoApp";
import { UserManager } from "./components/UserManager";
import { TestTailwind } from "./components/testTailwind";

function App() {
  return (
    <BrowserRouter>
      <nav className="max-w-5xl mx-auto mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-2xl flex justify-center gap-3 flex-wrap">
        <Link
          to="/todo"
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 hover:text-black transition"
        >
          Todo App
        </Link>

        <Link
          to="/products"
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 hover:text-black transition"
        >
          Product App
        </Link>

        <Link
          to="/users"
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 hover:text-black transition"
        >
          User Manager
        </Link>

        <Link
          to="/tailWind"
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 hover:text-black transition"
        >
          Test Tailwind
        </Link>
      </nav>

      <main className="mt-4">
        <Routes>
          <Route path="/todo" element={<TodoApp />} />
          <Route path="/products" element={<ProductApp />} />
          <Route path="/users" element={<UserManager />} />
          <Route path="/tailWind" element={<TestTailwind />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
