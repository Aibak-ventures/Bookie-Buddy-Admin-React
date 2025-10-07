import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchShops } from "../../api/AdminApis";

const PaginatedShopDropdown = ({ value, onChange, error, disabled }) => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState("/api/v1/shop/admin/shops/"); // adjust to your API
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);

  // Fetch shops when dropdown opens or page changes
  useEffect(() => {
    if (!dropdownOpen) return;

    const loadShops = async () => {
      setLoading(true);
      try {
        const data = await fetchShops(currentPageUrl);
        
        setShops(data.results);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
      } catch (err) {
        setShops([]);
        setNextPageUrl(null);
        setPrevPageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, [currentPageUrl, dropdownOpen]);

  // Filter shops by search term
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredShops(
      shops.filter(
        (s) =>
          s.name?.toLowerCase().includes(term) ||
          s.owner_name?.toLowerCase().includes(term) ||
          s.phone?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, shops]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const selectedShopLabel = (() => {
    const selectedShop = shops.find((s) => s.id === value?.id);
    return selectedShop
      ? `${selectedShop.name || "(No Name)"} - ${selectedShop.phone || "No phone"}`
      : "Select a shop";
  })();

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1 font-medium text-gray-700">Shop</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setDropdownOpen((o) => !o)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-left flex justify-between items-center"
      >
        {selectedShopLabel}
        {dropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {error && <p className="text-red-600 text-sm mt-1 ml-1">{error}</p>}

      {dropdownOpen && (
        <div className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded border border-gray-300 bg-white shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by shop name, owner, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          {loading ? (
            <p className="p-2 text-center text-blue-500">Loading...</p>
          ) : filteredShops.length === 0 ? (
            <p className="p-2 text-center text-gray-500">No shops found</p>
          ) : (
            filteredShops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => {
                  onChange(shop);
                  setDropdownOpen(false);
                  setSearchTerm("");
                }}
                className={`cursor-pointer px-3 py-2 hover:bg-blue-100 ${
                  value?.id === shop.id ? "bg-blue-200 font-semibold" : ""
                }`}
              >
                {`${shop.name || "(No Name)"} - ${shop.phone || "No phone"}`}
              </div>
            ))
          )}

          {/* Pagination */}
          <div className="flex justify-between border-t border-gray-300 px-3 py-1 bg-gray-50">
            <button
              disabled={!prevPageUrl || disabled}
              onClick={() => prevPageUrl && setCurrentPageUrl(prevPageUrl)}
              className={`text-sm font-medium text-blue-600 disabled:text-gray-400`}
            >
              Prev
            </button>
            <button
              disabled={!nextPageUrl || disabled}
              onClick={() => nextPageUrl && setCurrentPageUrl(nextPageUrl)}
              className={`text-sm font-medium text-blue-600 disabled:text-gray-400`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedShopDropdown;
