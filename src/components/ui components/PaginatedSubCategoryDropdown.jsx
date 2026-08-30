import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { fetchSubCategories } from "../../api/MarketplaceApis"; // Adjust path as needed

const PaginatedSubCategoryDropdown = ({
  value,
  initialLabel, // 1. Accept initialLabel prop (e.g., passed from parent row object)
  categoryId, // Dependent parent ID if required
  onChange,
  error,
  disabled,
  label = "Sub Category",
  required = true,
}) => {
  const [subCategories, setSubCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedObject, setSelectedObject] = useState(null);

  const dropdownRef = useRef(null);

  // Sync selected state on value change
  useEffect(() => {
    if (!value) {
      setSelectedObject(null);
      return;
    }

    if (typeof value === "object") {
      setSelectedObject(value);
      return;
    }

    const found = subCategories.find((cat) => String(cat.id) === String(value));
    if (found) {
      setSelectedObject(found);
    }
  }, [value, subCategories]);

  // Fetch subcategories
  useEffect(() => {
    if (!dropdownOpen) return;

    const loadSubCategories = async () => {
      setLoading(true);
      try {
        const res = await fetchSubCategories(currentPage, searchTerm, "true");
        const items = res?.data?.data || res?.data?.results || res?.results || res?.data || [];
        setSubCategories(items);

        const nextUrl = res?.data?.next ?? res?.next ?? null;
        const prevUrl = res?.data?.previous ?? res?.previous ?? null;

        setHasNext(Boolean(nextUrl));
        setHasPrev(Boolean(prevUrl) || currentPage > 1);
      } catch (err) {
        setSubCategories([]);
        setHasNext(false);
        setHasPrev(false);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadSubCategories();
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, dropdownOpen, categoryId]);

  // Handle outside click
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

  // 2. Updated resolution logic to handle initialLabel
  const selectedSubCategoryLabel = (() => {
    if (!value) return "Select a sub category";

    // Priority 1: Direct initialLabel prop if passed explicitly
    if (initialLabel) return initialLabel;

    const selectedId = typeof value === "object" ? value.id : value;

    // Priority 2: Found in current paginated list
    const foundInList = subCategories.find((cat) => String(cat.id) === String(selectedId));
    if (foundInList) return foundInList.name || foundInList.sub_category_name;

    // Priority 3: Saved selected object state
    if (selectedObject) {
      if (selectedObject.name) return selectedObject.name;
      if (selectedObject.sub_category_name) return selectedObject.sub_category_name;
      if (selectedObject.category_name) return selectedObject.category_name;
    }

    // Priority 4: Object passed inside value prop
    if (typeof value === "object") {
      if (value.name) return value.name;
      if (value.sub_category_name) return value.sub_category_name;
      if (value.category_name) return value.category_name;
    }

    return `Sub Category #${selectedId}`;
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
          {selectedSubCategoryLabel}
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
              placeholder="Search sub category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-md px-2.5 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>

          {/* Sub Category List */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {loading ? (
              <div className="p-4 flex justify-center items-center text-purple-600 text-xs gap-2">
                <Loader2 size={16} className="animate-spin" /> Loading sub categories...
              </div>
            ) : subCategories.length === 0 ? (
              <p className="p-3 text-center text-xs text-gray-500">No sub categories found</p>
            ) : (
              subCategories.map((cat) => {
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
                    {cat.name || cat.sub_category_name}
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

export default PaginatedSubCategoryDropdown;