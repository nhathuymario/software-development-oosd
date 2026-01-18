import { getToken, isTokenExpired, logout } from "./auth";

const BASE_URL = "http://localhost:8080"; // gateway

export async function apiFetch(path: string, options: RequestInit = {}) {
    const token = getToken();

    // Nếu token hết hạn thì logout trước khi gọi
    if (token && isTokenExpired(token)) {
        logout();
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    const headers: Record<string, string> = {
        ...(options.headers as any),
    };

    // chỉ set Content-Type khi có body
    if (!headers["Content-Type"] && options.body) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
    });

    // 401: không auto logout ngay (tránh “văng” oan)
    // Chỉ logout nếu token có mà server vẫn 401 (khả năng token invalid)
    if (res.status === 401 && token) {
        // logout();
    }

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
    }

    if (res.status === 204) return null;
    return res.json();
}
