import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchUsers } from "../../api/AdminApis";

const PaginatedUserDropdown = ({ value, onChange, error, disabled }) => {
  const [fullUsers, setFullUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState("/api/v1/auth/admin/users/");
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);

 useEffect(() => {
  if (!dropdownOpen) return;

  const loadUsers = async () => {
    setLoading(true);
    try {
      let url = currentPageUrl;

      // 👇 add search support in backend
      if (searchTerm) {
        const searchQuery = encodeURIComponent(searchTerm);
        if (url.includes("?")) {
          url += `&search=${searchQuery}`;
        } else {
          url += `?search=${searchQuery}`;
        }
      }

      const data = await fetchUsers(url);
      setFullUsers(data.results || []);
      setNextPageUrl(data.next);
      setPrevPageUrl(data.previous);
      setFilteredUsers(data.results || []); // use API response directly
    } catch (err) {
      console.error(err);
      setFullUsers([]);
      setFilteredUsers([]);
      setNextPageUrl(null);
      setPrevPageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  loadUsers();
}, [currentPageUrl, dropdownOpen, searchTerm]);


  // Filter users when search term changes
  // useEffect(() => {
  //   const term = searchTerm.toLowerCase();
  //   setFilteredUsers(
  //     fullUsers.filter(
  //       (u) =>
  //         u.full_name?.toLowerCase().includes(term) ||
  //         u.phone?.toLowerCase().includes(term)
  //     )
  //   );
  // }, [searchTerm, fullUsers]);

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
        <div className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded border border-gray-300 bg-white shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          {loading ? (
            <p className="p-2 text-center text-blue-500">Loading...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="p-2 text-center text-gray-500">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  onChange(user);
                  setDropdownOpen(false);
                  setSearchTerm("");
                }}
                className={`cursor-pointer px-3 py-2 hover:bg-blue-100 ${
                  value?.id === user.id ? "bg-blue-200 font-semibold" : ""
                }`}
              >
                {`${user.full_name || "(No Name)"} - ${user.phone || "No phone"}`}
              </div>
            ))
          )}

          {/* Pagination */}
          <div className="flex justify-between border-t border-gray-300 px-3 py-1 bg-gray-50">
            <button
              disabled={!prevPageUrl || disabled}
              onClick={() => {
                if (prevPageUrl) {
                  const url = searchTerm
                    ? `${prevPageUrl}&search=${encodeURIComponent(searchTerm)}`
                    : prevPageUrl;
                  setCurrentPageUrl(url);
                }
              }}
              className={`text-sm font-medium text-blue-600 disabled:text-gray-400`}
            >
              Prev
            </button>
            <button
              disabled={!nextPageUrl || disabled}
              onClick={() => {
                if (nextPageUrl) {
                  const url = searchTerm
                    ? `${nextPageUrl}&search=${encodeURIComponent(searchTerm)}`
                    : nextPageUrl;
                  setCurrentPageUrl(url);
                }
              }}
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
