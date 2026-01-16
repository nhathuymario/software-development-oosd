import { apiFetch } from "./http";

export type MeDTO = {
    id: number;
    username: string;
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
};

export function getMe() {
    return apiFetch("/api/users/me") as Promise<MeDTO>;
}

export function upsertMe(body: Partial<MeDTO>) {
    return apiFetch("/api/users/me", {
        method: "POST",
        body: JSON.stringify(body),
    }) as Promise<MeDTO>;
}
