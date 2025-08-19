import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../pages/MainLayout";
import DashBoard from "../components/sections/DashBoard";
import Shops from "../components/sections/Shops";
import Users from "../components/sections/Users";
import AddShop from "../components/sections/AddShop";
import SingleShop from "../components/sections/SingleShop";
import RedirectIfAuth from "./route protection/RedirectIfAuth";
import RequireAuth from "./route protection/RequireAuth";
import SingleUser from "../components/sections/SingleUser";
import MainServices from "../components/sections/MainServices";
import GeneralServices from "../components/sections/GeneralServices";







const AdminRoutes = () => {
  return (
    <Routes>
      {/* Protect login route if already authenticated */}
      <Route element={<RedirectIfAuth />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/*Protected routes - require login */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="shops" element={<Shops />} />
          <Route path="users" element={<Users />} />
          <Route path="main-services" element={<MainServices />} />
          <Route path="general-services" element={<GeneralServices />} />

          <Route path="add-shop" element={<AddShop />} />
          <Route path="shops/:shopId" element={<SingleShop />} />
          <Route path="users/:userId" element={<SingleUser />} />

        </Route>
      </Route>
    </Routes>
    
  );
};

export default AdminRoutes;   
