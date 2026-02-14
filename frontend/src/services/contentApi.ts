import { apiFetch } from "./http"

// ===== Types =====
export type ArticleResponse = {
    id: number
    title: string
    summary?: string | null
    thumbnailUrl?: string | null
    content?: string | null
    published: boolean
    publishedAt?: string | null
    createdAt?: string
    updatedAt?: string
}

export type BannerResponse = {
    id: number
    position: string
    imageUrl: string
    linkUrl?: string | null
    title?: string | null
    active: boolean
    startAt?: string | null
    endAt?: string | null
    sortOrder: number
    createdAt?: string
    updatedAt?: string
}

export type PageResponse<T> = {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
}

// ===== Requests (Admin) =====
export type ArticleUpsertRequest = {
    title: string
    summary?: string | null
    thumbnailUrl?: string | null
    content?: string | null
    published?: boolean | null
}

export type BannerUpsertRequest = {
    position: string
    imageUrl: string
    linkUrl?: string | null
    title?: string | null
    active?: boolean | null
    startAt?: string | null
    endAt?: string | null
    sortOrder?: number | null
}

export type UploadResponse = { url: string }
// =====================
// PUBLIC APIs
// =====================

export function getPublicArticles(page = 0, size = 8) {
    return apiFetch<PageResponse<ArticleResponse>>(
        `/content/public/articles?page=${page}&size=${size}`
    )
}

export function getPublicArticleDetail(id: number) {
    return apiFetch<ArticleResponse>(
        `/content/public/articles/${id}`
    )
}

export function getPublicBanners(position: string) {
    return apiFetch<BannerResponse[]>(
        `/content/public/banners?position=${encodeURIComponent(position)}`
    )
}

// =====================
// ADMIN APIs
// =====================

export function adminGetArticles(page = 0, size = 20) {
    return apiFetch<PageResponse<ArticleResponse>>(
        `/content/admin/articles?page=${page}&size=${size}`
    )
}

export function adminGetArticleDetail(id: number) {
    return apiFetch<ArticleResponse>(
        `/content/admin/articles/${id}`
    )
}

export function adminCreateArticle(payload: ArticleUpsertRequest) {
    return apiFetch<ArticleResponse>(`/content/admin/articles`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}

export function adminUpdateArticle(id: number, payload: ArticleUpsertRequest) {
    return apiFetch<ArticleResponse>(`/content/admin/articles/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    })
}

export function adminDeleteArticle(id: number) {
    return apiFetch<void>(`/content/admin/articles/${id}`, {
        method: "DELETE",
    })
}

// ===== Banner ADMIN =====

export function adminGetBanners() {
    return apiFetch<BannerResponse[]>(`/content/admin/banners`)
}

export function adminGetBannerDetail(id: number) {
    return apiFetch<BannerResponse>(`/content/admin/banners/${id}`)
}

export function adminCreateBanner(payload: BannerUpsertRequest) {
    return apiFetch<BannerResponse>(`/content/admin/banners`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}

export function adminUpdateBanner(id: number, payload: BannerUpsertRequest) {
    return apiFetch<BannerResponse>(`/content/admin/banners/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    })
}

export function adminDeleteBanner(id: number) {
    return apiFetch<void>(`/content/admin/banners/${id}`, {
        method: "DELETE",
    })
}
// ===== Upload ADMIN =====
export function adminUploadFile(file: File) {
    const fd = new FormData()
    fd.append("file", file)

    return apiFetch<UploadResponse>("/api/content/admin/uploads", {
        method: "POST",
        body: fd,
    })
}