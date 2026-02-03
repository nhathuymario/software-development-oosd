//giỏ hàng
import type { Product } from "../../services/products"
import { hasRole } from "../../services/auth"

type Props = {
    p: Product
    onView?: (p: Product) => void
    onAddToCart?: (p: Product) => void
    onEdit?: (p: Product) => void
    onDelete?: (p: Product) => void
}

export default function ProductCard({ p, onView, onAddToCart, onEdit, onDelete }: Props) {
    const isAdmin = hasRole("ADMIN") || hasRole("ROLE_ADMIN")

    return (
        <div className="p-card">
            <div className="p-thumb">
                {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} />
                ) : (
                    <div className="p-thumb-placeholder">No image</div>
                )}
            </div>

            <div className="p-body">
                <div className="p-name" title={p.name}>{p.name}</div>

                <div className="p-price">
                    {Number(p.price ?? 0).toLocaleString("vi-VN")} ₫
                </div>

                {typeof p.stock === "number" && (
                    <div className={`p-stock ${p.stock <= 0 ? "out" : ""}`}>
                        {p.stock <= 0 ? "Hết hàng" : `Tồn kho: ${p.stock}`}
                    </div>
                )}

                <div className="p-actions">
                    <button className="btn" onClick={() => onView?.(p)}>Xem</button>

                    {!isAdmin && (
                        <button className="btn primary" onClick={() => onAddToCart?.(p)} disabled={p.stock === 0}>
                            Thêm giỏ
                        </button>
                    )}

                    {isAdmin && (
                        <>
                            <button className="btn" onClick={() => onEdit?.(p)}>Sửa</button>
                            <button className="btn danger" onClick={() => onDelete?.(p)}>Xoá</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
