import { apiFetch } from "./http"

/* =====================
   TYPES
===================== */
export type Product = {
    id: number
    name: string
    price: number
    description?: string
    imageUrl?: string
    stock?: number
    categoryId?: number
}

/* =====================
   PUBLIC APIs
===================== */

// GET /api/products/public
export function getPublicProducts() {
    return apiFetch("/api/products/public") as Promise<Product[]>
}

// GET /api/products/public/{id}
export function getPublicProductById(id: number) {
    return apiFetch(`/api/products/public/${id}`) as Promise<Product>
}

// GET /api/products/public/search
export type ProductSearchParams = {
    name?: string
    categoryId?: number
    minPrice?: number
    maxPrice?: number
}

export function searchPublicProducts(params: ProductSearchParams) {
    const qs = new URLSearchParams()
    if (params.name) qs.append("name", params.name)
    if (params.categoryId !== undefined) qs.append("categoryId", String(params.categoryId))
    if (params.minPrice !== undefined) qs.append("minPrice", String(params.minPrice))
    if (params.maxPrice !== undefined) qs.append("maxPrice", String(params.maxPrice))

    const query = qs.toString()
    return apiFetch(`/api/products/public/search${query ? `?${query}` : ""}`) as Promise<Product[]>
}

/* =====================
   ADMIN APIs
===================== */

/**
 * POST /api/products/admin  (multipart)
 * Backend nhận:
 *  - name (string)
 *  - price (BigDecimal)
 *  - stock (Integer)
 *  - image (file, optional)
 */
export type CreateProductInput = {
    name: string
    price: number
    stock: number
    imageFile?: File | null
}

export async function createProduct(input: CreateProductInput) {
    const fd = new FormData()
    fd.append("name", input.name)
    fd.append("price", String(input.price))
    fd.append("stock", String(input.stock))
    if (input.imageFile) fd.append("image", input.imageFile)

    // ⚠️ apiFetch của bạn auto set Content-Type khi có body.
    // Với FormData, KHÔNG được set Content-Type thủ công.
    // => Mình gọi fetch trực tiếp cho chắc chắn.
    const BASE_URL = "http://localhost:8080" // gateway

    // nếu bạn muốn vẫn dùng apiFetch, cần sửa apiFetch để detect FormData (mình gửi bên dưới)
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "" // tuỳ bạn lưu
    const res = await fetch(`${BASE_URL}/api/products/admin`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
        credentials: "include",
    })

    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `HTTP ${res.status}`)
    }

    return (await res.json()) as Product
}

// PUT /api/products/admin/{id} (JSON)
export function updateProduct(id: number, product: Partial<Product>) {
    return apiFetch(`/api/products/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
    }) as Promise<Product>
}

// DELETE /api/products/admin/{id}
export function deleteProduct(id: number) {
    return apiFetch(`/api/products/admin/${id}`, {
        method: "DELETE",
    }) as Promise<void>
}

// PUT /api/products/admin/{id}/add-stock
export function addStock(id: number, quantity: number) {
    return apiFetch(`/api/products/admin/${id}/add-stock?quantity=${quantity}`, {
        method: "PUT",
    }) as Promise<void>
}

// PUT /api/products/admin/{id}/reduce-stock
export function reduceStock(id: number, quantity: number) {
    return apiFetch(`/api/products/admin/${id}/reduce-stock?quantity=${quantity}`, {
        method: "PUT",
    }) as Promise<void>
}
