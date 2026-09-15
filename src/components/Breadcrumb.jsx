import { Link } from "react-router-dom";
import { ChevronRightIcon } from "./icons";

export const Breadcrumb = ({ items }) => {
  return (
    <nav className="text-xs text-ink mb-4 flex items-center gap-2">
      <Link to="/" className="hover:text-green">
        Trang chủ
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <ChevronRightIcon size={11} className="text-ink" />
          {item.to ? (
            <Link to={item.to} className="hover:text-green">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};
