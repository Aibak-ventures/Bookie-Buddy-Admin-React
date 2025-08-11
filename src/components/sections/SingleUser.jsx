// components/pages/SingleUser.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserDetails } from '../../api/AdminApis';
import UserDetailsCard from '../cards/UserDetailsCard';
import AssociatedShopsCard from '../cards/AssociatedShopsCard';
import UserUpdateModal from '../Modals/UserUpdateModal';


const SingleUser = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleToggleStatus = () => {
    if (userData) {
      setUserData((prev) => ({ ...prev, is_active: !prev.is_active }));
    }
  };

  const loadUser = async () => {
    try {
      const data = await fetchUserDetails(userId);
      setUserData(data);
    } catch (err) {
      setError('Failed to load user details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-blue-500">Loading user details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <UserDetailsCard
                userData={userData}
                onToggleStatus={handleToggleStatus}
                onEdit={() => setShowEditModal(true)}
              />
            </div>
            <div className="lg:col-span-2">
              <AssociatedShopsCard shops={userData.associated_shops || []} />
            </div>
          </div>
        )}
      </div>

      {/* Modal for editing user */}
      <UserUpdateModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={userData}
        onUpdate={loadUser}
      />
    </div>
  );
};

export default SingleUser;
