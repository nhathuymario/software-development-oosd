import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export type TabKey = "orders" | "profile";

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

    const handleLogout = () => {
        logout();
        navigate("/login");
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
                <button
                    className={`ud-nav-item ${tab === "orders" ? "active" : ""}`}
                    onClick={() => onChangeTab("orders")}
                >
                    <span className="ud-nav-ico">🧾</span>
                    <span>Đơn hàng đã mua</span>
                </button>

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
