import { apiFetch } from "./http";

export type OrderDTO = {
    id: number | string;
    code?: string;
    status?: string;
    totalAmount?: number;
    createdAt?: string;
};

export function getOrdersByUserId(userId: number) {
    return apiFetch(`/api/orders?userId=${userId}`) as Promise<OrderDTO[]>;
}
