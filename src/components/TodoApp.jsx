import React, { useEffect, useState } from "react";

export const TodoApp = () => {
  const [todoList, setTodoList] = useState(() => {
    const saveTodo = localStorage.getItem("todo");

    if (saveTodo) {
      return JSON.parse(saveTodo);
    }

    return [];
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(todoList));
  }, [todoList]);

  const handleAddTodo = (e) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    setTodoList([...todoList, newTodo]);
    setInput("");
  };

  const handleDeleteTodo = (id) => {
    setTodoList(todoList.filter((x) => x.id !== id));
  };

  const handleToggleTodo = (id) => {
    setTodoList(
      todoList.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleStartEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) {
      return;
    }

    setTodoList(
      todoList.map((x) => (x.id === id ? { ...x, text: editText } : x)),
    );

    setEditId(null);
    setEditText("");
  };

  const filterTodo = todoList.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    }

    if (filter === "completed") {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-sm mt-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
        Quản lý công việc
      </h2>

      <form onSubmit={handleAddTodo} className="flex gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Thêm việc cần làm..."
          className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition text-sm"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition text-sm shadow-sm"
        >
          Thêm
        </button>
      </form>

      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => setFilter("all")}
          disabled={filter === "all"}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
            filter === "all"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>

        <button
          onClick={() => setFilter("active")}
          disabled={filter === "active"}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
            filter === "active"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Đang thực hiện
        </button>

        <button
          onClick={() => setFilter("completed")}
          disabled={filter === "completed"}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
            filter === "completed"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Đã hoàn thành
        </button>
      </div>

      <ul className="space-y-3">
        {filterTodo.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100/50 transition"
          >
            {editId === todo.id ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={() => handleSaveEdit(todo.id)}
                  className="px-3 py-1 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-800 transition"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300 transition"
                >
                  Huỷ
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <span
                    className={`text-sm truncate ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800 font-medium"
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(todo)}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition text-xs font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 hover:text-red-600 transition text-xs font-medium"
                  >
                    Xoá
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {todoList.length === 0 && (
        <p className="text-center text-gray-500 py-8 text-sm">
          Chưa có công việc nào.
        </p>
      )}
    </div>
  );
};
