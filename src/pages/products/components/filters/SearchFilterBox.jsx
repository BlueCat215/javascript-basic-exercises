import { SearchIcon } from "../../../../components/icons";

export function SearchFilterBox({ value, onChange }) {
  return (
    <div className="bg-white border border-line rounded-lg p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-ink mb-3 flex items-center gap-2">
        <SearchIcon size={14} /> Tìm kiếm
      </p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tên sản phẩm..."
        className="w-full border border-line rounded-full px-4 py-2 text-sm"
      />
    </div>
  );
}
