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
import Features from "../components/sections/Features";
import FeatureShops from "../components/sections/FeatureShops";
import Subscription from "../components/sections/Subscription";
import PushNotifications from "../components/sections/PushNotifications";
import IdleDaysReport from "../components/sections/IdleDaysReport";
import OrganizationsList from "../components/sections/OrganizationsList";
import SingleOrganization from "../components/sections/SingleOrganization";







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
          <Route path="idle-days-report" element={<IdleDaysReport />} />
          <Route path="main-services" element={<MainServices />} />
          <Route path="general-services" element={<GeneralServices />} />
          <Route path="feature-management" element={<Features />} />
          <Route path="features/:featureId" element={<FeatureShops />} />
          <Route path="subscription-management" element={<Subscription />} />
          <Route path="push-notifications" element={<PushNotifications />} />
          <Route path="organizations" element={<OrganizationsList />} />
          <Route path="organizations/:orgId" element={<SingleOrganization />} />


          

          <Route path="add-shop" element={<AddShop />} />
          <Route path="shops/:shopId" element={<SingleShop />} />
          <Route path="users/:userId" element={<SingleUser />} />

        </Route>
      </Route>
    </Routes>
    
  );
};

export default AdminRoutes;   
