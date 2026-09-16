export function QuickFiltersBox({ filters, state, onToggle }) {
  return (
    <div className="bg-white border border-line rounded-lg p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
        Bộ lọc nhanh
      </p>
      <div className="space-y-2 text-xs text-ink/70">
        {filters.map((f) => (
          <label
            key={f.key}
            className="flex items-center gap-2 cursor-pointer hover:text-green"
          >
            <input
              type="checkbox"
              checked={state[f.key]}
              onChange={() => onToggle(f.key)}
              className="rounded border-line text-green"
            />
            {f.label}
          </label>
        ))}
      </div>
    </div>
  );
}
