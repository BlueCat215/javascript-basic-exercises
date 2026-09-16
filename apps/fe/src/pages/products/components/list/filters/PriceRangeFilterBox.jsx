export function PriceRangeFilterBox({
  min,
  max,
  onMinChange,
  onMaxChange,
  onApply,
}) {
  return (
    <div className="bg-white border border-line rounded-lg p-4 min-w-0">
      <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
        Khoảng giá
      </p>
      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex items-center flex-1 min-w-0 border border-line rounded px-2">
            <span className="text-ink/50 shrink-0">$</span>
            <input
              type="number"
              value={min}
              onChange={(e) => onMinChange(e.target.value)}
              className="w-full min-w-0 text-center py-1.5 px-1 outline-none"
            />
          </div>
          <span className="text-ink/40 shrink-0">—</span>
          <div className="flex items-center flex-1 min-w-0 border border-line rounded px-2">
            <span className="text-ink/50 shrink-0">$</span>
            <input
              type="number"
              value={max}
              onChange={(e) => onMaxChange(e.target.value)}
              className="w-full min-w-0 text-center py-1.5 px-1 outline-none"
            />
          </div>
        </div>
        <button
          onClick={onApply}
          className="w-full bg-green hover:bg-green-light text-white text-xs px-3 py-2 rounded font-semibold"
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
}
