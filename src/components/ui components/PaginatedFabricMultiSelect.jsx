import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Loader2, Check } from "lucide-react";
import { fetchFabrics } from "../../api/MarketplaceApis"; // Adjust relative import path as needed

const PaginatedFabricMultiSelect = ({
  value = [],
  onChange,
  error,
  disabled = false,
  label = "Fabrics",
  placeholder = "Select fabrics",
}) => {
  const [fabrics, setFabrics] = useState([]);
  const [filteredFabrics, setFilteredFabrics] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!dropdownOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchFabrics(currentPage, "", "true");
        const list = res?.data?.data || res?.data?.results || res?.results || [];
        setFabrics(list);
        setHasNext(Boolean(res?.data?.next || res?.next));
        setHasPrev(Boolean(res?.data?.previous || res?.previous));
      } catch (err) {
        setFabrics([]);
        setHasNext(false);
        setHasPrev(false);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, dropdownOpen]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredFabrics(
      fabrics.filter((item) =>
        item.name?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, fabrics]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const selectedIds = (value || []).map((v) => (typeof v === "object" ? v.id : v));

  const handleToggle = (fabricId) => {
    const exists = selectedIds.includes(fabricId);
    const updated = exists
      ? selectedIds.filter((id) => id !== fabricId)
      : [...selectedIds, fabricId];
    onChange(updated);
  };

  const getDisplayText = () => {
    if (!selectedIds.length) return placeholder;
    return `${selectedIds.length} fabric${selectedIds.length > 1 ? "s" : ""} selected`;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setDropdownOpen((o) => !o)}
        className={`w-full border rounded-lg px-3 py-2 text-left text-sm flex justify-between items-center bg-white ${
          error
            ? "border-red-500 ring-1 ring-red-500"
            : "border-gray-300 focus:ring-2 focus:ring-purple-600"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className={!selectedIds.length ? "text-gray-400" : "text-gray-900 font-medium"}>
          {getDisplayText()}
        </span>
        {dropdownOpen ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {dropdownOpen && (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg flex flex-col">
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <input
              type="text"
              placeholder="Search fabric..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2.5 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {loading ? (
              <div className="p-4 flex justify-center items-center text-purple-600 text-xs gap-2">
                <Loader2 size={16} className="animate-spin" /> Loading fabrics...
              </div>
            ) : filteredFabrics.length === 0 ? (
              <p className="p-3 text-center text-xs text-gray-500">
                No fabrics found
              </p>
            ) : (
              filteredFabrics.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggle(item.id)}
                    className={`cursor-pointer px-3 py-2 text-sm transition flex items-center justify-between hover:bg-purple-50 ${
                      isSelected
                        ? "bg-purple-50 text-purple-900 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span>{item.name}</span>
                    </div>
                    {isSelected && <Check size={16} className="text-purple-600" />}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-between border-t border-gray-200 px-3 py-1.5 bg-gray-50 text-xs">
            <button
              type="button"
              disabled={!hasPrev || disabled}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="font-medium text-purple-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:underline"
            >
              Previous
            </button>
            <span className="text-gray-400 font-medium">Page {currentPage}</span>
            <button
              type="button"
              disabled={!hasNext || disabled}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="font-medium text-purple-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:underline"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedFabricMultiSelect;