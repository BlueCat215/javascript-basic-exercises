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
    <div className="max-w-5xl mx-auto p-6 bg-white mt-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
        Quản lý thành viên
      </h2>

      <form
        onSubmit={handleSave}
        className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200"
      >
        <h3 className="text-md font-medium text-gray-700 mb-4">
          {edit ? "Chỉnh sửa thông tin" : "Thêm thành viên mới"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Nhập họ và tên"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition"
          >
            <option value="Member">Thành viên</option>
            <option value="Admin">Quản trị viên</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-5 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition shadow-sm"
          >
            {edit ? "Cập nhật" : "Thêm mới"}
          </button>

          {edit && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition"
            >
              Huỷ
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
              <th className="py-3 px-6">STT</th>
              <th className="py-3 px-6">Họ và tên</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Vai trò</th>
              <th className="py-3 px-6 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 text-sm">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
              >
                <td className="py-3 px-6 text-gray-500">{index + 1}</td>
                <td className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="py-3 px-6 text-gray-600">{user.email}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                      user.role === "Admin"
                        ? "bg-gray-100 text-gray-900 border-gray-300"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition text-xs font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 hover:text-red-600 transition text-xs font-medium"
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  Không có thành viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
