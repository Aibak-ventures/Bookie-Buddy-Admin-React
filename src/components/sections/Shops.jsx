import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import DataTable from '../ui components/DataTable';
import { fetchShops, blockUnblockShop } from '../../api/AdminApis';
import ConfirmationModal from '../Modals/ConfirmationModal';
import CreateShopModal from '../Modals/CreateShopModal'; // ✅ Added back

const Shops = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shops, setShops] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('/api/v1/shop/admin/shops/');
  const [modalState, setModalState] = useState({ isOpen: false, shopId: null, isActive: null });
  const [createModalOpen, setCreateModalOpen] = useState(false); // ✅ Added back

  /** 🔄 Fetch / Refresh shops */
  const refreshShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShops(currentUrl);
      setShops(data.results || []);
      setCount(data.count || 0);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      console.error(err);
      setError('Unable to load shops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshShops();
  }, [currentUrl]);

  /** ✅ Block / Unblock Handler */
  const handleToggleStatus = async (shopId, isActive) => {
    try {
      await blockUnblockShop(shopId, !isActive);
      refreshShops();
    } catch (err) {
      console.error(err);
      alert('Failed to update shop status.');
    } finally {
      setModalState({ ...modalState, isOpen: false });
    }
  };

  /** 🔎 Client-side filtering */
  const filteredShops = shops.filter(shop =>
    [shop.name, shop.place, shop.email]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  /** 📊 Table columns */
  const columns = [
    {
      header: 'Shop',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <img
            src={
              row.img ||
              'https://ui-avatars.com/api/?name=NA&background=random&size=40&rounded=true'
            }
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <span className="font-medium text-gray-800">{row.name}</span>
        </div>
      )
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Place', accessor: 'place' },
    {
      header: 'Created At',
      accessor: 'created_at',
      cell: (row) => (
        <span className="text-sm text-gray-500">{row.created_at}</span>
      )
    },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <button
          className={`px-3 py-1 rounded text-sm font-medium ${
            row.is_active
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setModalState({
              isOpen: true,
              shopId: row.id,
              isActive: row.is_active
            });
          }}
        >
          {row.is_active ? 'Block' : 'Unblock'}
        </button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 🔹 Header + Create Button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shops</h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          + Create Shop
        </button>
      </div>

      {/* 🔹 Search & Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search or type command..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-blue-600">Loading shops...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredShops}
            totalEntries={count}
            onNextPage={() => setCurrentUrl(next)}
            onPreviousPage={() => setCurrentUrl(previous)}
            disableNext={!next}
            disablePrevious={!previous}
            rowClickPath="shops"
          />
        )}
      </div>

      {/* 🔹 Block/Unblock Confirmation */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={() =>
          handleToggleStatus(modalState.shopId, modalState.isActive)
        }
        message={`Are you sure you want to ${
          modalState.isActive ? 'block' : 'unblock'
        } this shop?`}
      />

      {/* 🔹 Create Shop Modal */}
      <CreateShopModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={refreshShops} // refresh list after creation
      />
    </div>
  );
};

export default Shops;
