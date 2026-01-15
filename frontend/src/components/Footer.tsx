import "../assets/css/Footer.css";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-inner">
                {/* Brand */}
                <div className="footer-col">
                    <div className="footer-brand">
                        <div className="footer-logo" />
                        <div>
                            <div className="footer-name">MiniStore</div>
                            <div className="footer-desc">
                                Mua sắm nhanh • Giá tốt • Hỗ trợ tận tâm
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support */}
                <div className="footer-col">
                    <div className="footer-title">Hỗ trợ</div>
                    <a className="footer-link" href="#">Chính sách đổi trả</a>
                    <a className="footer-link" href="#">Chính sách bảo hành</a>
                    <a className="footer-link" href="#">Hướng dẫn mua hàng</a>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <div className="footer-title">Liên hệ</div>
                    <div className="footer-text">Hotline: 1900 0000</div>
                    <div className="footer-text">Email: support@ministore.vn</div>
                    <div className="footer-text">Giờ làm việc: 8:00 - 22:00</div>
                    <div className="footer-social">
                        <a className="social-btn" href="#" aria-label="Facebook">f</a>
                        <a className="social-btn" href="#" aria-label="Zalo">z</a>
                        <a className="social-btn" href="#" aria-label="YouTube">▶</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                © {year} MiniStore. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
