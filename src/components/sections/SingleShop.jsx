import React, { useEffect, useState } from 'react';
import {
  Users, CreditCard, Package, BarChart3
} from 'lucide-react';
import ShopDetailsCard from '../cards/ShopDetailsCard';
import TabbedContentCard from '../cards/TabbedContentCard';
import { fetchSingleShop } from '../../api/AdminApis';
import { useParams } from 'react-router-dom'; // assuming you're using react-router

const SingleShop = () => {
  const { shopId } = useParams(); // assuming your route is like /shops/:shopId
  const [shopData, setShopData] = useState(null);
  const [activeTab, setActiveTab] = useState('associate-users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'associate-users', label: 'Associate users', icon: Users },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'services-products', label: 'Services & products', icon: Package },
    { id: 'activities', label: 'Activities', icon: BarChart3 }
  ];

  useEffect(() => {
    const loadShop = async () => {
      try {
        const data = await fetchSingleShop(shopId);
        console.log("shopp details",data);
        
        setShopData(data);
      } catch (err) {
        setError('Failed to load shop details.');
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-blue-500">Loading shop details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ShopDetailsCard shopData={shopData} />
            </div>
            <div className="lg:col-span-2">
              <TabbedContentCard
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                  shopId={shopId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleShop;
