import { useState, useMemo } from "react";
import {
  useAdminContactMessagesQuery,
  useMarkContactMessageRead,
  useDeleteContactMessage,
} from "./hooks/useAdminContactQueries";

function MessageDetailModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-tag p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-3">
        <div className="flex justify-between items-start">
          <h2 className="font-bold">
            {message.firstName} {message.lastName}
          </h2>
          <span className="text-xs text-ink/40">
            {new Date(message.createdAt).toLocaleString("vi-VN")}
          </span>
        </div>

        <div className="text-sm space-y-1 text-ink/70">
          <p>
            <span className="text-ink/50">Email: </span>
            {message.email}
          </p>
          {message.phone && (
            <p>
              <span className="text-ink/50">SĐT: </span>
              {message.phone}
            </p>
          )}
          {message.country && (
            <p>
              <span className="text-ink/50">Quốc gia: </span>
              {message.country}
            </p>
          )}
          {message.subject && (
            <p>
              <span className="text-ink/50">Chủ đề: </span>
              {message.subject}
            </p>
          )}
        </div>

        <div className="border-t border-line pt-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/40 mb-2">
            Nội dung
          </p>
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </div>

        <button onClick={onClose} className="btn-secondary w-full">
          Đóng
        </button>
      </div>
    </div>
  );
}

export default function AdminContactMessages() {
  const [columnFilters, setColumnFilters] = useState({
    keyword: "",
    status: "",
  });
  const [viewingMessage, setViewingMessage] = useState(null);

  const { data: messages = [], isLoading } = useAdminContactMessagesQuery();
  const { mutate: markRead } = useMarkContactMessageRead();
  const { mutate: deleteMessage } = useDeleteContactMessage();

  const filtered = useMemo(() => {
    const keyword = columnFilters.keyword.trim().toLowerCase();
    return [...messages]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((m) => {
        const isRead = Boolean(m.isRead);
        const matchStatus =
          !columnFilters.status ||
          (columnFilters.status === "read" ? isRead : !isRead);
        if (!keyword) return matchStatus;
        const haystack = [
          m.firstName,
          m.lastName,
          m.email,
          m.subject,
          m.message,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return matchStatus && haystack.includes(keyword);
      });
  }, [messages, columnFilters]);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const openMessage = (m) => {
    setViewingMessage(m);
    if (!m.isRead) markRead({ id: m.id, isRead: true });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-display font-bold text-ink">
          Tin nhắn liên hệ
          {unreadCount > 0 && (
            <span className="ml-2 text-xs font-medium px-2 py-1 rounded-tag bg-rust/20 text-rust align-middle">
              {unreadCount} chưa đọc
            </span>
          )}
        </h1>
      </div>

      <table className="w-full text-sm border border-line">
        <thead className="bg-paper">
          <tr className="text-left">
            <th className="p-3">Người gửi</th>
            <th className="p-3">Chủ đề</th>
            <th className="p-3">Ngày gửi</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Hành động</th>
          </tr>
          <tr className="bg-white border-t border-line">
            <th className="p-2">
              <input
                value={columnFilters.keyword}
                onChange={(e) =>
                  setColumnFilters((f) => ({ ...f, keyword: e.target.value }))
                }
                placeholder="Tìm theo tên, email, nội dung..."
                className="w-full border border-line rounded px-2 py-1 text-xs font-normal"
              />
            </th>
            <th className="p-2" />
            <th className="p-2" />
            <th className="p-2">
              <select
                value={columnFilters.status}
                onChange={(e) =>
                  setColumnFilters((f) => ({ ...f, status: e.target.value }))
                }
                className="w-full border border-line rounded px-2 py-1 text-xs font-normal"
              >
                <option value="">Tất cả</option>
                <option value="unread">Chưa đọc</option>
                <option value="read">Đã đọc</option>
              </select>
            </th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5} className="p-4 text-center">
                Đang tải...
              </td>
            </tr>
          )}
          {!isLoading && filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-ink/40">
                Không có tin nhắn nào khớp
              </td>
            </tr>
          )}
          {filtered.map((m) => (
            <tr
              key={m.id}
              className={`border-t border-line ${!m.isRead ? "bg-gold/5 font-medium" : ""}`}
            >
              <td className="p-3">
                <p className="truncate">
                  {m.firstName} {m.lastName}
                </p>
                <p className="text-xs text-ink/40 font-normal truncate">
                  {m.email}
                </p>
              </td>
              <td className="p-3 truncate max-w-55">
                {m.subject || <span className="text-ink/30">—</span>}
              </td>
              <td className="p-3 text-xs text-ink/60 font-normal">
                {new Date(m.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="p-3">
                {m.isRead ? (
                  <span className="text-xs font-normal text-ink/40">
                    Đã đọc
                  </span>
                ) : (
                  <span className="text-xs font-medium text-rust">
                    Chưa đọc
                  </span>
                )}
              </td>
              <td className="p-3 flex gap-2 font-normal">
                <button
                  onClick={() => openMessage(m)}
                  className="text-gold hover:underline"
                >
                  Xem
                </button>
                {m.isRead && (
                  <button
                    onClick={() => markRead({ id: m.id, isRead: false })}
                    className="text-ink/50 hover:underline"
                  >
                    Đánh dấu chưa đọc
                  </button>
                )}
                <button
                  onClick={() =>
                    window.confirm("Xóa tin nhắn này?") && deleteMessage(m.id)
                  }
                  className="text-rust hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewingMessage && (
        <MessageDetailModal
          message={viewingMessage}
          onClose={() => setViewingMessage(null)}
        />
      )}
    </div>
  );
}
