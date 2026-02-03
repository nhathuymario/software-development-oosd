// ProductCard.tsx
import { useMemo, useState } from "react"
import type { Product } from "../../services/products"
import { hasRole } from "../../services/auth"

type Props = {
    p: Product
    onView?: (p: Product) => void
    onAddToCart?: (p: Product) => void
    onEdit?: (p: Product) => void
    onDelete?: (p: Product) => void
}

// ✅ chỉnh theo gateway của bạn
const GATEWAY_BASE = "http://localhost:8080"

function resolveImageUrl(imageUrl?: string) {
    if (!imageUrl) return ""

    // đã là absolute url
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl

    // normalize: đảm bảo có dấu "/" đầu
    const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`

    // ảnh serve qua gateway
    return `${GATEWAY_BASE}${path}`
}

export default function ProductCard({ p, onView, onAddToCart, onEdit, onDelete }: Props) {
    const isAdmin = hasRole("ADMIN") || hasRole("ROLE_ADMIN")

    const [imgBroken, setImgBroken] = useState(false)

    const imgSrc = useMemo(() => {
        if (!p.imageUrl) return ""
        return resolveImageUrl(p.imageUrl)
    }, [p.imageUrl])

    const canAdd = !isAdmin && (p.stock == null || p.stock > 0)

    return (
        <div className="p-card">
            <div className="p-thumb">
                {!imgBroken && imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={p.name}
                        loading="lazy"
                        onError={() => setImgBroken(true)}
                    />
                ) : (
                    <div className="p-thumb-placeholder">No image</div>
                )}
            </div>

            <div className="p-body">
                <div className="p-name" title={p.name}>
                    {p.name}
                </div>

                <div className="p-price">
                    {Number(p.price ?? 0).toLocaleString("vi-VN")} ₫
                </div>

                {typeof p.stock === "number" && (
                    <div className={`p-stock ${p.stock <= 0 ? "out" : ""}`}>
                        {p.stock <= 0 ? "Hết hàng" : `Tồn kho: ${p.stock}`}
                    </div>
                )}

                <div className="p-actions">
                    <button className="btn" onClick={() => onView?.(p)}>
                        Xem
                    </button>

                    {!isAdmin && (
                        <button
                            className="btn primary"
                            onClick={() => onAddToCart?.(p)}
                            disabled={!canAdd}
                            title={!canAdd ? "Hết hàng" : "Thêm vào giỏ"}
                        >
                            Thêm giỏ
                        </button>
                    )}

                    {isAdmin && (
                        <>
                            <button className="btn" onClick={() => onEdit?.(p)}>
                                Sửa
                            </button>
                            <button className="btn danger" onClick={() => onDelete?.(p)}>
                                Xoá
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
