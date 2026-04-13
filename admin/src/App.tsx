import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useAuthStore } from './store/auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { BrandsPage } from './pages/BrandsPage';
import { BannersPage } from './pages/BannersPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { DeliveryZonesPage } from './pages/DeliveryZonesPage';
import { TimeSlotsPage } from './pages/TimeSlotsPage';
import { AdminsPage } from './pages/AdminsPage';
import POSUsersPage from './pages/POSUsersPage';
import { NotReviewedProductsPage } from './pages/NotReviewedProductsPage';

const theme = {
  token: {
    colorPrimary: '#000000',
  },
};

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/banners" element={<BannersPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/delivery-zones" element={<DeliveryZonesPage />} />
              <Route path="/time-slots" element={<TimeSlotsPage />} />
              <Route path="/not-reviewed-products" element={<NotReviewedProductsPage />} />
              <Route path="/pos-users" element={<POSUsersPage />} />
              <Route path="/admins" element={<AdminsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
