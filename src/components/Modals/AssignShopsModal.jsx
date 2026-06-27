import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  fetchShops,
  assignOrganizationShops,
} from "../../api/AdminApis";
import API_URLS from "../../api/ApiUrl";

const AssignShopsModal = ({
  isOpen,
  onClose,
  organization,
  orgId,
  onUpdated,
}) => {
  const modalRef = useRef(null);

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPageUrl, setCurrentPageUrl] = useState(API_URLS.SHOPS);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const [selected, setSelected] = useState(new Set());
  const [initialSelected, setInitialSelected] = useState(new Set());

  useEffect(() => {
    if (!isOpen || !organization) return;

    const ids = organization?.shops?.map((shop) => shop.id) || [];

    setSelected(new Set(ids));
    setInitialSelected(new Set(ids));

    setSearchTerm("");
    setCurrentPageUrl(API_URLS.SHOPS);
  }, [isOpen, organization]);

  useEffect(() => {
    if (!isOpen) return;

    const loadShops = async () => {
      setLoading(true);

      try {
        let url = currentPageUrl;

        if (searchTerm) {
          if (url.includes("?")) {
            url += `&search=${encodeURIComponent(searchTerm)}`;
          } else {
            url += `?search=${encodeURIComponent(searchTerm)}`;
          }
        }

        const data = await fetchShops(url);

        setShops(data.results || []);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, [currentPageUrl, searchTerm, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isOpen, onClose]);

  const toggleShop = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleSave = async () => {
    const add = [...selected].filter(
      (id) => !initialSelected.has(id)
    );

    const remove = [...initialSelected].filter(
      (id) => !selected.has(id)
    );

    if (add.length === 0 && remove.length === 0) {
      onClose();
      return;
    }

    try {
      setSaving(true);

      await assignOrganizationShops(orgId, {
        add,
        remove,
      });

      onUpdated();
      onClose();
    } catch (err) {
    
      
    alert("Failed to assign shops: "+err?.response?.data?.message)

    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl rounded-xl shadow-xl"
      >
        {/* Header */}

        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            Assign Shops
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Search */}

        <div className="p-4 border-b">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Search shop..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPageUrl(API_URLS.SHOPS);
            }}
          />
        </div>

        {/* Shop List */}

        <div className="max-h-[420px] overflow-y-auto">

          {loading ? (
            <div className="p-10 text-center">
              Loading...
            </div>
          ) : shops.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No shops found.
            </div>
          ) : (
            shops.map((shop) => (
              <div
                key={shop.id}
                className="flex items-center justify-between px-5 py-3 border-b hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">

                  <input
                    type="checkbox"
                    checked={selected.has(shop.id)}
                    onChange={() => toggleShop(shop.id)}
                  />

                  {shop.img ? (
                    <img
                      src={shop.img}
                      alt={shop.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center font-bold">
                      {shop.name?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <p className="font-medium">
                      {shop.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {shop.phone}
                    </p>

                    <p className="text-xs text-gray-400">
                      {[shop.address, shop.place, shop.city]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}

        <div className="flex justify-between px-6 py-3 border-t">

          <button
            disabled={!prevPageUrl}
            onClick={() => {
              if (prevPageUrl) {
                const url = searchTerm
                  ? `${prevPageUrl}&search=${encodeURIComponent(
                      searchTerm
                    )}`
                  : prevPageUrl;

                setCurrentPageUrl(url);
              }
            }}
            className="text-blue-600 disabled:text-gray-400"
          >
            Previous
          </button>

          <button
            disabled={!nextPageUrl}
            onClick={() => {
              if (nextPageUrl) {
                const url = searchTerm
                  ? `${nextPageUrl}&search=${encodeURIComponent(
                      searchTerm
                    )}`
                  : nextPageUrl;

                setCurrentPageUrl(url);
              }
            }}
            className="text-blue-600 disabled:text-gray-400"
          >
            Next
          </button>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 px-6 py-4 border-t">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AssignShopsModal;