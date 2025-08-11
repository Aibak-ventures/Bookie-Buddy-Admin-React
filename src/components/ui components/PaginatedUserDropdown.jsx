import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchUsers } from "../../api/AdminApis";

const PaginatedUserDropdown = ({ value, onChange, error, disabled }) => {
  const [fullUsers, setFullUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState("/api/v1/auth/admin/users/");

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!dropdownOpen) return;

    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers(currentPageUrl);
        setFullUsers(data.results);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
      } catch (err) {
        setFullUsers([]);
        setNextPageUrl(null);
        setPrevPageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentPageUrl, dropdownOpen]);

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

  // Get label for selected user (using value as user.id)
  const selectedUserLabel = (() => {
    const selectedUser = fullUsers.find((u) => u.id === value?.id);
    return selectedUser
      ? `${selectedUser.full_name || "(No Name)"} - ${selectedUser.phone || "No phone"}`
      : "Select a user";
  })();

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1 font-medium text-gray-700">User</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setDropdownOpen((o) => !o)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-left flex justify-between items-center"
      >
        {selectedUserLabel}
        {dropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {error && <p className="text-red-600 text-sm mt-1 ml-1">{error}</p>}

      {dropdownOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border border-gray-300 bg-white shadow-lg">
          {loading ? (
            <p className="p-2 text-center text-blue-500">Loading...</p>
          ) : fullUsers.length === 0 ? (
            <p className="p-2 text-center text-gray-500">No users found</p>
          ) : (
            fullUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  onChange(user);
                  setDropdownOpen(false);
                }}
                className={`cursor-pointer px-3 py-2 hover:bg-blue-100 ${
                  value?.id === user.id ? "bg-blue-200 font-semibold" : ""
                }`}
              >
                {`${user.full_name || "(No Name)"} - ${user.phone || "No phone"}`}
              </div>
            ))
          )}
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

export default PaginatedUserDropdown;
