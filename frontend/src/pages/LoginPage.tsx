import { useState } from "react";
import axios from "axios";
import "../assets/css/pages/LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:8080/api/auth/login", {
                username,
                password,
            });


            const token = res.data.token;
            sessionStorage.setItem("token", token);

            // decode JWT để lấy role (đơn giản)
            const payload = JSON.parse(atob(token.split(".")[1]));
            const roles: string[] = payload.roles || [];

            if (roles.includes("ROLE_ADMIN")) {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            alert("Sai tài khoản hoặc mật khẩu");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-title">Đăng nhập</div>

                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        className="login-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="login-button">Đăng nhập</button>
                </form>
            </div>
        </div>

    );
};

export default LoginPage;
