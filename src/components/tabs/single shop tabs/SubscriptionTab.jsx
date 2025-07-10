import React from "react";

const SubscriptionTab = () => {
  const subscriptionData = {
    plan: 'Premium Plan',
    status: 'Active',
    expiryDate: '2024-12-31',
    features: ['Unlimited Products', 'Advanced Analytics', 'Priority Support', 'Multi-user Access'],
    price: '₹999/month'
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Subscription Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-2">{subscriptionData.plan}</h4>
          <p className="text-blue-100 mb-4">{subscriptionData.price}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">
              {subscriptionData.status}
            </span>
            <span className="text-blue-100">Until {subscriptionData.expiryDate}</span>
          </div>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
            Manage Subscription
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h5 className="font-medium mb-4">Plan Features</h5>
          <ul className="space-y-2">
            {subscriptionData.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab