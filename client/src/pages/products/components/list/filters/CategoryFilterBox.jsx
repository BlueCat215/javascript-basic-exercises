import { ChevronRightIcon } from "../../../../../components/icons";

export function CategoryFilterBox({ categories, selected, onSelect }) {
  return (
    <div className="bg-white border border-line rounded-lg p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
        Danh mục
      </p>
      <ul className="text-xs text-ink/70 divide-y divide-line">
        <li>
          <button
            onClick={() => onSelect(null)}
            className={`w-full text-left py-2 flex items-center justify-between hover:text-green ${!selected ? "text-green font-semibold" : ""}`}
          >
            Tất cả <ChevronRightIcon size={12} />
          </button>
        </li>
        {categories.map((c) => (
          <li key={c}>
            <button
              onClick={() => onSelect(c)}
              className={`w-full text-left py-2 flex items-center justify-between hover:text-green capitalize ${selected === c ? "text-green font-semibold" : ""}`}
            >
              {c} <ChevronRightIcon size={12} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
