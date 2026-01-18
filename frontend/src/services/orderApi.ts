import { apiFetch } from "./http";

export type OrderDTO = {
    id: number;
    userId?: number;
    status?: string;
    totalAmount?: number;
    createdAt?: string;
};

/** Một số backend trả khác tên field -> normalize về OrderDTO */
function normalizeOrder(raw: any): OrderDTO {
    if (!raw) throw new Error("Order response is empty");

    const id = Number(raw.id ?? raw.orderId);
    if (!Number.isFinite(id)) throw new Error("Order id is missing/invalid");

    return {
        id,
        userId: raw.userId != null ? Number(raw.userId) : undefined,
        status: raw.status ?? raw.orderStatus ?? undefined,
        totalAmount:
            raw.totalAmount != null
                ? Number(raw.totalAmount)
                : raw.total != null
                    ? Number(raw.total)
                    : raw.amount != null
                        ? Number(raw.amount)
                        : undefined,
        createdAt:
            raw.createdAt ??
            raw.createdDate ??
            raw.createdTime ??
            raw.created_on ??
            undefined,
    };
}

function normalizeOrders(raw: any): OrderDTO[] {
    if (!raw) return [];
    if (!Array.isArray(raw)) {
        // nếu backend trả {data: []}
        const arr = raw.data;
        if (Array.isArray(arr)) return arr.map(normalizeOrder);
        throw new Error("Orders response is not an array");
    }
    return raw.map(normalizeOrder);
}

function requireUserId(userId: number | undefined | null): number {
    if (userId == null || !Number.isFinite(Number(userId))) {
        throw new Error("userId is required");
    }
    return Number(userId);
}

/** Backend: GET /api/orders?userId=... */
export async function getOrdersByUserId(userId: number | undefined) {
    const uid = requireUserId(userId);
    const raw = await apiFetch(`/api/orders?userId=${uid}`);
    return normalizeOrders(raw);
}

/** Backend: GET /api/orders/{id} */
export async function getOrderById(id: number) {
    const raw = await apiFetch(`/api/orders/${id}`);
    return normalizeOrder(raw);
}

/** Backend: POST /api/orders/place?userId=... */
export async function placeOrder(userId: number | undefined) {
    const uid = requireUserId(userId);
    const raw = await apiFetch(`/api/orders/place?userId=${uid}`, { method: "POST" });
    return normalizeOrder(raw);
}

/** Backend: PUT /api/orders/{id}/pay */
export async function markOrderPaid(id: number) {
    await apiFetch(`/api/orders/${id}/pay`, { method: "PUT" });
}

/**
 * Backend: GET /api/orders/my-orders (nhận header X-User-Id)
 * Chỉ dùng được nếu backend đang đọc header này (gateway/FE set header).
 */
export async function getMyOrdersByHeader(userId: number | undefined) {
    const uid = requireUserId(userId);
    const raw = await apiFetch(`/api/orders/my-orders`, {
        headers: {
            "X-User-Id": String(uid),
        },
    });
    return normalizeOrders(raw);
}
