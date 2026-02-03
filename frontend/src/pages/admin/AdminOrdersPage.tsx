// quản lí order
import { useState } from "react"
import "../../assets/css/pages/products.css" // nếu bạn có card/btn style chung, có thể bỏ
import type { OrderDTO } from "../../services/orderApi"
import { getOrdersByUserId, markOrderPaid } from "../../services/orderApi"

export default function AdminOrdersPage() {
    const [userId, setUserId] = useState<string>("")
    const [items, setItems] = useState<OrderDTO[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function load() {
        try {
            setLoading(true)
            setError(null)
            const uid = Number(userId)
            const data = await getOrdersByUserId(uid)
            setItems(data)
        } catch (e: any) {
            setError(e?.message ?? "Không tải được đơn hàng")
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    async function pay(id: number) {
        if (!confirm(`Đánh dấu đơn #${id} đã thanh toán?`)) return
        try {
            await markOrderPaid(id)
            // refresh list (đơn giản)
            await load()
        } catch (e: any) {
            alert(e?.message ?? "Cập nhật thất bại")
        }
    }

    return (
        <div className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                    <h2 style={{ margin: 0 }}>Đơn hàng</h2>
                    <div style={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>
                        Hiện tại backend đang hỗ trợ lấy đơn theo <b>userId</b>.
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "220px auto", gap: 10, marginTop: 12 }}>
                <input
                    className="input"
                    placeholder="Nhập userId..."
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    inputMode="numeric"
                />
                <button className="btn primary" onClick={load} disabled={loading || !userId}>
                    {loading ? "Đang tải..." : "Tải đơn hàng"}
                </button>
            </div>

            {error && <div className="state err" style={{ marginTop: 10 }}>{error}</div>}

            <div style={{ marginTop: 12, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                        <th style={{ padding: "10px 8px" }}>ID</th>
                        <th style={{ padding: "10px 8px" }}>User</th>
                        <th style={{ padding: "10px 8px" }}>Status</th>
                        <th style={{ padding: "10px 8px" }}>Total</th>
                        <th style={{ padding: "10px 8px" }}>Created</th>
                        <th style={{ padding: "10px 8px" }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((o) => (
                        <tr key={o.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                            <td style={{ padding: "10px 8px" }}>#{o.id}</td>
                            <td style={{ padding: "10px 8px" }}>{o.userId ?? "-"}</td>
                            <td style={{ padding: "10px 8px" }}>{o.status ?? "-"}</td>
                            <td style={{ padding: "10px 8px" }}>
                                {o.totalAmount != null ? o.totalAmount.toLocaleString("vi-VN") + " ₫" : "-"}
                            </td>
                            <td style={{ padding: "10px 8px" }}>{o.createdAt ?? "-"}</td>
                            <td style={{ padding: "10px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <button className="btn" onClick={() => pay(o.id)}>
                                    Mark Paid
                                </button>

                                {/* TODO: Khi backend có endpoint update status thì mở lại */}
                                {/* <button className="btn">Update Status</button> */}
                            </td>
                        </tr>
                    ))}

                    {!loading && items.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ padding: 12, opacity: 0.7 }}>
                                Chưa có dữ liệu.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
