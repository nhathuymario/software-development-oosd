import { useEffect, useState } from "react"
import "../../assets/css/pages/HomePage.css"
import {
    deleteProduct,
    getPublicProducts,
    searchPublicProducts,
    type Product,
} from "../../services/products"
// import { hasRole } from "../../services/auth"
import ProductCard from "../../components/products/ProductCard"
// import { useNavigate } from "react-router-dom"




export default function ProductsPublicPage() {
    // const isAdmin = useMemo(() => hasRole("ADMIN") || hasRole("ROLE_ADMIN"), [])

    const [items, setItems] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    // const nav = useNavigate()

    // filter UI
    const [q, setQ] = useState("")
    const [minPrice, setMinPrice] = useState<string>("")
    const [maxPrice, setMaxPrice] = useState<string>("")

    async function loadList() {
        try {
            setLoading(true)
            setError(null)
            const data = await getPublicProducts()
            setItems(data)
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
            await deleteProduct(p.id) // admin endpoint trong service
            setItems((prev) => prev.filter((x) => x.id !== p.id))
        } catch (e: any) {
            alert(e?.message ?? "Xoá thất bại")
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div className="card">
                    {/*<div className="toolbar">*/}
                    {/*    <div className="title">*/}
                    {/*        <h2>Sản phẩm</h2>*/}
                    {/*    </div>*/}

                    {/*    {isAdmin && (*/}
                    {/*        <button*/}
                    {/*            className="btn primary"*/}
                    {/*            onClick={() => nav("/admin/products/new")}*/}
                    {/*        >*/}
                    {/*            + Thêm sản phẩm*/}
                    {/*        </button>*/}

                    {/*    )}*/}
                    {/*</div>*/}

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

                    <div className="grid">
                        {items.map((p) => (
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
                </div>
            </div>
        </div>
    )
}
