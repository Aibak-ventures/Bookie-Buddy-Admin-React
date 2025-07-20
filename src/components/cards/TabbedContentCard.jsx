import React from 'react';
import AssociateUsersTab from '../tabs/single shop tabs/AssociateUsersTab';
import SubscriptionTab from '../tabs/single shop tabs/SubscriptionTab';
import ServicesProductsTab from '../tabs/single shop tabs/ServicesProductsTab';
import ActivitiesContent from '../tabs/single shop tabs/ActivitiesContent';


const TabbedContentCard = ({ tabs, activeTab, setActiveTab,shopId ,shopName }) => {
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
        {/* {activeTab === 'subscription' && <SubscriptionTab />} */}
        {activeTab === 'services-products' && <ServicesProductsTab shop_id={shopId} />}
        {/* {activeTab === 'activities' && <ActivitiesContent />} */}
        
      </div>
    </div>
  );
};

export default TabbedContentCard;
