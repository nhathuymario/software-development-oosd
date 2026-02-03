import { useNavigate } from "react-router-dom";
import { logout, hasRole, getRoles } from "../services/auth";

export type TabKey = "orders" | "profile" | "dashboard";

export default function UserSidebar({
                                        username,
                                        tab,
                                        onChangeTab,
                                    }: {
    username: string;
    tab: TabKey;
    onChangeTab: (t: TabKey) => void;
}) {
    const navigate = useNavigate();

    const isAdmin =
        (typeof hasRole === "function" && (hasRole("ROLE_ADMIN") || hasRole("ADMIN"))) ||
        (typeof getRoles === "function" &&
            (getRoles().includes("ROLE_ADMIN") || getRoles().includes("ADMIN")));

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const goAdminDashboard = () => {
        navigate("/admin/products/new", { replace: true });
    };

    return (
        <aside className="ud-sidebar">
            <div className="ud-userline">
                <span className="ud-avatar">👤</span>
                <div className="ud-usertext">
                    <div className="ud-hello">Anh</div>
                    <div className="ud-name">{username}</div>
                </div>
            </div>

            <nav className="ud-nav">
                {/* ✅ ADMIN: Dashboard | USER: Orders */}
                {isAdmin ? (
                    <button
                        className={`ud-nav-item ${tab === "dashboard" ? "active" : ""}`}
                        onClick={goAdminDashboard}
                    >
                        <span className="ud-nav-ico">📊</span>
                        <span>Dashboard</span>
                    </button>
                ) : (
                    <button
                        className={`ud-nav-item ${tab === "orders" ? "active" : ""}`}
                        onClick={() => onChangeTab("orders")}
                    >
                        <span className="ud-nav-ico">🧾</span>
                        <span>Đơn hàng đã mua</span>
                    </button>
                )}

                {/* ✅ Cả admin/user đều thấy profile */}
                <button
                    className={`ud-nav-item ${tab === "profile" ? "active" : ""}`}
                    onClick={() => onChangeTab("profile")}
                >
                    <span className="ud-nav-ico">📍</span>
                    <span>Thông tin và sổ địa chỉ</span>
                </button>
            </nav>

            <button className="ud-logout" onClick={handleLogout}>
                Đăng Xuất
            </button>
        </aside>
    );
}
