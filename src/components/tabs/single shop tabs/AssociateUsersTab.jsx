import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Lock, Unlock } from 'lucide-react';
import AddUserModal from '../../Modals/AddUser';
import { fetchLinkedUsers, detachUserFromShop, blockOrUnblockUserFromShop, changeUserRole } from '../../../api/AdminApis';
import AssignExistingUserModal from '../../Modals/AssignExistingUserModal';
import ConfirmationModal from '../../Modals/ConfirmationModal';

const shopRoleOptions = [
  { label: 'OWNER', value: 'OWNER' },
  { label: 'MANAGER', value: 'MANAGER' },
  { label: 'STAFF', value: 'STAFF' },
];

const AssociateUsersTab = ({ shopId, shopName }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAssignExistingModalOpen, setIsAssignExistingModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingRole, setPendingRole] = useState(null); // for role changes

  useEffect(() => {
    if (!shopId) return;

    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLinkedUsers(shopId);
        
        setUsers(data);
      } catch (err) {
        console.error(err);
        const errorMessage =
          err?.response?.data?.detail ||
          err?.message ||
          'Failed to load associated users.';
        setError(errorMessage);
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [shopId]);

  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
  };

  // open confirmation modal for block/detach
  const handleOpenActionModal = (user, action) => {
    setSelectedUser(user);
    setSelectedAction(action);
    setConfirmModalOpen(true);
  };

  // open confirmation modal for role change
  const handleOpenRoleChangeModal = (user, newRole) => {
    setSelectedUser(user);
    setPendingRole(newRole);
    setSelectedAction('changeRole');
    setConfirmModalOpen(true);
  };

  // confirm action
  const handleConfirmAction = async () => {
    if (!selectedUser || !selectedAction) return;

    try {
      if (selectedAction === 'detach') {
        await detachUserFromShop(selectedUser.id);
        setUsers((prev) => prev.filter((u) => u.user_id !== selectedUser.user_id));
        alert("User detached successfully");
      } else if (selectedAction === 'block') {
        const newStatus = !selectedUser.is_active;
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, is_active: newStatus } : u
          )
        );
        
        await blockOrUnblockUserFromShop(selectedUser.id, newStatus);
        alert(`User ${newStatus ? 'unblocked' : 'blocked'} successfully`);
      } else if (selectedAction === 'changeRole' && pendingRole) {
        await changeUserRole(shopId, selectedUser.id, pendingRole);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, role: pendingRole } : u
          )
        );
        alert("Role updated successfully");
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
         err?.response?.data?.error ||
        'Action failed';
      alert(errorMessage);

      // rollback block/unblock if failed
      if (selectedAction === 'block') {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, is_active: selectedUser.is_active } : u
          )
        );
      }
    } finally {
      setSelectedUser(null);
      setSelectedAction(null);
      setPendingRole(null);
      setConfirmModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Associate Users</h3>

        {/* Single Button with Dropdown */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex justify-center w-full gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Assign User
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.585l3.71-4.355a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dropdown options */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsAssignExistingModalOpen(true);
                    setDropdownOpen(false);
                  }}
                >
                  Assign Existing User
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsModalOpen(true);
                    setDropdownOpen(false);
                  }}
                >
                  Add New User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      {loading ? (
        <p className="text-blue-500">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Linked On</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className="border-b">
                  <td className="py-3 px-4">{user.full_name || 'N/A'}</td>

                  {/* Role Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleOpenRoleChangeModal(user, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {shopRoleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3 px-4">{user.phone || 'N/A'}</td>
                  <td className="py-3 px-4">{user.linked_on}</td>
                  <td className="py-3 px-4 flex gap-2">
                    {/* Block / Unblock */}
                    <button
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded ${
                        user.is_active
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                      onClick={() => handleOpenActionModal(user, 'block')}
                    >
                      {user.is_active ? <Lock size={14} /> : <Unlock size={14} />}
                      {user.is_active ? 'Block' : 'Unblock'}
                    </button>

                    {/* Detach */}
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleOpenActionModal(user, 'detach')}
                    >
                      <Trash2 size={14} /> Detach
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New User Modal */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shopId={shopId}
        shopName={shopName}
        onUserAdded={handleUserAdded}
      />

      {/* Assign Existing User Modal */}
      <AssignExistingUserModal
        isOpen={isAssignExistingModalOpen}
        onClose={() => setIsAssignExistingModalOpen(false)}
        shopId={shopId}
        onUserAssigned={(newUser) => setUsers((prev) => [newUser, ...prev])}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        message={
          selectedAction === 'detach'
            ? 'Are you sure you want to detach this user from the shop?'
            : selectedAction === 'block'
            ? `Are you sure you want to ${selectedUser?.is_active ? 'block' : 'unblock'} this user?`
            : `Are you sure you want to change role of ${selectedUser?.full_name} to ${pendingRole}?`
        }
      />
    </div>
  );
};

export default AssociateUsersTab;
