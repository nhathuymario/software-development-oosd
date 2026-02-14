import { getToken, isTokenExpired, logout } from "./auth"

const BASE_URL = "http://localhost:8080" // gateway

type ApiFetchOptions = RequestInit & {
    // nếu bạn muốn ép parse json hay không có thể mở rộng sau
}

export async function apiFetch<T = any>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const token = getToken()

    // Nếu token hết hạn thì logout trước khi gọi
    if (token && isTokenExpired(token)) {
        logout()
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
    }

    const headers: Record<string, string> = {
        ...(options.headers as any),
    }

    // chỉ set Content-Type khi có body và body không phải FormData
    const hasBody = options.body !== undefined && options.body !== null
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData

    if (!headers["Content-Type"] && hasBody && !isFormData) {
        headers["Content-Type"] = "application/json"
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
    })

    // 401: bạn đang không auto logout (ok)
    // if (res.status === 401 && token) { ... }

    if (!res.ok) {
        // cố đọc message từ body (json hoặc text)
        let message = ""
        try {
            const ct = res.headers.get("content-type") || ""
            if (ct.includes("application/json")) {
                const j = await res.json().catch(() => null)
                message = (j && (j.message || j.error)) ? String(j.message || j.error) : ""
            } else {
                message = await res.text().catch(() => "")
            }
        } catch {
            message = ""
        }
        throw new Error(message || `HTTP ${res.status}`)
    }

    // 204 No Content
    if (res.status === 204) return null as unknown as T

    // nếu response không có json (vd file), trả text
    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
        return (await res.text()) as unknown as T
    }

    return (await res.json()) as T
}
