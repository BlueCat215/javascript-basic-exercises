export const LoadingState = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="h-56 bg-white border border-line rounded-tag animate-pulse"
        />
      ))}
    </div>
  );
};

export const ErrorState = ({ message }) => {
  return (
    <div className="border border-rust/30 bg-rust/5 text-rust px-4 py-3 text-sm rounded-tag">
      Không tải được dữ liệu: {message}
    </div>
  );
};

export const EmptyState = ({ onCreate }) => {
  return (
    <div className="border border-dashed border-line rounded-tag py-16 text-center">
      <p className="font-display text-lg text-ink">Chưa có sản phẩm nào</p>
      <p className="text-sm text-ink/50 mt-1">
        Thêm sản phẩm đầu tiên để bắt đầu quản lý kho hàng.
      </p>
      <button onClick={onCreate} className="btn-primary mt-4">
        + Thêm sản phẩm
      </button>
    </div>
  );
};
