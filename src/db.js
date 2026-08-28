const fs = require("fs");
const path = require("path");

/**
 * Helper đơn giản để đọc/ghi 1 file JSON làm "database".
 * Đủ dùng cho mục đích học tập / mock, KHÔNG dùng cho production
 * (không xử lý race-condition khi nhiều request ghi cùng lúc).
 */
class JsonCollection {
  constructor(filename) {
    this.filePath = path.join(__dirname, "..", "data", filename);
  }

  _read() {
    const raw = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(raw);
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  findAll() {
    return this._read();
  }

  findById(id) {
    const items = this._read();
    return items.find((item) => item.id === Number(id));
  }

  create(newItemWithoutId) {
    const items = this._read();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem = { id: maxId + 1, ...newItemWithoutId };
    items.push(newItem);
    this._write(items);
    return newItem;
  }

  /** replace: nếu true thì thay toàn bộ object (PUT), false thì merge (PATCH) */
  updateById(id, patch, { replace = false } = {}) {
    const items = this._read();
    const index = items.findIndex((item) => item.id === Number(id));
    if (index === -1) return null;

    const updated = replace
      ? { ...patch, id: items[index].id }
      : { ...items[index], ...patch, id: items[index].id };

    items[index] = updated;
    this._write(items);
    return updated;
  }

  deleteById(id) {
    const items = this._read();
    const index = items.findIndex((item) => item.id === Number(id));
    if (index === -1) return null;

    const [deleted] = items.splice(index, 1);
    this._write(items);
    return deleted;
  }
}

module.exports = JsonCollection;
