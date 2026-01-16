import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/admin/AdminPage";
import ForbiddenPage from "./pages/ForbiddenPage/ForbiddenPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDetailPage from "./pages/user/UserDetailPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Layout có Header + Footer */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="ROLE_ADMIN">
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
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

            </Routes>
        </BrowserRouter>
    );
}

export default App;
