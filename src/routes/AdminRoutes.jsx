import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../pages/MainLayout";
import DashBoard from "../components/sections/DashBoard";
import Shops from "../components/sections/Shops";
import Users from "../components/sections/Users";
import AddShop from "../components/sections/AddShop";
import SingleShop from "../components/sections/SingleShop";





const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Main layout with sidebar */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashBoard />} />
        <Route path="shops" element={<Shops />} />
        <Route path="users" element={<Users />} />
        <Route path="add-shop" element={<AddShop />} />
        <Route path="/shops/:shopId" element={<SingleShop />} />




        {/* Add more admin routes here */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;   
