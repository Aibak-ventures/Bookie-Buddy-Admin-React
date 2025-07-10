import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import DataTable from '../ui components/DataTable';


function Users() {
   const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
  
    // Sample data - you can replace this with your actual data
    const shops = [
      { id: 1, name: 'Abram Schleifer', owner: 'Manu Kumar', phone: '+91 9073 544 834', place: 'Kozhikkode', plan: 'Basic', status: 'Active' },
      { id: 2, name: 'Abram Schleifer', owner: 'Manu Kumar', phone: '+91 9073 544 834', place: 'Kozhikkode', plan: 'Standard', status: 'Active' },
      { id: 3, name: 'Abram Schleifer', owner: 'Manu Kumar', phone: '+91 9073 544 834', place: 'Kozhikkode', plan: 'Enterprise', status: 'Blocked' },
      { id: 4, name: 'Abram Schleifer', owner: 'Manu Kumar', phone: '+91 9073 544 834', place: 'Kozhikkode', plan: 'Basic', status: 'Active' },
      { id: 5, name: 'Abram Schleifer', owner: 'Manu Kumar', phone: '+91 9073 544 834', place: 'Kozhikkode', plan: 'Basic', status: 'Active' },
      { id: 6, name: 'Abram Schleifer', owner: 'Manu Kumar', phone: '+91 9073 544 834', place: 'Kozhikkode', plan: 'Basic', status: 'Active' },
      { id: 7, name: 'Abram Schleifer', owner: 'Manu Kumar', phone: '+91 9073 544 834', place: 'Kozhikkode', plan: 'Basic', status: 'Active' },
      { id: 8, name: 'Abram Schleifer', owner: 'Manu Kumar', phone: '+91 9073 544 834', place: 'Kozhikkode', plan: 'Basic', status: 'Active' },
      { id: 9, name: 'Abram Schleifer', owner: 'Manu Kumar', phone: '+91 9073 544 834', place: 'Kozhikkode', plan: 'Basic', status: 'Active' },
      { id: 10, name: 'Abram Schleifer', owner: 'Manu Kumar', phone: '+91 9073 544 834', place: 'Kozhikkode', plan: 'Basic', status: 'Active' },
      { id: 11, name: 'Sample Shop', owner: 'John Doe', phone: '+91 9876 543 210', place: 'Mumbai', plan: 'Premium', status: 'Active' },
      { id: 12, name: 'Test Store', owner: 'Jane Smith', phone: '+91 8765 432 109', place: 'Delhi', plan: 'Basic', status: 'Inactive' }
    ];
  
    // Filter shops based on search term
    const filteredShops = useMemo(() => {
      return shops.filter(shop => 
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.place.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [searchTerm]);
  
    // Pagination logic
    const totalPages = Math.ceil(filteredShops.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const currentShops = filteredShops.slice(startIndex, endIndex);
  
    const getStatusColor = (status) => {
      switch (status) {
        case 'Active':
          return 'bg-green-100 text-green-800';
        case 'Blocked':
          return 'bg-red-100 text-red-800';
        case 'Inactive':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    const getPlanColor = (plan) => {
      switch (plan) {
        case 'Basic':
          return 'text-blue-600';
        case 'Standard':
          return 'text-purple-600';
        case 'Enterprise':
          return 'text-orange-600';
        case 'Premium':
          return 'text-green-600';
        default:
          return 'text-gray-600';
      }
    };

     const columns = [
    {
      header: 'Shop',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">BB</span>
          </div>
          <span className="font-medium text-gray-800">{row.name}</span>
        </div>
      )
    },
    { header: 'Shop owner', accessor: 'owner' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Place', accessor: 'place' },
    {
      header: 'Subscription Plan',
      accessor: 'plan',
      cell: (row) => (
        <span className={`font-medium ${getPlanColor(row.plan)}`}>{row.plan}</span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    }
  ];
  return  (
     <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
      </div>

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

        <DataTable
          columns={columns}
          data={currentShops}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={Math.min(endIndex, filteredShops.length)}
          totalEntries={filteredShops.length}
        />
      </div>
    </div>
  );
}

export default Users