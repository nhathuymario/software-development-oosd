import { useEffect, useState } from "react"
import "../../assets/css/pages/HomePage.css"
import { getPublicArticles, type ArticleResponse } from "../../services/contentApi"

export default function ArticlesSection() {
    const [items, setItems] = useState<ArticleResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    async function load() {
        try {
            setLoading(true)
            setError(null)
            const page = await getPublicArticles(0, 4) // lấy 4 bài giống UI
            setItems(page.content || [])
        } catch (e: any) {
            setError(e?.message ?? "Không tải được bài viết")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <div className="hp-articles">
            <div className="hp-section-head">
                <h2 className="hp-title">Mạng xã hội thegioididong.com</h2>
                <button className="hp-link" onClick={() => alert("TODO: navigate trang bài viết")}>
                    Xem thêm →
                </button>
            </div>

            {loading && <div className="hp-skeleton-row">
                <div className="hp-skeleton-card" />
                <div className="hp-skeleton-card" />
                <div className="hp-skeleton-card" />
                <div className="hp-skeleton-card" />
            </div>}

            {error && <div className="state err">{error}</div>}

            {!loading && !error && items.length === 0 && (
                <div className="state">Chưa có bài viết</div>
            )}

            {!loading && !error && items.length > 0 && (
                <div className="hp-articles-grid">
                    {items.map((a) => (
                        <article
                            className="hp-article-card"
                            key={a.id}
                            onClick={() => alert(`TODO: open article ${a.id}`)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="hp-article-thumb">
                                {a.thumbnailUrl ? (
                                    <img src={a.thumbnailUrl} alt={a.title} loading="lazy" />
                                ) : (
                                    <div className="hp-thumb-placeholder">No image</div>
                                )}
                            </div>

                            <div className="hp-article-title" title={a.title}>
                                {a.title}
                            </div>
                            {a.summary && <div className="hp-article-summary">{a.summary}</div>}
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
