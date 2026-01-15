export function getToken() {
    return localStorage.getItem("token");
}

export function getRoles(): string[] {
    const token = getToken();
    if (!token) return [];

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.roles || [];
}

export function hasRole(role: string): boolean {
    return getRoles().includes(role);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}
