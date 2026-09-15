export function BrandFilterBox({ brands, selected, onToggle }) {
  return (
    <div className="bg-white border border-line rounded-lg p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
        Thương hiệu
      </p>
      <div className="space-y-2 text-xs text-ink/70">
        {brands.map((b) => (
          <label
            key={b.name}
            className="flex items-center justify-between cursor-pointer hover:text-green"
          >
            <span className="flex items-center">
              <input
                type="checkbox"
                checked={selected.includes(b.name)}
                onChange={() => onToggle(b.name)}
                className="rounded border-line text-green mr-2"
              />
              {b.name}
            </span>
            <span className="text-ink/30 text-[11px]">({b.count})</span>
          </label>
        ))}
      </div>
    </div>
  );
}
