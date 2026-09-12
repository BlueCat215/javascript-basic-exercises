import { Link } from "react-router-dom";
import { ChevronRightIcon } from "./icons";
export const Breadcrumb = ({ items }) => {
  <nav className="text-xs text-ink/50 mb-4 flex items-center gap-2">
    <Link to="/" className="hover:text-green">
      Trang chủ
    </Link>
    {items.map((items, i) => (
      <span key={i} className="flex items-center gap-2">
        <ChevronRightIcon size={11} className="flex items-center gap-2">
          {items.to ? (
            <Link to={items.to} className="hover:text-green">
              {items.label}
            </Link>
          ) : (
            <span className="text-ink font-medium">{items.label}</span>
          )}
        </ChevronRightIcon>
      </span>
    ))}
  </nav>;
};
