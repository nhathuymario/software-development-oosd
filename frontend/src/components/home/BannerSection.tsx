import { useEffect, useMemo, useState } from "react"
import "../../assets/css/pages/HomePage.css"
import { getPublicBanners, type BannerResponse } from "../../services/contentApi"

export default function BannerSection() {
    const [items, setItems] = useState<BannerResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    async function load() {
        try {
            setLoading(true)
            setError(null)
            const data = await getPublicBanners("HOME_TOP")
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

    const first = useMemo(() => items?.[0], [items])

    if (loading) {
        return <div className="hp-banner hp-banner-skeleton" />
    }

    if (error) {
        return <div className="state err">{error}</div>
    }

    if (!first) {
        return <div className="state">Chưa có banner</div>
    }

    return (
        <div className="hp-banner">
            <a
                href={first.linkUrl || "#"}
                onClick={(e) => {
                    if (!first.linkUrl) e.preventDefault()
                }}
                className="hp-banner-link"
            >
                <img src={first.imageUrl} alt={first.title || "Banner"} loading="lazy" />
            </a>
        </div>
    )
}
