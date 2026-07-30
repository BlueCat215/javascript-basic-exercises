import React, { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

export const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 z-20 flex flex-col
          ${isCollapsed ? "w-20" : "w-64"} 
          ${isMobileOpen ? "fixed inset-y-0 left-0 translate-x-0" : "fixed -translate-x-full md:relative md:translate-x-0"}
        `}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <span
            className={`font-bold text-xl truncate ${isCollapsed ? "hidden" : "block"}`}
          >
            AdminPro
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-800 rounded hidden md:block"
          >
            {isCollapsed ? ">" : "<"}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {["Tổng quan", "Giao dịch", "Khách hàng", "Cài đặt"].map(
            (item, idx) => (
              <a
                key={idx}
                href="#"
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              >
                <span className="text-xl">+</span>
                {!isCollapsed && <span>{item}</span>}
              </a>
            ),
          )}
        </nav>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col w-full min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 w-full max-w-md">
            <button
              className="md:hidden text-2xl"
              onClick={() => setIsMobileOpen(true)}
            >
              ☰
            </button>
            <Input
              placeholder="Tìm kiếm giao dịch..."
              className="bg-gray-50 border-none hidden sm:block"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Thông báo
            </Button>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
