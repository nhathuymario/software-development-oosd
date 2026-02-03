import { useNavigate } from "react-router-dom";
import "../assets/css/components/Header.css";
import {
    isAuthenticated,
    getUsername,
} from "../services/auth";

const Header = () => {
    const navigate = useNavigate();

    const authenticated = isAuthenticated();
    const username = getUsername();


    return (
        <header className="header">
            {/* LEFT */}
            <div className="header-left">
                <div className="logo-placeholder"></div>
                <span className="shop-name">Bà bảy shop</span>
            </div>

            {/* CENTER */}
            <div className="header-center">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="search-input"
                />
            </div>

            {/* RIGHT */}
            <div className="header-right">
                {!authenticated ? (
                    <button
                        className="header-btn login-btn"
                        onClick={() => navigate("/login")}
                    >
                        Đăng nhập
                    </button>
                ) : (
                    <div
                        className="user-badge"
                        onClick={() => navigate("/user")}
                        title="Xem tài khoản"
                    >
                        <span className="user-avatar">👤</span>
                        <span className="username">{username ?? "User"}</span>
                    </div>
                )}

                <button className="header-btn cart-btn">Giỏ hàng</button>
            </div>

        </header>
    );
};

export default Header;
