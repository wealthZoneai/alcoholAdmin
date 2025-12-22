import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Layout from "../pages/Layout";
// import Home from "../pages/HomeScreen/Home";
import CategoryPage from "../pages/SubCategory/SubCategoryPage";
import CategoryItems from "../pages/SubCategory/SubCategoryItems";
import ScrollToTop from "../components/ScrollToTop";
import Profile from "../pages/Profile";
import Orders from "../pages/Orders";
import OtpScreen from "../pages/auth/OtpScreen";
import SearchResults from "../pages/SearchResults";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AnalyticsDashboard from "../pages/Admin/Analytics/AnalyticsDashboard";
import Coupons from "../pages/Admin/Marketing/Coupons";
import AdminOrderScreen from "../pages/Admin/Orders/AdminOrderScreen";
import KitchenDisplay from "../pages/Admin/Kitchen/KitchenDisplay";
import AdminInventory from "../pages/Admin/Inventory/AdminInventory";
import AdminStaff from "../pages/Admin/Staff/AdminStaff";
import AdminBanners from "../pages/Admin/Marketing/AdminBanners";
import AdminBrands from "../pages/Admin/Marketing/AdminBrands";
import AdminCombos from "../pages/Admin/Marketing/AdminCombos";
import AdminTopRated from "../pages/Admin/Catalog/AdminTopRated";
import ItemInventory from "../pages/Admin/Catalog/ItemInventory";

import AdminReviews from "../pages/Admin/Marketing/AdminReviews";
import AdminSettings from "../pages/Admin/Settings/AdminSettings";

import PrivateRoute from "../utils/PrivateRoute";
import PublicRoute from "../utils/PublicRoute";
import AdminAddItem from "../pages/Admin/Catalog/AdminAddItem";
import AdminCategories from "../pages/Admin/Catalog/AdminCategories";
import AdminSubCategories from "../pages/Admin/Catalog/AdminSubCategories";
import PushNotification from "../pages/Admin/Marketing/PushNotification";
import AdminCustomers from "../pages/Admin/AdminCustomers";
import AdminTranstionHistory from "../pages/AdminTranstionHistory/AdminTranstionHistory";


const AppRouters = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ---------------------- PROTECTED ROUTES ---------------------- */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Dynamic Category Routes */}
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/category/:categoryId/items/:subcategoryId" element={<CategoryItems />} />

          <Route path="/orders" element={<Orders />} />


          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/sub-categories" element={<AdminSubCategories />} />
          <Route path="/admin/add-item" element={<AdminAddItem />} />

          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin/marketing" element={<Coupons />} />
          <Route path="/admin/orders" element={<AdminOrderScreen />} />
          <Route path="/admin/marketing" element={<Coupons />} />
          <Route path="/admin/kitchen" element={<KitchenDisplay />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/banners" element={<AdminBanners />} />
          <Route path="/admin/notifications" element={<PushNotification />} />
          <Route path="/admin/brands" element={<AdminBrands />} />
          <Route path="/admin/combos" element={<AdminCombos />} />
          <Route path="/admin/top-rated" element={<AdminTopRated />} />
          <Route path="/admin/Item-Inventory" element={<ItemInventory />} />
          <Route path="/admin/transactions" element={<AdminTranstionHistory />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/Customers" element={<AdminCustomers />} />

        </Route>

        {/* ---------------------- PUBLIC ROUTES ---------------------- */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/otp" element={<PublicRoute><OtpScreen /> </PublicRoute>
        }
        />
      </Routes>
    </>
  );
};

export default AppRouters;
