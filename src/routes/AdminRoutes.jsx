import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import Home from "../pages/Home";
const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<SignupPage />} />
        </Routes>
    )
}
export default AdminRoutes;   
