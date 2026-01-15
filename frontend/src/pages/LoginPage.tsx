import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:8080/auth/login", {
                username,
                password,
            });

            const token = res.data.token;
            localStorage.setItem("token", token);

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
        <div style={{ maxWidth: 360, margin: "80px auto" }}>
            <h2>Đăng nhập</h2>

            <form onSubmit={handleLogin}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: "100%", marginBottom: 12 }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", marginBottom: 12 }}
                />

                <button style={{ width: "100%" }}>Đăng nhập</button>
            </form>
        </div>
    );
};

export default LoginPage;
