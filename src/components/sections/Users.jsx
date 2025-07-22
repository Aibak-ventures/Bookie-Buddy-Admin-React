// components/sections/Users.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import DataTable from '../ui components/DataTable';
import { fetchUsers, blockUnblockUser } from '../../api/AdminApis';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('/api/v1/auth/admin/users/');

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUsers(currentUrl);
        setUsers(data.results);
        setCount(data.count);
        setNext(data.next);
        setPrevious(data.previous);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentUrl]);

  const handleToggleStatus = async (userId, currentStatus) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      )
    );

    try {
      await blockUnblockUser(userId, !currentStatus);
    } catch (error) {
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, is_active: currentStatus } : user
        )
      );
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      [user.full_name, user.email, user.phone]
        .filter(Boolean)
        .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, users]);

  const columns = [
    {
      header: 'Name',
      accessor: 'full_name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.full_name || 'User')}&background=random&size=40&rounded=true`}
            alt={row.full_name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <span className="font-medium text-gray-800">{row.full_name || 'N/A'}</span>
        </div>
      )
    },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <button
          className={`px-3 py-1 rounded text-sm font-medium ${
            row.is_active
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus(row.id, row.is_active);
          }}
        >
          {row.is_active ? 'Block' : 'Unblock'}
        </button>
      )
    }
  ];

  return (
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
              placeholder="Search by name, phone, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-blue-600">Loading users...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredUsers}
            totalEntries={count}
            onNextPage={() => setCurrentUrl(next)}
            onPreviousPage={() => setCurrentUrl(previous)}
            disableNext={!next}
            disablePrevious={!previous}
            rowClickPath="users"
          />
        )}
      </div>
    </div>
  );
};

export default Users;
