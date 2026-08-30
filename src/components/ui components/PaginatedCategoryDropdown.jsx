import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { fetchCategories } from "../../api/MarketplaceApis"; // Adjust import path as needed

const PaginatedCategoryDropdown = ({
  value,
  initialLabel, // Accepts category_name when passed explicitly from edit row object
  onChange,
  error,
  disabled,
  label = "Parent Category",
  required = true,
}) => {
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedObject, setSelectedObject] = useState(null);

  const dropdownRef = useRef(null);
  console.log("gggggggggggggg",initialLabel);
  

  // Load category object on initial render or edit mode change
  useEffect(() => {
    if (!value) {
      setSelectedObject(null);
      return;
    }

    // If value passed as object containing name or category_name
    if (typeof value === "object") {
      setSelectedObject(value);
      return;
    }

    // Try finding the selected category from the current list
    const found = categories.find((cat) => String(cat.id) === String(value));
    if (found) {
      setSelectedObject(found);
    }
  }, [value, categories]);

  // Fetch categories when dropdown opens or page/search changes
  useEffect(() => {
    if (!dropdownOpen) return;

    const loadCategories = async () => {
      setLoading(true);
      try {
        const res = await fetchCategories(currentPage, searchTerm, "true");
        const items = res?.data?.data || res?.data?.results || res?.results || res?.data || [];
        setCategories(items);

        const nextUrl = res?.data?.next ?? res?.next ?? null;
        const prevUrl = res?.data?.previous ?? res?.previous ?? null;

        setHasNext(Boolean(nextUrl));
        setHasPrev(Boolean(prevUrl) || currentPage > 1);
      } catch (err) {
        setCategories([]);
        setHasNext(false);
        setHasPrev(false);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadCategories();
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, dropdownOpen]);

  // Handle outside click to close dropdown
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

  // Resolve display label priority order
  const selectedCategoryLabel = (() => {
    if (!value) return "Select a parent category";

    // 1. Direct initialLabel prop if provided
    if (initialLabel) return initialLabel;

    const selectedId = typeof value === "object" ? value.id : value;

    // 2. Found in current paginated list
    const foundInList = categories.find((cat) => String(cat.id) === String(selectedId));
    if (foundInList) return foundInList.name;

    // 3. Saved selected object
    if (selectedObject) {
      if (selectedObject.name) return selectedObject.name;
      if (selectedObject.category_name) return selectedObject.category_name;
    }

    // 4. Value object keys
    if (typeof value === "object") {
      if (value.name) return value.name;
      if (value.category_name) return value.category_name;
    }

    return `Category #${selectedId}`;
  })();

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setDropdownOpen((o) => !o)}
        className={`w-full border rounded-lg px-3 py-2 text-left text-sm flex justify-between items-center bg-white ${
          error ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-purple-600"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className={!value ? "text-gray-400" : "text-gray-900 font-medium"}>
          {selectedCategoryLabel}
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
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <input
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-md px-2.5 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>

          {/* Category List */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {loading ? (
              <div className="p-4 flex justify-center items-center text-purple-600 text-xs gap-2">
                <Loader2 size={16} className="animate-spin" /> Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <p className="p-3 text-center text-xs text-gray-500">No categories found</p>
            ) : (
              categories.map((cat) => {
                const selectedId = typeof value === "object" ? value.id : value;
                const isSelected = String(selectedId) === String(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedObject(cat);
                      onChange(cat.id, cat);
                      setDropdownOpen(false);
                      setSearchTerm("");
                    }}
                    className={`cursor-pointer px-3 py-2 text-sm transition hover:bg-purple-50 ${
                      isSelected ? "bg-purple-100 text-purple-800 font-semibold" : "text-gray-700"
                    }`}
                  >
                    {cat.name}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
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

export default PaginatedCategoryDropdown;