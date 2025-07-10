import React, { useState } from 'react';
import {
  Users, CreditCard, Package, BarChart3
} from 'lucide-react';
import ShopDetailsCard from '../cards/ShopDetailsCard';
import TabbedContentCard from '../cards/TabbedContentCard';


const SingleShop = () => {
  const [activeTab, setActiveTab] = useState('associate-users');

  const shopData = {
    name: 'Bookie Buddy',
    location: 'Kozhikkode',
    phone: '+91 9072 546 790',
    email: 'bookiebuddy@gmail.com',
    gst: '123456789087654',
    address: 'Hilite Business park, Kerala, 670023',
    stockLimit: '150 stock limit',
    logo: 'BB'
  };

  const tabs = [
    { id: 'associate-users', label: 'Associate users', icon: Users },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'services-products', label: 'Services & products', icon: Package },
    { id: 'activities', label: 'Activities', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ShopDetailsCard shopData={shopData} />
          </div>
          <div className="lg:col-span-2">
            <TabbedContentCard
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleShop