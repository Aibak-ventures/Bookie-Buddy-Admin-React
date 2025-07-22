// components/sections/AssociatedShopsCard.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DataTable from '../ui components/DataTable';
import { fetchUserShops } from '../../api/AdminApis';

const AssociatedShopsCard = () => {
  const { userId } = useParams(); // get userId from route
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const data = await fetchUserShops(userId);
        
        setShops(data);
      } catch (err) {
        setError('Failed to load associated shops');
      } finally {
        setLoading(false);
      }
    };

    if (userId) loadShops();
  }, [userId]);

  const columns = [
    { header: 'Shop Name', accessor: 'shop_name' },
    { header: 'Place', accessor: 'place' },
    { header: 'Role', accessor: 'role' },
    { header: 'Linked On', accessor: 'linked_on' }
  ];

  const formattedShops = shops.map(shop => ({
    ...shop,
    id: shop.shop_id,
  }));

  if (loading) return <p className="text-blue-500">Loading shops...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Associated Shops</h3>
      <DataTable
        columns={columns}
        data={formattedShops}
        totalEntries={formattedShops.length}
        disableNext={true}
        disablePrevious={true}
        rowClickPath="shops" // row click will go to /shops/:shop_id
      />
    </div>
  );
};

export default AssociatedShopsCard;
