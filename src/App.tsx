import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { ProductApp } from "./components/ProductApp";
import { TodoApp } from "./components/TodoApp";
import { UserManager } from "./components/UserManager";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/todo">
          <button>Todo App</button>
        </Link>

        <Link to="/products">
          <button>Product App</button>
        </Link>

        <Link to="/users">
          <button>User Manager</button>
        </Link>
      </nav>

      <hr />

      <Routes>
        <Route path="/todo" element={<TodoApp />} />

        <Route path="/products" element={<ProductApp />} />

        <Route path="/users" element={<UserManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
