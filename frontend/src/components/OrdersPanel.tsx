import { useEffect, useMemo, useState } from "react";
import { getMe, type MeDTO } from "../services/userApi";
import { getOrdersByUserId, type OrderDTO } from "../services/orderApi";

type StatusKey =
    | "all"
    | "pending"
    | "confirmed"
    | "shipping"
    | "delivering"
    | "canceled"
    | "done";

export default function OrdersPanel() {
    const [me, setMe] = useState<MeDTO | null>(null);
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [status, setStatus] = useState<StatusKey>("all");

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setErr(null);

                const meRes = await getMe();
                if (!mounted) return;
                setMe(meRes);

                const ordersRes = await getOrdersByUserId(meRes.id);
                if (!mounted) return;
                setOrders(ordersRes || []);
            } catch (e: any) {
                setErr(e?.message ?? "Load orders failed");
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        if (status === "all") return orders;
        return orders.filter((o) => (o.status ?? "").toLowerCase() === status);
    }, [orders, status]);

    return (
        <div className="ud-card">
            <div className="ud-headrow">
                <h2 className="ud-title">Đơn hàng đã mua</h2>

                <div className="ud-range">
                    <span>Từ 16/01/2025 - 16/01/2026</span>
                    <button className="ud-linkbtn" type="button">
                        🗓️ Thay đổi
                    </button>
                </div>
            </div>

            <div className="ud-tabs">
                <TabBtn active={status === "all"} onClick={() => setStatus("all")}>
                    Tất cả
                </TabBtn>
                <TabBtn active={status === "pending"} onClick={() => setStatus("pending")}>
                    Chờ xử lý
                </TabBtn>
                <TabBtn active={status === "confirmed"} onClick={() => setStatus("confirmed")}>
                    Đã xác nhận
                </TabBtn>
                <TabBtn active={status === "shipping"} onClick={() => setStatus("shipping")}>
                    Đang chuyển hàng
                </TabBtn>
                <TabBtn active={status === "delivering"} onClick={() => setStatus("delivering")}>
                    Đang giao hàng
                </TabBtn>
                <TabBtn active={status === "canceled"} onClick={() => setStatus("canceled")}>
                    Đã hủy
                </TabBtn>
                <TabBtn active={status === "done"} onClick={() => setStatus("done")}>
                    Thành công
                </TabBtn>
            </div>

            {loading && <div className="ud-note">Đang tải đơn hàng...</div>}
            {err && <div className="ud-note" style={{ color: "crimson" }}>{err}</div>}

            {!loading && !err && filtered.length === 0 && (
                <div className="ud-note">Chưa có đơn hàng nào.</div>
            )}

            {!loading && !err && filtered.map((o) => (
                <div className="ud-order" key={String(o.id)}>
                    <div className="ud-order-top">
                        <div className="ud-order-code">
                            <b>Đơn hàng:</b> #{o.code ?? o.id}
                        </div>
                        <div className="ud-order-status">{o.status ?? "—"}</div>
                    </div>

                    <div className="ud-order-body">
                        <div className="ud-thumb" />
                        <div className="ud-order-info">
                            <div className="ud-order-name">Đơn hàng của {me?.username ?? "bạn"}</div>
                            <div className="ud-order-sub">
                                {o.createdAt ? `Ngày tạo: ${o.createdAt}` : "Chi tiết sản phẩm backend thêm sau"}
                            </div>
                        </div>

                        <div className="ud-order-total">
                            <div className="ud-muted">Tổng tiền:</div>
                            <div className="ud-money">
                                {(o.totalAmount ?? 0).toLocaleString("vi-VN")}đ
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function TabBtn({
                    active,
                    onClick,
                    children,
                }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button className={`ud-tabbtn ${active ? "active" : ""}`} onClick={onClick}>
            {children}
        </button>
    );
}
