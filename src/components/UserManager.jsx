import React, { useState } from "react";

const USER = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@gmail.com",
    role: "Admin",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "thib@gmail.com",
    role: "Member",
  },
  {
    id: 3,
    name: "Lê Hoàng C",
    email: "hoangc@gmail.com",
    role: "Member",
  },
];

export const UserManager = () => {
  const [users, setUsers] = useState(USER);

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    role: "Member",
  });

  const [edit, setEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("VUI LÒNG NHẬP ĐẦY ĐỦ THÔNG TIN");
      return;
    }

    if (edit) {
      setUsers(users.map((u) => (u.id === form.id ? form : u)));
    } else {
      setUsers([
        ...users,
        {
          ...form,
          id: Date.now(),
        },
      ]);
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      email: "",
      role: "Member",
    });

    setEdit(false);
  };

  const handleEdit = (user) => {
    setForm(user);
    setEdit(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá thành viên này?")) {
      setUsers(users.filter((user) => user.id !== id));

      if (form.id === id) {
        resetForm();
      }
    }
  };

  return (
    <div>
      <h2>Quản lý thành viên</h2>

      <form onSubmit={handleSave}>
        <h3>{edit ? "Chỉnh sửa thông tin" : "Thêm thành viên mới"}</h3>

        <div>
          <input
            type="text"
            name="name"
            placeholder="Nhập họ và tên"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={form.email}
            onChange={handleChange}
          />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="Member">Thành viên</option>

            <option value="Admin">Quản trị viên</option>
          </select>
        </div>

        <div>
          <button type="submit">{edit ? "Cập nhật" : "Thêm mới"}</button>

          {edit && (
            <button type="button" onClick={resetForm}>
              Huỷ
            </button>
          )}
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.role}</td>

              <td>
                <button onClick={() => handleEdit(user)}>Sửa</button>

                <button onClick={() => handleDelete(user.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
