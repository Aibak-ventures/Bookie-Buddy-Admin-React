import React from 'react';
import AssociateUsersTab from '../tabs/single shop tabs/AssociateUsersTab';
import ServicesProductsTab from '../tabs/single shop tabs/ServicesProductsTab';
import EngagmentChart from '../tabs/single shop tabs/EngagmentChart';
import SubscriptionTab from '../tabs/single shop tabs/SubscriptionTab';


const TabbedContentCard = ({ tabs, activeTab, setActiveTab,shopId ,shopName ,shopSubscriptionStatus}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'associate-users' && <AssociateUsersTab shopId={shopId} shopName={shopName}/>}
        {activeTab === 'services-products' && <ServicesProductsTab shop_id={shopId} />}
        {activeTab === 'engagement' && <EngagmentChart shop_id={shopId} />}
        {activeTab === 'subscription' && <SubscriptionTab shop_id={shopId} shopSubscriptionStatus={shopSubscriptionStatus} />}

        
      </div>
    </div>
  );
};

export default TabbedContentCard;
