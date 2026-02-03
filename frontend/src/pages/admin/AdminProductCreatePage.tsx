// tạo sản phẩm
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createProduct } from "../../services/products"
import "../../assets/css/pages/admin-product-create.css"

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
        <div className="ap-create">
            <div className="ap-card">
                <h2 className="ap-title">Thêm sản phẩm</h2>

                <form className="ap-form" onSubmit={submit}>
                    <div className="ap-field">
                        <label className="ap-label">Tên sản phẩm</label>
                        <input
                            className="ap-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="ap-field">
                        <label className="ap-label">Giá</label>
                        <input
                            className="ap-input"
                            type="number"
                            min={0}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="ap-field">
                        <label className="ap-label">Tồn kho</label>
                        <input
                            className="ap-input"
                            type="number"
                            min={0}
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </div>

                    <div className="ap-field">
                        <label className="ap-label">Image URL</label>
                        <input
                            className="ap-input"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </div>

                    <div className="ap-actions">
                        <button className="ap-btn primary" type="submit" disabled={loading}>
                            {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                        <button
                            className="ap-btn secondary"
                            type="button"
                            onClick={() => nav("/admin/products")}
                        >
                            Huỷ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

