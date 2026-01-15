import { useNavigate } from "react-router-dom";
import "../assets/css/components/Header.css";

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            {/* LEFT */}
            <div className="header-left">
                <div className="logo-placeholder"></div>
                <span className="shop-name">MiniStore</span>
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
                <button
                    className="header-btn"
                    onClick={() => navigate("/login")}
                >
                    Đăng nhập
                </button>

                <button className="header-btn cart-btn">Giỏ hàng</button>
            </div>
        </header>
    );
};

export default Header;
