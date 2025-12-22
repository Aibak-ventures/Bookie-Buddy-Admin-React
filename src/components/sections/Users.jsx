import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import DataTable from '../ui components/DataTable';
import ConfirmationModal from '../Modals/ConfirmationModal';
import { fetchUsers, blockUnblockUser, createUser } from '../../api/AdminApis';
import AddUserOnly from '../Modals/AddUserOnly';
import { useNavigate, useLocation } from 'react-router-dom';



const Users = () => {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, userId: null, isActive: null });
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialPage = queryParams.get('page') || 1;

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentUrl, setCurrentUrl] = useState(`/api/v1/auth/admin/users/?page=${initialPage}&search=${initialSearch}`);


  // Fetch users on mount and on pagination URL change
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

  // Handle block/unblock
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

  // Handle user add
  const handleAddUser = async (userData) => {
    try{
      const response = await createUser(userData);
      
      if (response?.id) {
        alert('User added successfully!');
        setIsAddUserModalOpen(false);
        // Refresh users
        setCurrentUrl('/api/v1/auth/admin/users/');
      }

    }
    catch(err){
     console.log("error",err);
     
    }
      
      
  
  };

  // Filter users based on search
useEffect(() => {
  let url = `/api/v1/auth/admin/users/?search=${searchTerm}`;
  setCurrentUrl(url);
}, [searchTerm]);

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
            setModalState({ isOpen: true, userId: row.id, isActive: row.is_active });
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
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email"
              value={searchTerm}
              onChange={(e) => {
                const newSearch = e.target.value;
                setSearchTerm(newSearch);
                navigate(`?page=1&search=${newSearch}`);
                setCurrentUrl(`/api/v1/auth/admin/users/?page=1&search=${newSearch}`);
                }}

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
            data={users}
            totalEntries={count}
            onNextPage={() => {
            if (next) {
              const nextPageNumber = new URL(next).searchParams.get('page');
              navigate(`?page=${nextPageNumber}&search=${searchTerm}`);
              setCurrentUrl(`/api/v1/auth/admin/users/?page=${nextPageNumber}&search=${searchTerm}`);
            }
          }}

          onPreviousPage={() => {
            if (previous) {
              const prevPageNumber = new URL(previous).searchParams.get('page');
              navigate(`?page=${prevPageNumber}&search=${searchTerm}`);
              setCurrentUrl(`/api/v1/auth/admin/users/?page=${prevPageNumber}&search=${searchTerm}`);
            }
          }}

            disableNext={!next}
            disablePrevious={!previous}
            rowClickPath="users"
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={() => {
          handleToggleStatus(modalState.userId, modalState.isActive);
          setModalState({ ...modalState, isOpen: false });
        }}
        message={`Are you sure you want to ${modalState.isActive ? 'block' : 'unblock'} this user?`}
      />

      {/* Add User Modal */}
      <AddUserOnly
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
};

export default Users;
