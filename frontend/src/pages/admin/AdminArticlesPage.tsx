import { useEffect, useMemo, useState } from "react"
import "../../assets/css/pages/admin-content.css"
import {
    adminCreateArticle,
    adminDeleteArticle,
    adminGetArticles,
    adminUpdateArticle,
    adminUploadFile,
    type ArticleResponse,
    type ArticleUpsertRequest,
} from "../../services/contentApi"

export default function AdminArticlesPage() {
    const [items, setItems] = useState<ArticleResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [page, setPage] = useState(0)
    const size = 20

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<ArticleResponse | null>(null)

    const [form, setForm] = useState<ArticleUpsertRequest>({
        title: "",
        summary: "",
        thumbnailUrl: "",
        content: "",
        published: false,
    })

    const [uploadingThumb, setUploadingThumb] = useState(false)

    const modalTitle = useMemo(() => (editing ? "Sửa bài viết" : "Thêm bài viết"), [editing])

    async function load() {
        try {
            setLoading(true)
            setError(null)
            const res = await adminGetArticles(page, size)
            setItems(res.content || [])
        } catch (e: any) {
            setError(e?.message ?? "Không tải được bài viết")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    function openCreate() {
        setEditing(null)
        setForm({ title: "", summary: "", thumbnailUrl: "", content: "", published: false })
        setOpen(true)
    }

    function openEdit(a: ArticleResponse) {
        setEditing(a)
        setForm({
            title: a.title || "",
            summary: a.summary ?? "",
            thumbnailUrl: a.thumbnailUrl ?? "",
            content: a.content ?? "",
            published: a.published ?? false,
        })
        setOpen(true)
    }

    async function onPickThumb(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]
        if (!f) return

        try {
            setUploadingThumb(true)
            const res = await adminUploadFile(f)
            setForm((prev) => ({ ...prev, thumbnailUrl: res.url }))
        } catch (err: any) {
            alert(err?.message ?? "Upload thumbnail thất bại")
        } finally {
            setUploadingThumb(false)
            e.target.value = ""
        }
    }

    async function submit() {
        try {
            if (!form.title.trim()) {
                alert("Nhập tiêu đề")
                return
            }

            if (editing) await adminUpdateArticle(editing.id, form)
            else await adminCreateArticle(form)

            setOpen(false)
            await load()
        } catch (e: any) {
            alert(e?.message ?? "Lưu thất bại")
        }
    }

    async function remove(id: number, title: string) {
        if (!confirm(`Xoá bài viết "${title}" ?`)) return
        try {
            await adminDeleteArticle(id)
            setItems((prev) => prev.filter((x) => x.id !== id))
        } catch (e: any) {
            alert(e?.message ?? "Xoá thất bại")
        }
    }

    return (
        <div className="ac-wrap">
            <div className="ac-head">
                <h2 className="ac-title">📰 Quản lý Bài viết</h2>
                <button className="btn primary" onClick={openCreate}>
                    + Thêm bài viết
                </button>
            </div>

            {loading && <div className="state">Đang tải...</div>}
            {error && <div className="state err">{error}</div>}

            {!loading && !error && (
                <div className="ac-card">
                    <table className="ac-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu đề</th>
                            <th>Trạng thái</th>
                            <th>Updated</th>
                            <th className="right">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((a) => (
                            <tr key={a.id}>
                                <td className="mono">{a.id}</td>
                                <td className="ac-td-title">
                                    <div className="ac-title-line">{a.title}</div>
                                    {a.summary && <div className="ac-sub">{a.summary}</div>}
                                </td>
                                <td>
                    <span className={a.published ? "badge ok" : "badge"}>
                      {a.published ? "PUBLISHED" : "DRAFT"}
                    </span>
                                </td>
                                <td className="mono">{(a.updatedAt || "").slice(0, 19).replace("T", " ")}</td>
                                <td className="right">
                                    <button className="btn" onClick={() => openEdit(a)}>
                                        Sửa
                                    </button>
                                    <button className="btn danger" onClick={() => remove(a.id, a.title)}>
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="ac-empty">
                                    Chưa có bài viết
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    <div className="ac-pager">
                        <button className="btn" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                            ← Trang trước
                        </button>
                        <div className="mono">Page: {page + 1}</div>
                        <button className="btn" onClick={() => setPage((p) => p + 1)}>
                            Trang sau →
                        </button>
                    </div>
                </div>
            )}

            {open && (
                <div className="ac-modal">
                    <div className="ac-modal-backdrop" onClick={() => setOpen(false)} />
                    <div className="ac-modal-card">
                        <div className="ac-modal-head">
                            <div className="ac-modal-title">{modalTitle}</div>
                            <button className="btn" onClick={() => setOpen(false)}>
                                ✕
                            </button>
                        </div>

                        <div className="ac-form">
                            <label className="ac-label">Tiêu đề</label>
                            <input
                                className="input"
                                value={form.title}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            />

                            <label className="ac-label">Tóm tắt</label>
                            <input
                                className="input"
                                value={form.summary ?? ""}
                                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                            />

                            <label className="ac-label">Thumbnail</label>
                            <div className="ac-upload-row">
                                <input type="file" accept="image/*" onChange={onPickThumb} />
                                {uploadingThumb && <span className="mono">Uploading...</span>}
                            </div>

                            <input
                                className="input"
                                placeholder="Hoặc dán URL thumbnail"
                                value={form.thumbnailUrl ?? ""}
                                onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
                            />

                            {form.thumbnailUrl && (
                                <div className="ac-preview">
                                    <img src={form.thumbnailUrl} alt="thumbnail preview" />
                                </div>
                            )}

                            <label className="ac-label">Nội dung</label>
                            <textarea
                                className="input ac-textarea"
                                value={form.content ?? ""}
                                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                            />

                            <label className="ac-check">
                                <input
                                    type="checkbox"
                                    checked={!!form.published}
                                    onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                                />
                                <span>Publish ngay</span>
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
