const fs = require("fs").promises;
const path = require("path");

class JsonCollection {
  constructor(filename) {
    // Xác định đường dẫn đến file JSON.
    this.filePath = path.join(__dirname, "..", "data", filename);
  }

  // Đọc dữ liệu từ file JSON.
  async _read() {
    try {
      const raw = await fs.readFile(this.filePath, "utf-8");

      // File rỗng thì trả về mảng rỗng.
      if (!raw.trim()) return [];

      return JSON.parse(raw);
    } catch (err) {
      // File chưa tồn tại thì trả về mảng rỗng.
      if (err.code === "ENOENT") return [];

      throw err;
    }
  }

  // Ghi dữ liệu vào file JSON.
  async _write(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  // Lấy tất cả dữ liệu.
  async findAll() {
    return await this._read();
  }

  // Tìm dữ liệu theo ID.
  async findById(id) {
    const items = await this._read();

    return items.find((item) => item.id === Number(id));
  }

  // Tạo bản ghi mới và tự tăng ID.
  async create(newItemWithoutId) {
    const items = await this._read();

    // Tìm ID lớn nhất hiện tại.
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);

    const newItem = {
      id: maxId + 1,
      ...newItemWithoutId,
    };

    items.push(newItem);
    await this._write(items);

    return newItem;
  }

  // Cập nhật bản ghi theo ID.
  // PUT: replace = true, PATCH: replace = false.
  async updateById(id, patch, { replace = false } = {}) {
    const items = await this._read();

    const index = items.findIndex((item) => item.id === Number(id));

    // Không tìm thấy bản ghi.
    if (index === -1) return null;

    // PUT thay toàn bộ, PATCH giữ lại dữ liệu cũ.
    const updated = replace
      ? { ...patch, id: items[index].id }
      : { ...items[index], ...patch, id: items[index].id };

    items[index] = updated;
    await this._write(items);

    return updated;
  }

  // Xóa bản ghi theo ID.
  async deleteById(id) {
    const items = await this._read();

    const index = items.findIndex((item) => item.id === Number(id));

    // Không tìm thấy bản ghi.
    if (index === -1) return null;

    const [deleted] = items.splice(index, 1);
    await this._write(items);

    return deleted;
  }
}

module.exports = JsonCollection;
