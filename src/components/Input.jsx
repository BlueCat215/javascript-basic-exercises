import { useId } from "react";

export function Input({
  label,
  error,
  iconLeft: IconLeft,
  iconRight: IconRight,
  id,
  className = "",
  ...props
}) {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {IconLeft && (
          <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
            <IconLeft className="w-5 h-5" />
          </div>
        )}

        <input
          id={inputId}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all
            ${IconLeft ? "pl-10" : ""}   /* Nối lề trái nếu có Icon */
            ${IconRight ? "pr-10" : ""}  /* Nối lề phải nếu có Icon */
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }
            ${className}`}
          {...props}
        />

        {IconRight && (
          <div className="absolute right-3 text-gray-400 flex items-center">
            <IconRight className="w-5 h-5" />
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 font-medium animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
}
