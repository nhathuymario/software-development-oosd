import { getToken } from "./auth";

const BASE_URL = "http://localhost:8080"; // gateway

export async function apiFetch(path: string, options: RequestInit = {}) {
    const token = getToken();

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
