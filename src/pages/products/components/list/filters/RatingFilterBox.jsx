import { StarIcon } from "../../../../../components/icons";

export function RatingFilterBox({ options, selected, onSelect, onClear }) {
  return (
    <div className="bg-white border border-line rounded-lg p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
        Đánh giá
      </p>
      <div className="space-y-2 text-xs">
        {options.map((r) => (
          <label
            key={r}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <input
                type="radio"
                name="rating"
                checked={selected === String(r)}
                onChange={() => onSelect(r)}
                className="text-green mr-1"
              />
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  size={12}
                  className={i < r ? "fill-gold text-gold" : "text-line"}
                />
              ))}
            </span>
          </label>
        ))}
        {selected && (
          <button
            onClick={onClear}
            className="text-[11px]  text-rust hover:underline"
          >
            Bỏ chọn
          </button>
        )}
      </div>
    </div>
  );
}
