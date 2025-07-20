// components/RequireAuth.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const accessToken = sessionStorage.getItem('access');
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
