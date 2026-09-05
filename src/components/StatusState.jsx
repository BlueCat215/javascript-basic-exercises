export const LoadingState = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
  </div>
);

export const ErrorState = ({ message = "Đã có lỗi xảy ra" }) => (
  <div className="text-center py-20">
    <p className="text-rust font-medium">{message}</p>
  </div>
);

export const EmptyState = ({ message = "Không tìm thấy sản phẩm nào" }) => (
  <div className="text-center py-20">
    <p className="text-ink/50">{message}</p>
  </div>
);
