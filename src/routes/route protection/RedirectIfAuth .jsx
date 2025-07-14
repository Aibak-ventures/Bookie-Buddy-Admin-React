// components/RedirectIfAuth.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RedirectIfAuth = () => {
  const accessToken = sessionStorage.getItem('access');
  return accessToken ? <Navigate to="/" replace /> : <Outlet />;
};

export default RedirectIfAuth;


