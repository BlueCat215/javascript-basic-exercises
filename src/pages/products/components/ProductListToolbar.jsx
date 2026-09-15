export function ProductListToolbar({
  data,
  pageSize,
  sort,
  onPageSizeChange,
  onSortChange,
}) {
  return (
    <div className="bg-white border border-line rounded-lg p-3 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
      <div className="text-ink/50 font-medium">
        {data && (
          <>
            <span className="text-ink font-bold">
              {(data.page - 1) * data.pageSize + 1}–
              {Math.min(data.page * data.pageSize, data.total)}
            </span>{" "}
            / {data.total} kết quả
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-ink/50">Hiển thị</span>
          {[12, 24, 48].map((n) => (
            <button
              key={n}
              onClick={() => onPageSizeChange(n)}
              className={`font-bold ${pageSize === n ? "text-green underline" : "text-ink/50 hover:text-ink"}`}
            >
              {n}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-line rounded px-2 py-1 text-xs"
        >
          <option value="">Mặc định</option>
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="discount_desc">Giảm giá nhiều nhất</option>
          <option value="rating_desc">Đánh giá cao nhất</option>
        </select>
      </div>
    </div>
  );
}
