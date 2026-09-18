import { StarIcon } from "../../../../components/icons";

const TABS = [
  { key: "description", label: "Mô tả chi tiết" },
  { key: "reviews", label: "Đánh giá" },
  { key: "specs", label: "Thông số kỹ thuật" },
];

export const ProductTabs = ({ product, activeTab, onChangeTab }) => {
  return (
    <section className="pt-10">
      <div className="flex items-center gap-8 border-b border-line/60 mb-8 text-sm font-bold uppercase tracking-wider overflow-x-auto hide-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChangeTab(tab.key)}
            className={`pb-4 relative transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.key
                ? "text-green"
                : "text-ink/40 hover:text-ink/80"
            }`}
          >
            {tab.key === "reviews"
              ? `${tab.label} (${product.rating?.count || 0})`
              : tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      <div className="text-base sm:text-lg text-ink/80 leading-relaxed min-h-75">
        {activeTab === "description" && (
          <p className="max-w-4xl leading-8 text-ink">{product.description}</p>
        )}

        {activeTab === "reviews" &&
          (product.rating ? (
            <div className="flex items-center gap-6 p-6 bg-neutral-50/80 rounded-xl border border-line/50 max-w-md">
              <div className="text-5xl font-display font-bold text-ink">
                {product.rating.rate}
              </div>
              <div>
                <div className="flex text-gold mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      size={20}
                      className={
                        i < Math.round(product.rating.rate)
                          ? "fill-gold text-gold"
                          : "text-line/60"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-ink/50 font-medium">
                  Dựa trên {product.rating.count} đánh giá từ khách hàng
                </p>
              </div>
            </div>
          ) : (
            <p className="italic text-ink/50 text-base">
              Sản phẩm chưa có đánh giá nào.
            </p>
          ))}

        {activeTab === "specs" && (
          <div className="w-full max-w-4xl mx-auto border border-line rounded overflow-hidden mt-6 mb-12 ">
            <table className="w-full text-base sm:text-lg text-left">
              <tbody className="divide-y divide-line/60">
                <tr className="bg-neutral-50/50 transition-colors hover:bg-neutral-100/50">
                  <th className="py-5 px-6 sm:py-6 sm:px-8 font-semibold text-ink w-1/3">
                    Mã sản phẩm
                  </th>
                  <td className="py-5 px-6 sm:py-6 sm:px-8 font-mono">
                    #{product.id}
                  </td>
                </tr>
                <tr className="transition-colors hover:bg-neutral-50/30">
                  <th className="py-5 px-6 sm:py-6 sm:px-8 font-semibold text-ink capitalize">
                    Danh mục
                  </th>
                  <td className="py-5 px-6 sm:py-6 sm:px-8 capitalize">
                    {product.category}
                  </td>
                </tr>
                {product.brand && (
                  <tr className="bg-neutral-50/50 transition-colors hover:bg-neutral-100/50">
                    <th className="py-5 px-6 sm:py-6 sm:px-8 font-semibold text-ink">
                      Thương hiệu
                    </th>
                    <td className="py-5 px-6 sm:py-6 sm:px-8 font-medium">
                      {product.brand}
                    </td>
                  </tr>
                )}
                <tr className="transition-colors hover:bg-neutral-50/30">
                  <th className="py-5 px-6 sm:py-6 sm:px-8 font-semibold text-ink">
                    Giá niêm yết
                  </th>
                  <td className="py-5 px-6 sm:py-6 sm:px-8 font-bold text-green">
                    ${product.price}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
