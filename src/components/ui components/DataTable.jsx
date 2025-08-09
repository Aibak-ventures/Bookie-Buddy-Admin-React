import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const DataTable = ({
  columns = [],
  data = [],
  totalEntries,
  onNextPage,
  onPreviousPage,
  disableNext,
  disablePrevious,
   rowClickPath = '',
}) => {
  const navigate = useNavigate();


  const handleRowClick = (row) => {
    if (row?.id && rowClickPath) {
      navigate(`/${rowClickPath}/${row.id}`);
    }
  }

  

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th key={col.accessor} className="text-left py-3 px-4 font-semibold text-gray-600">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.accessor} className="py-4 px-4 text-gray-600">
                    {col.cell ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        {col.cell(row)}
                      </div>
                    ) : (
                      row[col.accessor]
                    )}
                  </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={onPreviousPage}
            disabled={disablePrevious}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNextPage}
            disabled={disableNext}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

