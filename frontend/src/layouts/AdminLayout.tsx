import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { logout } from "../services/auth"
import "../assets/css/pages/admin-layout.css"

export default function AdminLayout() {
    const nav = useNavigate()

    function doLogout() {
        logout()
        nav("/login", { replace: true })
    }

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-brand" onClick={() => nav("/admin")}>
                    <div className="admin-logo" />
                    <div>
                        <div className="admin-brand-title">MiniStore</div>
                        <div className="admin-brand-sub">Admin Panel</div>
                    </div>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin/products/new" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                        🛍️ Quản lý sản phẩm
                    </NavLink>

                    <NavLink to="/admin/inventory" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                        📦 Tồn kho
                    </NavLink>

                    <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                        🧾 Đơn hàng
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="btn danger w-full" onClick={doLogout}>
                        Đăng xuất
                    </button>
                    <button className="btn w-full" onClick={() => nav("/")}>
                        ← Về trang mua hàng
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    )
}
