import React from 'react';
import { refreshToken } from '../../api/AxiosConfig';

function DashBoard() {
  const handleRefresh = async () => {
    try {
      await refreshToken();
    } catch (err) {
      console.error("Failed to refresh token:", err);
    }
  };

  return (
    <div>
      my DashBoard 
      <button className="bg-amber-700 text-white px-4 py-2 rounded" onClick={handleRefresh}>
        Refresh Token
      </button>
    </div>
  );
}

export default DashBoard;
