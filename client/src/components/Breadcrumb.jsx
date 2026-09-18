import { Link } from "react-router-dom";
import { ChevronRightIcon } from "./icons";

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 w-full overflow-hidden">
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-ink">
        <li className="flex items-center shrink-0">
          <Link
            to="/"
            className="hover:text-green transition-colors whitespace-nowrap"
          >
            Trang chủ
          </Link>
        </li>

        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={item.to || item.label || i}
              className="flex items-center gap-1.5 sm:gap-2 min-w-0"
            >
              <ChevronRightIcon size={11} className="text-ink shrink-0" />
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-green transition-colors truncate max-w-30 sm:max-w-50 md:max-w-none"
                  title={item.label}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-ink font-semibold truncate max-w-37 sm:max-w-62 md:max-w-none"
                  aria-current={isLast ? "page" : undefined}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
