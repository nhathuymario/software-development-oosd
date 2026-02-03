import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createProduct } from "../../services/products"

export default function AdminProductCreatePage() {
    const nav = useNavigate()
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [loading, setLoading] = useState(false)

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        try {
            setLoading(true)
            await createProduct({
                name,
                price: Number(price),
                stock: Number(stock),
                imageUrl,
            })
            nav("/admin/products", { replace: true })
        } catch (e: any) {
            alert(e?.message ?? "Tạo sản phẩm thất bại")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: 16 }}>
            <h2>Thêm sản phẩm</h2>

            <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên" required />
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Giá" type="number" min={0} required />
                <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Tồn kho" type="number" min={0} required />
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" />

                <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit" disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu"}
                    </button>
                    <button type="button" onClick={() => nav("/admin/products")}>
                        Huỷ
                    </button>
                </div>
            </form>
        </div>
    )
}
