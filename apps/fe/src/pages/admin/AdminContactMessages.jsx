import { useState, useMemo } from "react";
import {
  useAdminContactMessagesQuery,
  useMarkContactMessageRead,
  useDeleteContactMessage,
} from "./hooks/useAdminContactQueries";

const filterInputClass =
  "w-full border-b border-line bg-transparent py-1 text-xs font-normal focus:outline-none focus:border-gold transition-colors";

function MessageDetailPanel({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-ink/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md h-full bg-surface border-l border-line flex flex-col">
        <div className="flex items-center justify-between px-6 h-14 border-b border-line shrink-0">
          <h2 className="font-display font-semibold text-ink">
            {message.firstName} {message.lastName}
          </h2>
          <button
            onClick={onClose}
            className="text-ink/40 hover:text-ink text-xl leading-none"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <p className="text-xs text-ink/40">
            {new Date(message.createdAt).toLocaleString("vi-VN")}
          </p>

          <div className="text-sm space-y-2 text-ink/70">
            <p>
              <span className="text-ink/45">Email </span>
              {message.email}
            </p>
            {message.phone && (
              <p>
                <span className="text-ink/45">SĐT </span>
                {message.phone}
              </p>
            )}
            {message.country && (
              <p>
                <span className="text-ink/45">Quốc gia </span>
                {message.country}
              </p>
            )}
            {message.subject && (
              <p>
                <span className="text-ink/45">Chủ đề </span>
                {message.subject}
              </p>
            )}
          </div>

          <div className="border-t border-line pt-4">
            <p className="text-sm font-medium text-ink mb-2">Nội dung</p>
            <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">
              {message.message}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-line shrink-0">
          <button
            onClick={onClose}
            className="text-sm text-ink/60 hover:text-ink"
          >
            Đóng
          </button>
        </div>
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
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/50">Quản trị</p>
        <h1 className="text-xl font-display font-semibold text-ink mt-1 flex items-center gap-2">
          Tin nhắn liên hệ
          {unreadCount > 0 && (
            <span className="text-xs font-mono font-medium text-rust border border-rust/40 rounded-sm px-1.5 py-0.5">
              {unreadCount} chưa đọc
            </span>
          )}
        </h1>
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-sm">
          <thead className="bg-paper">
            <tr className="text-left">
              <th className="p-3 font-medium text-ink/60">Người gửi</th>
              <th className="p-3 font-medium text-ink/60">Chủ đề</th>
              <th className="p-3 font-medium text-ink/60">Ngày gửi</th>
              <th className="p-3 font-medium text-ink/60">Trạng thái</th>
              <th className="p-3 font-medium text-ink/60">Hành động</th>
            </tr>
            <tr className="bg-surface border-t border-line">
              <th className="p-2 font-normal">
                <input
                  value={columnFilters.keyword}
                  onChange={(e) =>
                    setColumnFilters((f) => ({ ...f, keyword: e.target.value }))
                  }
                  placeholder="Tìm theo tên, email, nội dung..."
                  className={filterInputClass}
                />
              </th>
              <th className="p-2" />
              <th className="p-2" />
              <th className="p-2 font-normal">
                <select
                  value={columnFilters.status}
                  onChange={(e) =>
                    setColumnFilters((f) => ({ ...f, status: e.target.value }))
                  }
                  className={filterInputClass}
                >
                  <option value="">Tất cả</option>
                  <option value="unread">Chưa đọc</option>
                  <option value="read">Đã đọc</option>
                </select>
              </th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-ink/50">
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
              <tr key={m.id} className={!m.isRead ? "bg-gold/5" : ""}>
                <td className="p-3">
                  <p
                    className={`truncate ${!m.isRead ? "font-medium text-ink" : "text-ink/80"}`}
                  >
                    {m.firstName} {m.lastName}
                  </p>
                  <p className="text-xs text-ink/40 truncate">{m.email}</p>
                </td>
                <td className="p-3 truncate max-w-55 text-ink/70">
                  {m.subject || <span className="text-ink/30">—</span>}
                </td>
                <td className="p-3 text-xs text-ink/60">
                  {new Date(m.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        m.isRead ? "bg-ink/20" : "bg-rust"
                      }`}
                    />
                    {m.isRead ? "Đã đọc" : "Chưa đọc"}
                  </span>
                </td>
                <td className="p-3 flex gap-3">
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
      </div>

      {viewingMessage && (
        <MessageDetailPanel
          message={viewingMessage}
          onClose={() => setViewingMessage(null)}
        />
      )}
    </div>
  );
}
