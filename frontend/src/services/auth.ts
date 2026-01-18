const TOKEN_KEY = "token";

/* ================= TOKEN ================= */

export function getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
    sessionStorage.setItem(TOKEN_KEY, token);
}

export function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
}

/* ================= JWT DECODE ================= */

function decodeBase64Url(str: string): string {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 ? "=".repeat(4 - (base64.length % 4)) : "";
    return atob(base64 + pad);
}

export function getPayload(): any | null {
    const token = getToken();
    if (!token) return null;

    try {
        const payloadPart = token.split(".")[1];
        return JSON.parse(decodeBase64Url(payloadPart));
    } catch {
        return null;
    }
}

/* ================= AUTH INFO ================= */

export function getRoles(): string[] {
    const payload = getPayload();
    return Array.isArray(payload?.roles) ? payload.roles : [];
}

export function hasRole(role: string): boolean {
    return getRoles().includes(role);
}

export function getUsername(): string | null {
    const payload = getPayload();
    return payload?.sub ?? null;
}

export function isTokenExpired(token?: string | null): boolean {
    const t = token ?? getToken();
    if (!t) return true;

    try {
        const payloadPart = t.split(".")[1];
        const payload = JSON.parse(decodeBase64Url(payloadPart));
        if (!payload?.exp) return false; // không có exp thì coi như chưa hết hạn
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}

export function isAuthenticated(): boolean {
    const token = getToken();
    if (!token) return false;
    return !isTokenExpired(token);
}
