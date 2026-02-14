import { useEffect, useState } from "react"
import "../../assets/css/pages/admin-content.css"
import {
    adminCreateBanner,
    adminDeleteBanner,
    adminGetBanners,
    adminUpdateBanner,
    adminUploadFile,
    type BannerResponse,
    type BannerUpsertRequest,
} from "../../services/contentApi"

export default function AdminBannersPage() {
    const [items, setItems] = useState<BannerResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<BannerResponse | null>(null)

    const [form, setForm] = useState<BannerUpsertRequest>({
        position: "HOME_TOP",
        imageUrl: "",
        linkUrl: "",
        title: "",
        active: true,
        sortOrder: 0,
    })

    const [uploadingImg, setUploadingImg] = useState(false)

    async function load() {
        try {
            setLoading(true)
            setError(null)
            const data = await adminGetBanners()
            setItems(data || [])
        } catch (e: any) {
            setError(e?.message ?? "Không tải được banner")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    function openCreate() {
        setEditing(null)
        setForm({ position: "HOME_TOP", imageUrl: "", linkUrl: "", title: "", active: true, sortOrder: 0 })
        setOpen(true)
    }

    function openEdit(b: BannerResponse) {
        setEditing(b)
        setForm({
            position: b.position,
            imageUrl: b.imageUrl,
            linkUrl: b.linkUrl ?? "",
            title: b.title ?? "",
            active: b.active,
            sortOrder: b.sortOrder ?? 0,
            startAt: b.startAt ?? null,
            endAt: b.endAt ?? null,
        })
        setOpen(true)
    }

    async function onPickBanner(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]
        if (!f) return

        try {
            setUploadingImg(true)
            const res = await adminUploadFile(f)
            setForm((prev) => ({ ...prev, imageUrl: res.url }))
        } catch (err: any) {
            alert(err?.message ?? "Upload banner thất bại")
        } finally {
            setUploadingImg(false)
            e.target.value = ""
        }
    }

    async function submit() {
        try {
            if (!form.position.trim()) return alert("Nhập position")
            if (!form.imageUrl.trim()) return alert("Nhập imageUrl")

            if (editing) await adminUpdateBanner(editing.id, form)
            else await adminCreateBanner(form)

            setOpen(false)
            await load()
        } catch (e: any) {
            alert(e?.message ?? "Lưu thất bại")
        }
    }

    async function remove(id: number, title?: string | null) {
        if (!confirm(`Xoá banner "${title || id}" ?`)) return
        try {
            await adminDeleteBanner(id)
            setItems((prev) => prev.filter((x) => x.id !== id))
        } catch (e: any) {
            alert(e?.message ?? "Xoá thất bại")
        }
    }

    return (
        <div className="ac-wrap">
            <div className="ac-head">
                <h2 className="ac-title">📢 Quản lý Banner</h2>
                <button className="btn primary" onClick={openCreate}>
                    + Thêm banner
                </button>
            </div>

            {loading && <div className="state">Đang tải...</div>}
            {error && <div className="state err">{error}</div>}

            {!loading && !error && (
                <div className="ac-grid">
                    {items.map((b) => (
                        <div className="ac-banner-card" key={b.id}>
                            <div className="ac-banner-thumb">
                                <img src={b.imageUrl} alt={b.title || "Banner"} loading="lazy" />
                            </div>

                            <div className="ac-banner-meta">
                                <div className="ac-banner-row">
                                    <span className="badge">{b.position}</span>
                                    <span className={b.active ? "badge ok" : "badge"}>{b.active ? "ACTIVE" : "OFF"}</span>
                                    <span className="mono">#{b.sortOrder}</span>
                                </div>

                                <div className="ac-banner-title" title={b.title || ""}>
                                    {b.title || "(no title)"}
                                </div>

                                {b.linkUrl && (
                                    <div className="ac-sub" title={b.linkUrl}>
                                        {b.linkUrl}
                                    </div>
                                )}

                                <div className="ac-actions right">
                                    <button className="btn" onClick={() => openEdit(b)}>
                                        Sửa
                                    </button>
                                    <button className="btn danger" onClick={() => remove(b.id, b.title)}>
                                        Xoá
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && <div className="state">Chưa có banner</div>}
                </div>
            )}

            {open && (
                <div className="ac-modal">
                    <div className="ac-modal-backdrop" onClick={() => setOpen(false)} />
                    <div className="ac-modal-card">
                        <div className="ac-modal-head">
                            <div className="ac-modal-title">{editing ? "Sửa banner" : "Thêm banner"}</div>
                            <button className="btn" onClick={() => setOpen(false)}>
                                ✕
                            </button>
                        </div>

                        <div className="ac-form">
                            <label className="ac-label">Position</label>
                            <select
                                className="input"
                                value={form.position}
                                onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                            >
                                <option value="HOME_TOP">HOME_TOP</option>
                                <option value="HOME_MIDDLE">HOME_MIDDLE</option>
                                <option value="HOME_BOTTOM">HOME_BOTTOM</option>
                            </select>

                            <label className="ac-label">Ảnh banner</label>
                            <div className="ac-upload-row">
                                <input type="file" accept="image/*" onChange={onPickBanner} />
                                {uploadingImg && <span className="mono">Uploading...</span>}
                            </div>

                            <input
                                className="input"
                                placeholder="Hoặc dán Image URL"
                                value={form.imageUrl}
                                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                            />

                            {form.imageUrl && (
                                <div className="ac-preview">
                                    <img src={form.imageUrl} alt="banner preview" />
                                </div>
                            )}

                            <label className="ac-label">Link URL</label>
                            <input
                                className="input"
                                value={form.linkUrl ?? ""}
                                onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                            />

                            <label className="ac-label">Title</label>
                            <input
                                className="input"
                                value={form.title ?? ""}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            />

                            <label className="ac-label">Sort order</label>
                            <input
                                className="input"
                                inputMode="numeric"
                                value={String(form.sortOrder ?? 0)}
                                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value || 0) }))}
                            />

                            <label className="ac-check">
                                <input
                                    type="checkbox"
                                    checked={!!form.active}
                                    onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                                />
                                <span>Active</span>
                            </label>

                            <div className="ac-actions">
                                <button className="btn" onClick={() => setOpen(false)}>
                                    Huỷ
                                </button>
                                <button className="btn primary" onClick={submit}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
