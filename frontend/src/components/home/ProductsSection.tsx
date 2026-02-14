import { useEffect, useMemo, useState } from "react"
import "../../assets/css/pages/HomePage.css"
import ProductCard from "../products/ProductCard"
import { getPublicProducts, type Product } from "../../services/products"

const PAGE_SIZE = 12

export default function ProductsSection() {
    const [items, setItems] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount])
    const canLoadMore = visibleCount < items.length

    async function loadList() {
        try {
            setLoading(true)
            setError(null)
            const data = await getPublicProducts()
            setItems(data || [])
            setVisibleCount(PAGE_SIZE)
        } catch (e: any) {
            setError(e?.message ?? "Không tải được sản phẩm")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadList()
    }, [])

    return (
        <div className="hp-products">
            <div className="hp-section-head">
                <h2 className="hp-title">Gợi ý cho bạn</h2>
            </div>

            {loading && <div className="state">Đang tải...</div>}
            {error && <div className="state err">{error}</div>}
            {!loading && !error && items.length === 0 && <div className="state">Không có sản phẩm</div>}

            <div className="grid hp-products-grid">
                {visibleItems.map((p) => (
                    <ProductCard
                        key={p.id}
                        p={p}
                        onView={() => alert(`TODO: open product detail ${p.id}`)}
                        onAddToCart={() => alert("TODO: add to cart")}
                    />
                ))}
            </div>

            {!loading && !error && items.length > 0 && (
                <div className="hp-loadmore">
                    {canLoadMore ? (
                        <button className="btn hp-loadmore-btn" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
                            Xem thêm 12 sản phẩm
                        </button>
                    ) : (
                        <div className="hp-loadmore-done">Đã hiển thị tất cả sản phẩm</div>
                    )}
                </div>
            )}
        </div>
    )
}
