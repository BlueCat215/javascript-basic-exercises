import { ProductForm } from "./ProductForm";
export const ProductDrawer = ({
  isOpen,
  selectedId,
  form,
  onChange,
  onClose,
  onCreate,
  onUpdate,
  onPatchPrice,
  isAdding,
  isUpdating,
  isPatching,
  productDetail,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={selectedId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white border-l border-line shadow-2xl flex flex-col
          transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
              {selectedId ? `Sản phẩm #${selectedId}` : "Tạo mới"}
            </p>
            <h2 className="font-display text-lg font-semibold text-ink mt-0.5">
              {selectedId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 grid place-items-center rounded-full text-ink/50 hover:bg-paper hover:text-ink transition-colors"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <ProductForm form={form} onChange={onChange} />

          {productDetail && (
            <details className="mt-6">
              <summary className="font-mono text-[11px] uppercase tracking-widest text-ink/40 cursor-pointer select-none">
                Dữ liệu gốc từ server
              </summary>
              <pre className="mt-2 bg-paper border border-line rounded-tag p-3 text-[11px] overflow-x-auto">
                {JSON.stringify(productDetail, null, 2)}
              </pre>
            </details>
          )}
        </div>

        <footer className="px-6 py-4 border-t border-line flex gap-2">
          {!selectedId ? (
            <button
              onClick={onCreate}
              disabled={isAdding}
              className="btn-primary flex-1"
            >
              {isAdding ? "Đang lưu…" : "Thêm sản phẩm"}
            </button>
          ) : (
            <>
              <button
                onClick={onUpdate}
                disabled={isUpdating}
                className="btn-primary flex-1"
              >
                {isUpdating ? "Đang lưu…" : "Lưu toàn bộ"}
              </button>
              <button
                onClick={onPatchPrice}
                disabled={isPatching}
                className="btn-secondary"
              >
                {isPatching ? "…" : "Chỉ sửa giá"}
              </button>
            </>
          )}
        </footer>
      </aside>
    </div>
  );
};
