import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchMainServices } from "../../api/AdminApis"; // ✅ adjust path

const PaginatedMainServiceDropdown = ({ value, onChange, error, disabled }) => {
  const [services, setServices] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState(
    "/api/v1/service/admin/main-services/"
  );

  const dropdownRef = useRef(null);

  // fetch services whenever dropdown opens or page changes
  useEffect(() => {
    if (!dropdownOpen) return;

    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchMainServices(currentPageUrl);
        setServices(data.results || []);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setServices([]);
        setNextPageUrl(null);
        setPrevPageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [currentPageUrl, dropdownOpen]);

  // close dropdown on outside click
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

  // label for selected service
  const selectedServiceLabel = (() => {
    if (!value) return "Select a main service";
    return value.name || "Unnamed Service";
  })();

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1 font-medium text-gray-700">
        Main Service <span className="text-red-500">*</span>
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setDropdownOpen((o) => !o)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-left flex justify-between items-center"
      >
        {selectedServiceLabel}
        {dropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {error && <p className="text-red-600 text-sm mt-1 ml-1">{error}</p>}

      {dropdownOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border border-gray-300 bg-white shadow-lg">
          {loading ? (
            <p className="p-2 text-center text-blue-500">Loading...</p>
          ) : services.length === 0 ? (
            <p className="p-2 text-center text-gray-500">No services found</p>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  onChange(service); // pass selected service object
                  setDropdownOpen(false);
                }}
                className={`cursor-pointer px-3 py-2 hover:bg-blue-100 ${
                  value?.id === service.id ? "bg-blue-200 font-semibold" : ""
                }`}
              >
                {service.name}
              </div>
            ))
          )}
          <div className="flex justify-between border-t border-gray-300 px-3 py-1 bg-gray-50">
            <button
              disabled={!prevPageUrl || disabled}
              onClick={() => prevPageUrl && setCurrentPageUrl(prevPageUrl)}
              className="text-sm font-medium text-blue-600 disabled:text-gray-400"
            >
              Prev
            </button>
            <button
              disabled={!nextPageUrl || disabled}
              onClick={() => nextPageUrl && setCurrentPageUrl(nextPageUrl)}
              className="text-sm font-medium text-blue-600 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedMainServiceDropdown;
