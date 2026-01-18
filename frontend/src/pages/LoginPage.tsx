import { useState } from "react";
import axios from "axios";
import "../assets/css/pages/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { setToken, getRoles } from "../services/auth";

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

            const token: string | undefined = res.data?.token;
            if (!token) throw new Error("Missing token");

            setToken(token);

            // ✅ kiểm tra ngay tại đây
            console.log("token saved:", sessionStorage.getItem("token"));

            const roles = getRoles();
            if (roles.includes("ROLE_ADMIN")) navigate("/admin", { replace: true });
            else navigate("/", { replace: true });
        } catch {
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
