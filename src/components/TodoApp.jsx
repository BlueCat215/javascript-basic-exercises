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
    <div>
      <h2>Quản lý công việc</h2>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Thêm việc cần làm"
        />

        <button type="submit">Thêm</button>
      </form>

      <div>
        <button onClick={() => setFilter("all")} disabled={filter === "all"}>
          Tất cả
        </button>

        <button
          onClick={() => setFilter("active")}
          disabled={filter === "active"}
        >
          Đang thực hiện
        </button>

        <button
          onClick={() => setFilter("completed")}
          disabled={filter === "completed"}
        >
          Đã hoàn thành
        </button>
      </div>

      <ul>
        {filterTodo.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />

            {editId === todo.id ? (
              <div>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />

                <button onClick={() => handleSaveEdit(todo.id)}>Lưu</button>

                <button onClick={() => setEditId(null)}>Huỷ</button>
              </div>
            ) : (
              <div>
                <span>
                  {todo.completed ? "✓ " : ""}
                  {todo.text}
                </span>

                <button onClick={() => handleStartEdit(todo)}>Sửa</button>

                <button onClick={() => handleDeleteTodo(todo.id)}>Xoá</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {todoList.length === 0 && <p>Chưa có công việc nào</p>}
    </div>
  );
};
