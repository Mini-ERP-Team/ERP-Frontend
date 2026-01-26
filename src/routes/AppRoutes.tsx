import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import MainLayout from "../layouts/MainLayout";
import ProductsPage from "../pages/ProductsPage";
import CustomersPage from "../pages/CustomersPage";
import SuppliersPage from "../pages/SuppliersPage";
import UsersPage from "../pages/UsersPage";
import InventoryPage from "../pages/InventoryPage";
import SalesPage from "../pages/SalesPage";
import ImportsPage from "../pages/ImportsPage";
import RoleRoute from "../components/RoleRoute";

const AppRoutes = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/imports" element={<ImportsPage />} />

        <Route element={<RoleRoute allowedRoles={['STAFF']} />}>
            <Route path="/sales" element={<SalesPage />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>

      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
