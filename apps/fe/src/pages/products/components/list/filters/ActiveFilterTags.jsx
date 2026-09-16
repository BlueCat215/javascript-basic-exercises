export function ActiveFilterTags({ tags, onRemove, onClearAll }) {
  if (tags.length === 0) return null;

  return (
    <div className="bg-white border border-line rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-ink">
          Đang lọc
        </p>
        <button
          onClick={onClearAll}
          className="text-[11px] text-rust hover:underline"
        >
          Xóa hết
        </button>
      </div>
      <div className="flex flex-wrap gap-2 text-[11px]">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center bg-paper px-2.5 py-1 rounded text-ink/70 capitalize"
          >
            {tag.label}
            <button
              onClick={() => onRemove(tag)}
              className="ml-1.5 text-ink/40 hover:text-ink"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
