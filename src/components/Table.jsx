export const Table = ({
  columns = [],
  data = [],
  emptyMessage = "Không có dữ liệu",
}) => {
  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-6 py-3.5 font-semibold text-gray-700 select-none"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-gray-400 font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.id || index}
                className="px-6 py-4 text-gray-600 align-middle"
              >
                {columns.map((col, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-gray-600 align-middle"
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
