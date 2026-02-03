import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../assets/css/pages/admin-product-create.css"
import { getToken } from "../../services/auth"

const GATEWAY_BASE = "http://localhost:8080"
const MAX_MB = 5
const MAX_BYTES = MAX_MB * 1024 * 1024

export default function AdminProductCreatePage() {
    const nav = useNavigate()

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const previewUrl = useMemo(() => {
        if (!imageFile) return ""
        return URL.createObjectURL(imageFile)
    }, [imageFile])

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] ?? null
        if (!f) {
            setImageFile(null)
            return
        }
        if (f.size > MAX_BYTES) {
            alert(`Ảnh quá lớn. Vui lòng chọn ảnh <= ${MAX_MB}MB`)
            e.target.value = ""
            setImageFile(null)
            return
        }
        setImageFile(f)
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault()

        const p = Number(price)
        const s = Number(stock)

        if (!name.trim()) return alert("Tên sản phẩm không được trống")
        if (!Number.isFinite(p) || p < 0) return alert("Giá không hợp lệ")
        if (!Number.isFinite(s) || s < 0) return alert("Tồn kho không hợp lệ")

        try {
            setLoading(true)

            const fd = new FormData()
            // ✅ field rời (đơn giản, backend dễ nhận)
            fd.append("name", name.trim())
            fd.append("price", String(p))
            fd.append("stock", String(s))
            if (imageFile) fd.append("image", imageFile)

            const token = getToken()
            const res = await fetch(`${GATEWAY_BASE}/api/products/admin`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                body: fd,
                credentials: "include",
            })

            if (!res.ok) {
                const text = await res.text().catch(() => "")
                throw new Error(text || `HTTP ${res.status}`)
            }

            nav("/admin/products", { replace: true })
        } catch (err: any) {
            alert(err?.message ?? "Tạo sản phẩm thất bại")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="ap-create">
            <div className="ap-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <h2 className="ap-title">Thêm sản phẩm</h2>
                    <button className="ap-btn secondary" type="button" onClick={() => nav("/admin/products")} disabled={loading}>
                        ← Quay lại
                    </button>
                </div>

                <form className="ap-form" onSubmit={submit}>
                    <div className="ap-field">
                        <label className="ap-label">Tên sản phẩm</label>
                        <input className="ap-input" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="ap-field">
                        <label className="ap-label">Giá</label>
                        <input className="ap-input" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>

                    <div className="ap-field">
                        <label className="ap-label">Tồn kho</label>
                        <input className="ap-input" type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} required />
                    </div>

                    <div className="ap-field">
                        <label className="ap-label">Ảnh sản phẩm (≤ {MAX_MB}MB)</label>
                        <input className="ap-input" type="file" accept="image/*" onChange={onPickFile} />

                        {previewUrl && (
                            <div className="ap-preview">
                                <img src={previewUrl} alt="preview" />
                            </div>
                        )}
                    </div>

                    <div className="ap-actions">
                        <button className="ap-btn primary" type="submit" disabled={loading}>
                            {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                        <button className="ap-btn" type="button" onClick={() => nav("/admin/products")} disabled={loading}>
                            Huỷ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
