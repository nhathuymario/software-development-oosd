export function getToken() {
    return sessionStorage.getItem("token");
}

function decodeBase64Url(str: string) {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 ? "=".repeat(4 - (base64.length % 4)) : "";
    return atob(base64 + pad);
}

function getPayload(): any | null {
    const token = getToken();
    if (!token) return null;

    try {
        const payloadPart = token.split(".")[1];
        return JSON.parse(decodeBase64Url(payloadPart));
    } catch {
        return null;
    }
}

export function getRoles(): string[] {
    const payload = getPayload();
    return payload?.roles || payload?.authorities || [];
}

export function hasRole(role: string): boolean {
    return getRoles().includes(role);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

/* 👉 LẤY TÊN USER */
export function getUsername(): string | null {
    const payload = getPayload();
    return payload?.sub || payload?.username || payload?.email || null;
}

/* 👉 LOGOUT */
export function logout() {
    sessionStorage.removeItem("token");
}
