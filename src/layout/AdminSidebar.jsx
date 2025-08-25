// components/AdminSidebar.jsx
import React from 'react';
import {
  LayoutDashboard, Plus, Store, Users,
  FolderOpen, DollarSign, Settings, LogOut,PercentDiamond
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/AdminApis';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
//   { name: 'Add bookings', icon: Plus, path: '/admin/add-bookings' },
  { name: 'Add shops', icon: Plus, path: '/add-shop' },

  { name: 'Shops', icon: Store, path: '/shops' },
  { name: 'Users', icon: Users, path: '/users' },
  { name: 'Main services', icon: PercentDiamond, path: '/main-services' },
  { name: 'General services', icon: FolderOpen, path: '/general-services' },


  
//   { name: 'Category Management', icon: FolderOpen, path: '/admin/categories' },
//   { name: 'Revenue', icon: DollarSign, path: '/admin/revenue' },
//   { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`
      fixed md:static top-0 left-0 z-50 h-full w-64 bg-white border-r
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
    `}>
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 text-white flex justify-center items-center rounded-lg font-bold">B</div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Bookie</h1>
            <p className="text-sm text-gray-600">Buddy</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg
                    transition duration-200
                    ${isActive
                      ? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'}
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => {
            logoutUser();         // Clear session storage
            navigate('/login');   // Redirect to login page
          }}
          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut size={20} className="mr-3" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
