// import { Link } from "react-router-dom";
// import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

// export const RecentlyViewedSection = ({ excludeId }) => {
//   const items = useRecentlyViewed(excludeId);
//   if (items.length === 0) return null;

//   return (
//     <section className="bg-white rounded-lg border border-line p-5">
//       <h2 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">
//         Sản phẩm đã xem gần đây
//       </h2>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {items.map((p) => (
//           <Link
//             key={p.id}
//             to={`/products/${p.id}`}
//             className="flex items-center gap-3 p-2 border border-line rounded hover:border-green transition"
//           >
//             <img
//               src={p.image}
//               alt={p.title}
//               className="w-12 h-12 object-contain rounded bg-paper"
//             />
//             <div className="text-[11px] leading-tight min-w-0">
//               <span className="text-ink font-semibold block truncate">
//                 {p.title}
//               </span>
//               <span className="text-green font-bold">${p.price}</span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// };
import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

export const RecentlyViewedSection = ({ excludeId }) => {
  const items = useRecentlyViewed(excludeId);
  if (items.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl border border-line shadow-sm p-6 lg:p-8">
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink mb-6">
        Sản phẩm đã xem gần đây
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="flex items-center gap-4 p-3 border border-line rounded-xl hover:border-green/50 hover:shadow-sm hover:bg-paper transition-all group"
          >
            <div className="shrink-0 w-14 h-14 bg-white border border-line/40 rounded-lg flex items-center justify-center p-1.5 overflow-hidden">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="text-xs leading-snug min-w-0 flex-1">
              <span className="text-ink font-semibold block truncate mb-1 group-hover:text-green transition-colors">
                {p.title}
              </span>
              <span className="text-green font-extrabold text-sm">
                ${p.price}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
