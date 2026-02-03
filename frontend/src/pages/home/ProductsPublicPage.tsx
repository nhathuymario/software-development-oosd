import { useEffect, useMemo, useState } from "react"
import "../../assets/css/pages/HomePage.css"
import {
    deleteProduct,
    getPublicProducts,
    searchPublicProducts,
    type Product,
} from "../../services/products"
import ProductCard from "../../components/products/ProductCard"

const PAGE_SIZE = 12

// ====== mock data bài viết (sau thay bằng API cũng được) ======
type Article = { id: number; title: string; img: string; desc?: string }
const mockArticles: Article[] = [
    {
        id: 1,
        title: "Đặt vé máy bay, nhận quà liền tay...",
        img: "/img/articles/a1.png",
    },
    {
        id: 2,
        title: "Còn bao nhiêu ngày nữa đến Tết 2026?",
        img: "/img/articles/a2.png",
    },
    {
        id: 3,
        title: 'Hướng dẫn khắc phục lỗi "CHKDSK..."',
        img: "/img/articles/a3.png",
    },
    {
        id: 4,
        title: "Lập Xuân là gì? Ngày Lập Xuân 2026...",
        img: "/img/articles/a4.png",
    },
]

function ArticlesSection() {
    return (
        <div className="hp-articles">
            <div className="hp-section-head">
                <h2 className="hp-title">Mạng xã hội thegioididong.com</h2>
                <button className="hp-link" onClick={() => alert("TODO: xem thêm bài viết")}>
                    Xem thêm →
                </button>
            </div>

            <div className="hp-articles-grid">
                {mockArticles.map((a) => (
                    <article className="hp-article-card" key={a.id}>
                        <div className="hp-article-thumb">
                            <img src={a.img} alt={a.title} loading="lazy" />
                        </div>
                        <div className="hp-article-title" title={a.title}>{a.title}</div>
                    </article>
                ))}
            </div>
        </div>
    )
}

function BannerSection() {
    return (
        <div className="hp-banner">
            {/* thay src bằng ảnh banner thật của bạn */}
            <img
                src="/img/banner-tet.png"
                alt="Sắm Tết sớm - Giá rẻ hơn"
                loading="lazy"
            />
        </div>
    )
}

export default function ProductsPublicPage() {
    const [items, setItems] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // filter UI
    const [q, setQ] = useState("")
    const [minPrice, setMinPrice] = useState<string>("")
    const [maxPrice, setMaxPrice] = useState<string>("")

    // ✅ show 12 -> load more 12
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    const visibleItems = useMemo(
        () => items.slice(0, visibleCount),
        [items, visibleCount]
    )

    async function loadList() {
        try {
            setLoading(true)
            setError(null)
            const data = await getPublicProducts()
            setItems(data)
            setVisibleCount(PAGE_SIZE) // ✅ reset về 12 khi load lại
        } catch (e: any) {
            setError(e?.message ?? "Không tải được sản phẩm")
        } finally {
            setLoading(false)
        }
    }

    async function onSearch() {
        try {
            setLoading(true)
            setError(null)

            const data = await searchPublicProducts({
                name: q || undefined,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
            })

            setItems(data)
            setVisibleCount(PAGE_SIZE) // ✅ reset về 12 khi search
        } catch (e: any) {
            setError(e?.message ?? "Search lỗi")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadList()
    }, [])

    async function handleDelete(p: Product) {
        if (!confirm(`Xoá "${p.name}" ?`)) return
        try {
            await deleteProduct(p.id)
            setItems((prev) => prev.filter((x) => x.id !== p.id))
        } catch (e: any) {
            alert(e?.message ?? "Xoá thất bại")
        }
    }

    const canLoadMore = visibleCount < items.length

    return (
        <div className="hp-page">
            <div className="hp-container">
                {/* ====== KHUNG BÀI VIẾT ====== */}
                <div className="hp-card">
                    <ArticlesSection />
                </div>

                {/* ====== KHUNG BANNER QUẢNG CÁO ====== */}
                <div className="hp-card">
                    <BannerSection />
                </div>

                {/* ====== KHUNG SẢN PHẨM ====== */}
                <div className="hp-card">
                    <div className="hp-section-head">
                        <h2 className="hp-title">Gợi ý cho bạn</h2>
                    </div>

                    {/* filter giữ nguyên */}
                    <div className="filters">
                        <input
                            className="input"
                            placeholder="Tìm theo tên..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSearch()}
                        />

                        <input
                            className="input"
                            placeholder="Min price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            inputMode="numeric"
                        />

                        <input
                            className="input"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            inputMode="numeric"
                        />

                        <button className="btn" onClick={onSearch}>Lọc</button>
                        <button className="btn" onClick={loadList}>Reset</button>
                    </div>

                    {loading && <div className="state">Đang tải...</div>}
                    {error && <div className="state err">{error}</div>}

                    {!loading && !error && items.length === 0 && (
                        <div className="state">Không có sản phẩm</div>
                    )}

                    {/* ✅ grid chỉ render visibleItems */}
                    <div className="grid">
                        {visibleItems.map((p) => (
                            <ProductCard
                                key={p.id}
                                p={p}
                                onView={() => alert(`TODO: open product detail ${p.id}`)}
                                onAddToCart={() => alert("TODO: add to cart")}
                                onEdit={() => alert(`TODO: edit product ${p.id}`)}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {/* ✅ nút xem thêm */}
                    {!loading && !error && items.length > 0 && (
                        <div className="hp-loadmore">
                            {canLoadMore ? (
                                <button
                                    className="btn hp-loadmore-btn"
                                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                                >
                                    Xem thêm 12 sản phẩm
                                </button>
                            ) : (
                                <div className="hp-loadmore-done">Đã hiển thị tất cả sản phẩm</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
