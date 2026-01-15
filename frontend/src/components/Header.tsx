import "../assets/css/Header.css";

const Header = () => {
    return (
        <header className="header">
            {/* Left: Logo + Shop name */}
            <div className="header-left">
                <div className="logo-placeholder"></div>
                <span className="shop-name">MiniStore</span>
            </div>

            {/* Center: Search */}
            <div className="header-center">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="search-input"
                />
            </div>

            {/* Right: Login + Cart */}
            <div className="header-right">
                <button className="header-btn">Đăng nhập</button>
                <button className="header-btn cart-btn">Giỏ hàng</button>
            </div>
        </header>
    );
};

export default Header;
