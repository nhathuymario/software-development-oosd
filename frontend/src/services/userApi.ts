import { apiFetch } from "./http";

export type MeDTO = {
    id?: number;        // chỉ có nếu entity có id
    username: string;
    fullName?: string;
    phone?: string;
    address?: string;
};

export function getMe() {
    return apiFetch("/api/users/me") as Promise<MeDTO>;
}

export async function upsertMe(body: Partial<MeDTO>): Promise<MeDTO> {
    return apiFetch("/api/users/me", {
        method: "PUT",
        body: JSON.stringify(body),
    });
}
