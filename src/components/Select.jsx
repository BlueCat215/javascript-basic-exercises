import { useState, useRef, useEffect } from "react";

import React from "react";

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Chọn một lựa chọn...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={selectRef}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
      >
        <span
          className={
            selectedOption ? "text-gray-900 font-medium" : "text-gray-400"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={`transition-transform duration-200 text-xs text-gray-500 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <ul className="absolute z-20 w-full top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto py-1">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors flex justify-between items-center ${
                opt.value === value
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-gray-700"
              }`}
            >
              {opt.label}
              {opt.value === value && <span>✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
