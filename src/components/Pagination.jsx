import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 pt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 grid place-items-center border border-line rounded-full disabled:opacity-40"
      >
        <ChevronLeftIcon size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-tag text-sm ${
            p === currentPage
              ? "bg-ink text-white"
              : "border border-line hover:bg-paper"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 grid place-items-center border border-line rounded-full disabled:opacity-40"
      >
        <ChevronRightIcon size={16} />
      </button>
    </div>
  );
};
