import React, { useState } from "react";
import {
  Phone, Mail, User, Shield,
  CheckCircle, XCircle, Ban, Unlock, Pencil, Key
} from "lucide-react";
import ConfirmationModal from "../Modals/ConfirmationModal";
import { blockUnblockUser, resetUserPassword } from "../../api/AdminApis";
import ResetPasswordModal from "../Modals/ResetPasswordModal";

const UserDetailsCard = ({ userData, onToggleStatus, onEdit }) => {
  const [modalState, setModalState] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const getRoleColor = (role) => {
    switch (role) {
      case "OWNER":
        return "bg-red-100 text-red-800 border-red-200";
      case "ADMIN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "STAFF":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleConfirmToggle = async () => {
    setIsProcessing(true);
    try {
      await blockUnblockUser(userData.id, !userData.is_active);
      if (onToggleStatus) {
        onToggleStatus(userData.id, userData.is_active);
      }
    } catch (err) {
      alert(`Failed: ${err?.error || "Unable to update status"}`);
    } finally {
      setIsProcessing(false);
      setModalState(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      {/* Top User Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{userData.full_name}</h2>
            <p className="text-sm text-gray-500">ID: #{userData.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {userData.is_active ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getRoleColor(userData.role)}`}>
            {userData.role}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{userData.phone}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{userData.email}</span>
        </div>
        <div className="text-gray-700">
          Status:{" "}
          {userData.is_active ? (
            <span className="text-green-600 font-medium">Active</span>
          ) : (
            <span className="text-red-600 font-medium">Inactive</span>
          )}
        </div>
      </div>

      {/* Actions */}
     {/* Actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Edit */}
        <button
          onClick={onEdit}
          className="flex items-center justify-center space-x-1 bg-blue-600 text-white py-1 px-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors w-full"
        >
          <Pencil className="w-4 h-4" />
          <span>Edit</span>
        </button>

        {/* Block / Unblock */}
        {userData.is_active ? (
          <button
            onClick={() => setModalState(true)}
            className="flex items-center justify-center space-x-1 bg-red-600 text-white py-1 px-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors w-full"
          >
            <Ban className="w-4 h-4" />
            <span>Block</span>
          </button>
        ) : (
          <button
            onClick={() => setModalState(true)}
            className="flex items-center justify-center space-x-1 bg-green-600 text-white py-1 px-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors w-full"
          >
            <Unlock className="w-4 h-4" />
            <span>Unblock</span>
          </button>
        )}

        {/* Reset Password */}
        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center justify-center space-x-1 bg-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors w-full"
        >
          <span>Reset Password</span>
        </button>
      </div>


      {/* Confirmation Modal for block/unblock */}
      <ConfirmationModal
        isOpen={modalState}
        onClose={() => setModalState(false)}
        onConfirm={handleConfirmToggle}
        message={`Are you sure you want to ${userData.is_active ? "block" : "unblock"} this user?`}
        loading={isProcessing}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        userId={userData.id}
        onReset={resetUserPassword}
      />
    </div>
  );
};

export default UserDetailsCard;
