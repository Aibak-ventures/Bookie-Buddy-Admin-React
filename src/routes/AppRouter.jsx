import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';



const AppRouter = () => {
  return (
      <Routes>
         <Route path="/*" element={<AdminRoutes />} />
      </Routes>
  );
};

export default AppRouter;