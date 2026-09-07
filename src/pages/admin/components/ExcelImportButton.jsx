import { useRef } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import adminProductService from "../services/adminProductService";
import { useQueryClient } from "@tanstack/react-query";

export const ExcelImportButton = ({ onImported }) => {
  const inputRef = useRef(null);
  const queryClient = useQueryClient();
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    try {
      const result = await adminProductService.bulkImport(rows);
      if (result.skippedCount > 0) {
        toast.error(
          `Import ${result.count} thành công, bỏ qua ${result.skippedCount} dòng thiếu dữ liệu`,
        );
        console.warn("Các dòng bị bỏ qua:", result.skipped);
      } else {
        toast.success(`Đã import ${result.count} sản phẩm`);
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      onImported?.();
    } catch {
      toast.error("Import thất bại — kiểm tra định dạng file");
    } finally {
      e.target.value = "";
    }
  };
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={() => inputRef.current.click()}
        className="btn-secondary text-sm px-4 py-2"
      >
        Import Excel
      </button>
    </>
  );
};
