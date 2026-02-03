import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/home/ProductsPublicPage.tsx";
import LoginPage from "./pages/LoginPage";
import ForbiddenPage from "./pages/ForbiddenPage/ForbiddenPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDetailPage from "./pages/user/UserDetailPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductCreatePage from "./pages/admin/AdminProductCreatePage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Layout có Header + Footer */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />

                    {/* Admin có sidebar + outlet */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="ROLE_ADMIN">
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="products" replace />} />
                        <Route path="products/new" element={<AdminProductCreatePage />} />
                        <Route path="inventory" element={<AdminInventoryPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                    </Route>

                    <Route
                        path="/user"
                        element={
                            <ProtectedRoute>
                                <UserDetailPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* Không có Header / Footer */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/403" element={<ForbiddenPage />} />

                {/* Fallback (khuyên thêm để tránh trắng trang) */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
