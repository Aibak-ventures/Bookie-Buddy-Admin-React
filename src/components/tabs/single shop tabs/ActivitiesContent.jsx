import React from "react";
import {  CreditCard, Users, Package, BarChart3} from 'lucide-react';


const ActivitiesContent = () => {
  const activities = [
    { id: 1, action: 'User added', user: 'Admin', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'Product updated', user: 'Staff', time: '4 hours ago', type: 'product' },
    { id: 3, action: 'Order received', user: 'Customer', time: '6 hours ago', type: 'order' },
    { id: 4, action: 'Payment processed', user: 'System', time: '8 hours ago', type: 'payment' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <Users size={16} />;
      case 'product': return <Package size={16} />;
      case 'order': return <BarChart3 size={16} />;
      case 'payment': return <CreditCard size={16} />;
      default: return <BarChart3 size={16} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-600';
      case 'product': return 'bg-green-100 text-green-600';
      case 'order': return 'bg-purple-100 text-purple-600';
      case 'payment': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Recent Activities</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{activity.action}</p>
              <p className="text-sm text-gray-600">by {activity.user}</p>
            </div>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default ActivitiesContent