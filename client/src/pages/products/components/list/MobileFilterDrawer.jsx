export function MobileFilterDrawer({ isOpen, onClose, resultCount, children }) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[88vw] max-w-sm bg-paper flex flex-col">
        <div className="flex items-center justify-between p-4 bg-white border-b border-line shrink-0">
          <p className="font-display font-bold text-ink">Bộ lọc</p>
          <button
            onClick={onClose}
            aria-label="Đóng bộ lọc"
            className="text-ink/50 text-xl leading-none px-1"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">{children}</div>
        <div className="p-4 bg-white border-t border-line shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-green hover:bg-green-light text-white text-sm font-bold py-2.5 rounded"
          >
            Xem kết quả{resultCount !== undefined ? ` (${resultCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
