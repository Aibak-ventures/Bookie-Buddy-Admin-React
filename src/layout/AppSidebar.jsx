import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Plus, 
  Store, 
  Users, 
  FolderOpen, 
  DollarSign, 
  Settings,
  LogOut
} from 'lucide-react';

const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Add bookings', icon: Plus, path: '/add-bookings' },
    { name: 'Shops', icon: Store, path: '/shops' },
    { name: 'Staffs', icon: Users, path: '/staffs' },
    { name: 'Category Management', icon: FolderOpen, path: '/categories' },
    { name: 'Revenue', icon: DollarSign, path: '/revenue' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    // Close sidebar on mobile when item is clicked
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shadow-none
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Bookie</h1>
                <p className="text-sm text-gray-600">Buddy</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.name;
                
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleItemClick(item.name)}
                      className={`
                        w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                        }
                      `}
                    >
                      <Icon size={20} className="mr-3" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
              <LogOut size={20} className="mr-3" />
              <span className="font-medium">Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isOpen ? 'md:ml-64' : 'md:ml-64'}
        min-h-screen bg-gray-50 p-4 md:p-6
      `}>
        <div className="pt-16 md:pt-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome to {activeItem}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Cards */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bookings</h3>
              <p className="text-3xl font-bold text-purple-600">3,782</p>
              <p className="text-sm text-green-600 mt-2">↑ 12.01%</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Revenue</h3>
              <p className="text-3xl font-bold text-purple-600">53,567</p>
              <p className="text-sm text-green-600 mt-2">↑ 0.05%</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Users</h3>
              <p className="text-3xl font-bold text-purple-600">1,234</p>
              <p className="text-sm text-green-600 mt-2">↑ 5.3%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;